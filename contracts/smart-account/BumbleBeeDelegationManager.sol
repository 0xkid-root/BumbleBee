// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title BumbleBeeDelegationManager
 * @dev Contract for managing delegations with caveats for smart accounts
 */
contract BumbleBeeDelegationManager is Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Events
    event DelegationCreated(bytes32 indexed delegationId, address indexed delegator, address indexed delegate, uint256 expiresAt);
    event DelegationRevoked(bytes32 indexed delegationId, address indexed delegator, address indexed delegate);
    event CaveatAdded(bytes32 indexed delegationId, bytes32 indexed caveatType, bytes terms);
    event DelegationRedeemed(bytes32 indexed delegationId, address indexed delegate);

    // Structs
    struct Delegation {
        bytes32 id;
        address delegator;
        address delegate;
        uint256 createdAt;
        uint256 expiresAt;
        bool revoked;
        bool redeemed;
        bytes signature;
    }

    struct Caveat {
        bytes32 caveatType;
        bytes terms;
        address enforcer;
    }

    // State variables
    mapping(bytes32 => Delegation) public delegations;
    mapping(bytes32 => Caveat[]) public delegationCaveats;
    mapping(address => bytes32[]) public delegatorDelegations;
    mapping(address => bytes32[]) public delegateDelegations;

    // Known caveat types
    bytes32 public constant NATIVE_TOKEN_TRANSFER_AMOUNT = keccak256("nativeTokenTransferAmount");
    bytes32 public constant TIME_LIMIT = keccak256("timeLimit");
    bytes32 public constant ALLOWLISTED_METHODS = keccak256("allowlistedMethods");
    bytes32 public constant MAX_USES = keccak256("maxUses");

    // Known enforcer addresses
    address public constant TIME_LIMIT_ENFORCER = 0x22Ae4c4919C3aB4B5FC309713Bf707569B74876F;

    // Constructor
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Create a new delegation
     * @param delegate Address to delegate to
     * @param expiresAt Timestamp when the delegation expires
     * @param signature Signature from the delegator
     * @return delegationId The ID of the created delegation
     */
    function createDelegation(
        address delegate,
        uint256 expiresAt,
        bytes calldata signature
    ) external returns (bytes32 delegationId) {
        require(delegate != address(0), "Invalid delegate address");
        require(expiresAt > block.timestamp, "Invalid expiration time");
        
        delegationId = keccak256(abi.encodePacked(
            msg.sender,
            delegate,
            block.timestamp,
            expiresAt
        ));
        
        Delegation storage delegation = delegations[delegationId];
        delegation.id = delegationId;
        delegation.delegator = msg.sender;
        delegation.delegate = delegate;
        delegation.createdAt = block.timestamp;
        delegation.expiresAt = expiresAt;
        delegation.revoked = false;
        delegation.redeemed = false;
        delegation.signature = signature;
        
        delegatorDelegations[msg.sender].push(delegationId);
        delegateDelegations[delegate].push(delegationId);
        
        emit DelegationCreated(delegationId, msg.sender, delegate, expiresAt);
        return delegationId;
    }

    /**
     * @dev Add a caveat to a delegation
     * @param delegationId ID of the delegation
     * @param caveatType Type of the caveat
     * @param terms Terms of the caveat
     * @param enforcer Address of the enforcer contract
     */
    function addCaveat(
        bytes32 delegationId,
        bytes32 caveatType,
        bytes calldata terms,
        address enforcer
    ) external {
        Delegation storage delegation = delegations[delegationId];
        
        require(delegation.delegator == msg.sender, "Not delegation owner");
        require(!delegation.revoked, "Delegation revoked");
        require(!delegation.redeemed, "Delegation already redeemed");
        
        Caveat memory caveat = Caveat({
            caveatType: caveatType,
            terms: terms,
            enforcer: enforcer
        });
        
        delegationCaveats[delegationId].push(caveat);
        
        emit CaveatAdded(delegationId, caveatType, terms);
    }

    /**
     * @dev Revoke a delegation
     * @param delegationId ID of the delegation to revoke
     */
    function revokeDelegation(bytes32 delegationId) external {
        Delegation storage delegation = delegations[delegationId];
        
        require(delegation.delegator == msg.sender, "Not delegation owner");
        require(!delegation.revoked, "Already revoked");
        
        delegation.revoked = true;
        
        emit DelegationRevoked(delegationId, delegation.delegator, delegation.delegate);
    }

    /**
     * @dev Redeem a delegation
     * @param delegationId ID of the delegation to redeem
     */
    function redeemDelegation(bytes32 delegationId) external {
        Delegation storage delegation = delegations[delegationId];
        
        require(delegation.delegate == msg.sender, "Not delegate");
        require(!delegation.revoked, "Delegation revoked");
        require(!delegation.redeemed, "Already redeemed");
        require(block.timestamp < delegation.expiresAt, "Delegation expired");
        
        delegation.redeemed = true;
        
        emit DelegationRedeemed(delegationId, msg.sender);
    }

    /**
     * @dev Verify if a delegation is valid
     * @param delegationId ID of the delegation to verify
     * @return isValid True if the delegation is valid
     */
    function verifyDelegation(bytes32 delegationId) external view returns (bool isValid) {
        Delegation storage delegation = delegations[delegationId];
        
        if (delegation.revoked) return false;
        if (block.timestamp >= delegation.expiresAt) return false;
        
        // Verify caveats
        Caveat[] storage caveats = delegationCaveats[delegationId];
        for (uint256 i = 0; i < caveats.length; i++) {
            Caveat storage caveat = caveats[i];
            
            if (caveat.caveatType == TIME_LIMIT) {
                uint256 expirationTime = abi.decode(caveat.terms, (uint256));
                if (block.timestamp > expirationTime) return false;
            }
            // Other caveat types would be checked here
        }
        
        return true;
    }

    /**
     * @dev Get all caveats for a delegation
     * @param delegationId ID of the delegation
     * @return Array of caveats
     */
    function getDelegationCaveats(bytes32 delegationId) external view returns (Caveat[] memory) {
        return delegationCaveats[delegationId];
    }

    /**
     * @dev Get all delegations for a delegator
     * @param delegator Address of the delegator
     * @return Array of delegation IDs
     */
    function getDelegatorDelegations(address delegator) external view returns (bytes32[] memory) {
        return delegatorDelegations[delegator];
    }

    /**
     * @dev Get all delegations for a delegate
     * @param delegate Address of the delegate
     * @return Array of delegation IDs
     */
    function getDelegateDelegations(address delegate) external view returns (bytes32[] memory) {
        return delegateDelegations[delegate];
    }

    /**
     * @dev Verify a delegation signature
     * @param delegationId ID of the delegation
     * @param message Message that was signed
     * @param signature Signature to verify
     * @return True if the signature is valid, false otherwise
     */
    function verifyDelegationSignature(
        bytes32 delegationId,
        bytes32 message,
        bytes calldata signature
    ) external view returns (bool) {
        Delegation storage delegation = delegations[delegationId];
        
        require(!delegation.revoked, "Delegation revoked");
        require(block.timestamp < delegation.expiresAt, "Delegation expired");
        
        address signer = message.toEthSignedMessageHash().recover(signature);
        return signer == delegation.delegator;
    }
}
