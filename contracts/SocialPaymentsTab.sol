// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SocialPaymentTabs is ReentrancyGuard {
    struct Tab {
        uint256 id;
        string name;
        address creator;
        bool isActive;
        uint256 balance;
        address[] members;
        uint256 memberCount;
        uint256 nextExpenseId;
        mapping(uint256 => Expense) expenses;
        uint256 nextPaymentRequestId;
        mapping(uint256 => PaymentRequest) paymentRequests;
        address streamRecipient;
        uint256 streamAmountPerSecond;
        uint256 streamDurationSeconds;
        uint256 streamStartTime;
        uint256 streamReleased;
        bool isStreamActive;
    }

    struct Expense {
        uint256 id;
        address payer;
        uint256 amount;
        string description;
        address[] beneficiaries;
        uint256 timestamp;
    }

    struct PaymentRequest {
        uint256 id;
        address requester;
        address recipient;
        uint256 amount;
        bool paid;
        uint256 timestamp;
    }

    uint256 public nextTabId;
    mapping(uint256 => Tab) public tabs;
    mapping(address => uint256[]) public userTabs;

    event TabCreated(uint256 indexed tabId, address indexed creator, string name);
    event MemberAdded(uint256 indexed tabId, address indexed member);
    event MemberRemoved(uint256 indexed tabId, address indexed member);
    event ExpenseAdded(uint256 indexed tabId, uint256 indexed expenseId, address indexed payer, uint256 amount);
    event PaymentRequestCreated(uint256 indexed tabId, uint256 indexed paymentRequestId, address indexed requester, address indexed recipient, uint256 amount);
    event PaymentRequestPaid(uint256 indexed tabId, uint256 indexed paymentRequestId, address indexed recipient, uint256 amount);
    event StreamSetup(uint256 indexed tabId, address indexed recipient, uint256 amountPerSecond, uint256 durationSeconds);
    event StreamReleased(uint256 indexed tabId, address indexed recipient, uint256 amount);
    event StreamCancelled(uint256 indexed tabId, address indexed recipient);

    modifier onlyTabMember(uint256 tabId) {
        Tab storage tab = tabs[tabId];
        require(tab.isActive, "Tab is not active");
        bool isMember = false;
        for (uint256 i = 0; i < tab.members.length; i++) {
            if (tab.members[i] == msg.sender) {
                isMember = true;
                break;
            }
        }
        require(isMember || tab.creator == msg.sender, "Not a tab member");
        _;
    }

    modifier onlyTabCreator(uint256 tabId) {
        require(tabs[tabId].creator == msg.sender, "Not the tab creator");
        _;
    }

    function createTab(string memory name) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        uint256 tabId = nextTabId++;
        Tab storage tab = tabs[tabId];
        tab.id = tabId;
        tab.name = name;
        tab.creator = msg.sender;
        tab.isActive = true;
        tab.members.push(msg.sender);
        tab.memberCount = 1;
        userTabs[msg.sender].push(tabId);
        emit TabCreated(tabId, msg.sender, name);
        return tabId;
    }

    function addMember(uint256 tabId, address member) external onlyTabMember(tabId) {
        require(member != address(0), "Invalid member address");
        Tab storage tab = tabs[tabId];
        for (uint256 i = 0; i < tab.members.length; i++) {
            require(tab.members[i] != member, "Member already exists");
        }
        tab.members.push(member);
        tab.memberCount++;
        userTabs[member].push(tabId);
        emit MemberAdded(tabId, member);
    }

    function removeMember(uint256 tabId, address member) external onlyTabMember(tabId) {
        require(member != address(0), "Invalid member address");
        Tab storage tab = tabs[tabId];
        require(msg.sender == tab.creator || msg.sender == member, "Not authorized");
        if (member == tab.creator) {
            require(tab.memberCount == 1, "Creator cannot leave with active members");
        }
        for (uint256 i = 0; i < tab.members.length; i++) {
            if (tab.members[i] == member) {
                tab.members[i] = tab.members[tab.members.length - 1];
                tab.members.pop();
                tab.memberCount--;
                if (tab.memberCount == 0) {
                    tab.isActive = false;
                }
                emit MemberRemoved(tabId, member);
                break;
            }
        }
        // Update userTabs
        uint256[] storage tabs = userTabs[member];
        for (uint256 i = 0; i < tabs.length; i++) {
            if (tabs[i] == tabId) {
                tabs[i] = tabs[tabs.length - 1];
                tabs.pop();
                break;
            }
        }
    }

    function addExpense(
        uint256 tabId,
        uint256 amount,
        string memory description,
        address[] memory beneficiaries
    ) external payable onlyTabMember(tabId) nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value == amount, "Incorrect ETH amount sent");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(beneficiaries.length > 0, "At least one beneficiary required");
        Tab storage tab = tabs[tabId];
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            bool isMember = false;
            for (uint256 j = 0; j < tab.members.length; j++) {
                if (tab.members[j] == beneficiaries[i]) {
                    isMember = true;
                    break;
                }
            }
            require(isMember, "Beneficiary not a member");
        }
        uint256 expenseId = tab.nextExpenseId++;
        Expense storage expense = tab.expenses[expenseId];
        expense.id = expenseId;
        expense.payer = msg.sender;
        expense.amount = amount;
        expense.description = description;
        expense.beneficiaries = beneficiaries;
        expense.timestamp = block.timestamp;
        tab.balance += amount;
        emit ExpenseAdded(tabId, expenseId, msg.sender, amount);
    }

    function createPaymentRequest(
        uint256 tabId,
        address recipient,
        uint256 amount
    ) external onlyTabMember(tabId) returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient address");
        Tab storage tab = tabs[tabId];
        bool isMember = false;
        for (uint256 i = 0; i < tab.members.length; i++) {
            if (tab.members[i] == recipient) {
                isMember = true;
                break;
            }
        }
        require(isMember, "Recipient not a member");
        uint256 requestId = tab.nextPaymentRequestId++;
        PaymentRequest storage request = tab.paymentRequests[requestId];
        request.id = requestId;
        request.requester = msg.sender;
        request.recipient = recipient;
        request.amount = amount;
        request.paid = false;
        request.timestamp = block.timestamp;
        emit PaymentRequestCreated(tabId, requestId, msg.sender, recipient, amount);
        return requestId;
    }

    function payPaymentRequest(uint256 tabId, uint256 requestId) external onlyTabMember(tabId) nonReentrant {
        Tab storage tab = tabs[tabId];
        PaymentRequest storage request = tab.paymentRequests[requestId];
        require(request.id == requestId, "Payment request does not exist");
        require(!request.paid, "Request already paid");
        require(tab.balance >= request.amount, "Insufficient tab balance");
        request.paid = true;
        tab.balance -= request.amount;
        (bool success, ) = request.recipient.call{value: request.amount}("");
        require(success, "Payment failed");
        emit PaymentRequestPaid(tabId, requestId, request.recipient, request.amount);
    }

    function setupStream(
        uint256 tabId,
        address recipient,
        uint256 amountPerSecond,
        uint256 durationSeconds
    ) external onlyTabCreator(tabId) nonReentrant {
        Tab storage tab = tabs[tabId];
        require(!tab.isStreamActive, "Stream already active");
        require(recipient != address(0), "Invalid recipient");
        require(amountPerSecond > 0, "Amount must be positive");
        require(durationSeconds > 0, "Duration must be positive");
        uint256 totalAmount = amountPerSecond * durationSeconds;
        require(tab.balance >= totalAmount, "Insufficient tab balance");
        tab.streamRecipient = recipient;
        tab.streamAmountPerSecond = amountPerSecond;
        tab.streamDurationSeconds = durationSeconds;
        tab.streamStartTime = block.timestamp;
        tab.streamReleased = 0;
        tab.isStreamActive = true;
        emit StreamSetup(tabId, recipient, amountPerSecond, durationSeconds);
    }

    function releaseStream(uint256 tabId) external nonReentrant {
        Tab storage tab = tabs[tabId];
        require(tab.isActive, "Tab is not active");
        require(tab.isStreamActive, "No active stream");
        require(block.timestamp >= tab.streamStartTime, "Stream not started");
        uint256 elapsed = block.timestamp > tab.streamStartTime + tab.streamDurationSeconds
            ? tab.streamDurationSeconds
            : block.timestamp - tab.streamStartTime;
        uint256 totalAmount = tab.streamAmountPerSecond * tab.streamDurationSeconds;
        uint256 releasable = (tab.streamAmountPerSecond * elapsed) - tab.streamReleased;
        require(releasable > 0, "No funds to release");
        tab.streamReleased += releasable;
        if (tab.streamReleased >= totalAmount || block.timestamp >= tab.streamStartTime + tab.streamDurationSeconds) {
            tab.isStreamActive = false;
        }
        (bool success, ) = tab.streamRecipient.call{value: releasable}("");
        require(success, "Stream release failed");
        emit StreamReleased(tabId, tab.streamRecipient, releasable);
    }

    function cancelStream(uint256 tabId) external onlyTabCreator(tabId) nonReentrant {
        Tab storage tab = tabs[tabId];
        require(tab.isStreamActive, "No active stream");
        uint256 totalAmount = tab.streamAmountPerSecond * tab.streamDurationSeconds;
        uint256 remaining = totalAmount - tab.streamReleased;
        tab.isStreamActive = false;
        tab.streamReleased = totalAmount;
        tab.balance += remaining;
        emit StreamCancelled(tabId, tab.streamRecipient);
    }

    function getTab(uint256 tabId) external view returns (string memory name, address creator, uint256 balance, uint256 memberCount, bool isActive) {
        Tab storage tab = tabs[tabId];
        require(tab.creator != address(0), "Tab does not exist");
        return (tab.name, tab.creator, tab.balance, tab.memberCount, tab.isActive);
    }

    function getTabMembers(uint256 tabId) external view returns (address[] memory) {
        require(tabs[tabId].creator != address(0), "Tab does not exist");
        return tabs[tabId].members;
    }

    function getUserTabs(address user) external view returns (uint256[] memory) {
        return userTabs[user];
    }

    receive() external payable {
        revert("Direct ETH deposits not allowed");
    }
}