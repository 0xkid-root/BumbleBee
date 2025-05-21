// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BumbleBeeSmartAccount.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

/**
 * @title BumbleBeeSmartAccountFactory
 * @dev Factory contract for deploying BumbleBeeSmartAccount instances
 * @notice Supports ERC-4337 Account Abstraction, ERC-7715 Wallet Permissions, and ERC-5792 Wallet Calls
 */
contract BumbleBeeSmartAccountFactory is Ownable {
    // Events
    event SmartAccountCreated(address indexed owner, address indexed smartAccount, bytes32 salt);
    event SmartAccountRegistered(address indexed owner, address indexed smartAccount);
    event AccountDeployed(address indexed account, address indexed owner, address indexed entryPoint);

    // State variables
    mapping(address => address[]) public userSmartAccounts;
    mapping(address => bool) public registeredSmartAccounts;
    address public immutable entryPoint;
    
    // Constructor
    constructor(address initialOwner, address _entryPoint) Ownable(initialOwner) {
        entryPoint = _entryPoint;
    }

    /**
     * @dev Create a new smart account for a user
     * @param owner Address that will own the smart account
     * @param salt Random value to ensure unique address generation
     * @return smartAccount Address of the created smart account
     */
    function createSmartAccount(address owner, bytes32 salt) external returns (address smartAccount) {
        require(owner != address(0), "Invalid owner address");
        
        // Generate a deterministic address using CREATE2
        bytes memory bytecode = abi.encodePacked(
            type(BumbleBeeSmartAccount).creationCode,
            abi.encode(owner, entryPoint)
        );
        
        // Deploy the smart account
        smartAccount = Create2.deploy(0, salt, bytecode);
        
        // Register the smart account
        userSmartAccounts[owner].push(smartAccount);
        registeredSmartAccounts[smartAccount] = true;
        
        emit SmartAccountCreated(owner, smartAccount, salt);
        emit AccountDeployed(smartAccount, owner, entryPoint);
        return smartAccount;
    }

    /**
     * @dev Register an existing smart account
     * @param owner Address that owns the smart account
     * @param smartAccount Address of the smart account to register
     */
    function registerSmartAccount(address owner, address smartAccount) external onlyOwner {
        require(owner != address(0), "Invalid owner address");
        require(smartAccount != address(0), "Invalid smart account address");
        require(!registeredSmartAccounts[smartAccount], "Smart account already registered");
        
        // Verify that the smart account is owned by the owner
        BumbleBeeSmartAccount account = BumbleBeeSmartAccount(payable(smartAccount));
        require(account.owner() == owner, "Owner mismatch");
        
        // Register the smart account
        userSmartAccounts[owner].push(smartAccount);
        registeredSmartAccounts[smartAccount] = true;
        
        emit SmartAccountRegistered(owner, smartAccount);
        emit AccountDeployed(smartAccount, owner, entryPoint);
    }

    /**
     * @dev Get all smart accounts for a user
     * @param owner Address of the user
     * @return Array of smart account addresses
     */
    function getSmartAccounts(address owner) external view returns (address[] memory) {
        return userSmartAccounts[owner];
    }

    /**
     * @dev Compute the address of a smart account before it is deployed
     * @param owner Address that will own the smart account
     * @param salt Random value to ensure unique address generation
     * @return The computed address of the smart account
     */
    function computeSmartAccountAddress(address owner, bytes32 salt) external view returns (address) {
        bytes memory bytecode = abi.encodePacked(
            type(BumbleBeeSmartAccount).creationCode,
            abi.encode(owner, entryPoint)
        );
        
        return Create2.computeAddress(salt, keccak256(bytecode));
    }
    
    /**
     * @dev Create a new smart account for a user with ERC-4337 initialization code
     * @param owner Address that will own the smart account
     * @param salt Random value to ensure unique address generation
     * @return smartAccount Address of the created smart account
     * @return initCode Initialization code for ERC-4337
     */
    function createSmartAccountWithInitCode(address owner, bytes32 salt) external returns (address smartAccount, bytes memory initCode) {
        require(owner != address(0), "Invalid owner address");
        
        // Generate initialization code for ERC-4337
        initCode = abi.encodePacked(
            address(this),
            abi.encodeWithSelector(
                this.createSmartAccount.selector,
                owner,
                salt
            )
        );
        
        // Compute the smart account address
        smartAccount = computeSmartAccountAddress(owner, salt);
        
        return (smartAccount, initCode);
    }
    
    /**
     * @dev Create a smart account with ERC-7715 permissions
     * @param owner Address that will own the smart account
     * @param delegate Address that will have permissions
     * @param permissionType Type of permission
     * @param permissionData Permission data
     * @param expiry Expiry timestamp
     * @param salt Random value to ensure unique address generation
     * @return smartAccount Address of the created smart account
     * @return permissionId ID of the created permission
     */
    function createSmartAccountWithPermission(
        address owner,
        address delegate,
        string calldata permissionType,
        bytes calldata permissionData,
        uint256 expiry,
        bytes32 salt
    ) external returns (address smartAccount, bytes32 permissionId) {
        // Create the smart account
        smartAccount = createSmartAccount(owner, salt);
        
        // Grant permission
        BumbleBeeSmartAccount account = BumbleBeeSmartAccount(payable(smartAccount));
        permissionId = account.grantPermission(delegate, permissionType, permissionData, expiry, "");
        
        return (smartAccount, permissionId);
    }
}
