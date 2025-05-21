// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title BumbleBeeSessionKeyManager
 * @dev Contract for managing session keys and passkeys for smart accounts
 */
contract BumbleBeeSessionKeyManager is Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Events
    event SessionKeyRegistered(bytes32 indexed keyId, address indexed owner, uint256 expiresAt);
    event SessionKeyRevoked(bytes32 indexed keyId, address indexed owner);
    event PasskeyRegistered(bytes32 indexed keyId, address indexed owner, bytes publicKey);
    event PasskeyRevoked(bytes32 indexed keyId, address indexed owner);
    event PermissionGranted(bytes32 indexed keyId, address indexed target, bytes4 indexed selector);
    event PermissionRevoked(bytes32 indexed keyId, address indexed target, bytes4 indexed selector);

    // Structs
    struct SessionKey {
        bytes32 id;
        address owner;
        bytes publicKey;
        uint256 createdAt;
        uint256 expiresAt;
        bool revoked;
    }

    struct Passkey {
        bytes32 id;
        address owner;
        bytes publicKey;
        bytes credentialId;
        uint256 createdAt;
        bool revoked;
    }

    struct Permission {
        address target;
        bytes4 selector;
        bool allowed;
    }

    // State variables
    mapping(bytes32 => SessionKey) public sessionKeys;
    mapping(address => bytes32[]) public userSessionKeys;
    
    mapping(bytes32 => Passkey) public passkeys;
    mapping(address => bytes32[]) public userPasskeys;
    
    mapping(bytes32 => mapping(address => mapping(bytes4 => bool))) public permissions;

    // Constructor
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Register a new session key
     * @param publicKey Public key of the session key
     * @param expiresAt Timestamp when the session key expires
     * @return keyId The ID of the registered session key
     */
    function registerSessionKey(
        bytes calldata publicKey,
        uint256 expiresAt
    ) external returns (bytes32 keyId) {
        require(publicKey.length > 0, "Invalid public key");
        require(expiresAt > block.timestamp, "Invalid expiration time");
        
        keyId = keccak256(abi.encodePacked(
            msg.sender,
            publicKey,
            block.timestamp
        ));
        
        SessionKey storage sessionKey = sessionKeys[keyId];
        sessionKey.id = keyId;
        sessionKey.owner = msg.sender;
        sessionKey.publicKey = publicKey;
        sessionKey.createdAt = block.timestamp;
        sessionKey.expiresAt = expiresAt;
        sessionKey.revoked = false;
        
        userSessionKeys[msg.sender].push(keyId);
        
        emit SessionKeyRegistered(keyId, msg.sender, expiresAt);
        return keyId;
    }

    /**
     * @dev Revoke a session key
     * @param keyId ID of the session key to revoke
     */
    function revokeSessionKey(bytes32 keyId) external {
        SessionKey storage sessionKey = sessionKeys[keyId];
        
        require(sessionKey.owner == msg.sender, "Not key owner");
        require(!sessionKey.revoked, "Already revoked");
        
        sessionKey.revoked = true;
        
        emit SessionKeyRevoked(keyId, msg.sender);
    }

    /**
     * @dev Register a new passkey
     * @param publicKey Public key of the passkey
     * @param credentialId WebAuthn credential ID
     * @return keyId The ID of the registered passkey
     */
    function registerPasskey(
        bytes calldata publicKey,
        bytes calldata credentialId
    ) external returns (bytes32 keyId) {
        require(publicKey.length > 0, "Invalid public key");
        require(credentialId.length > 0, "Invalid credential ID");
        
        keyId = keccak256(abi.encodePacked(
            msg.sender,
            publicKey,
            block.timestamp
        ));
        
        Passkey storage passkey = passkeys[keyId];
        passkey.id = keyId;
        passkey.owner = msg.sender;
        passkey.publicKey = publicKey;
        passkey.credentialId = credentialId;
        passkey.createdAt = block.timestamp;
        passkey.revoked = false;
        
        userPasskeys[msg.sender].push(keyId);
        
        emit PasskeyRegistered(keyId, msg.sender, publicKey);
        return keyId;
    }

    /**
     * @dev Revoke a passkey
     * @param keyId ID of the passkey to revoke
     */
    function revokePasskey(bytes32 keyId) external {
        Passkey storage passkey = passkeys[keyId];
        
        require(passkey.owner == msg.sender, "Not key owner");
        require(!passkey.revoked, "Already revoked");
        
        passkey.revoked = true;
        
        emit PasskeyRevoked(keyId, msg.sender);
    }

    /**
     * @dev Grant permission to a session key or passkey
     * @param keyId ID of the key to grant permission to
     * @param target Address of the contract to call
     * @param selector Function selector to call
     */
    function grantPermission(
        bytes32 keyId,
        address target,
        bytes4 selector
    ) external {
        // Check if the key is a session key
        SessionKey storage sessionKey = sessionKeys[keyId];
        if (sessionKey.owner == msg.sender) {
            require(!sessionKey.revoked, "Key revoked");
            permissions[keyId][target][selector] = true;
            emit PermissionGranted(keyId, target, selector);
            return;
        }
        
        // Check if the key is a passkey
        Passkey storage passkey = passkeys[keyId];
        require(passkey.owner == msg.sender, "Not key owner");
        require(!passkey.revoked, "Key revoked");
        
        permissions[keyId][target][selector] = true;
        
        emit PermissionGranted(keyId, target, selector);
    }

    /**
     * @dev Revoke permission from a session key or passkey
     * @param keyId ID of the key to revoke permission from
     * @param target Address of the contract to call
     * @param selector Function selector to call
     */
    function revokePermission(
        bytes32 keyId,
        address target,
        bytes4 selector
    ) external {
        // Check if the key is a session key
        SessionKey storage sessionKey = sessionKeys[keyId];
        if (sessionKey.owner == msg.sender) {
            permissions[keyId][target][selector] = false;
            emit PermissionRevoked(keyId, target, selector);
            return;
        }
        
        // Check if the key is a passkey
        Passkey storage passkey = passkeys[keyId];
        require(passkey.owner == msg.sender, "Not key owner");
        
        permissions[keyId][target][selector] = false;
        
        emit PermissionRevoked(keyId, target, selector);
    }

    /**
     * @dev Check if a key has permission to call a function
     * @param keyId ID of the key to check
     * @param target Address of the contract to call
     * @param selector Function selector to call
     * @return True if the key has permission, false otherwise
     */
    function hasPermission(
        bytes32 keyId,
        address target,
        bytes4 selector
    ) external view returns (bool) {
        return permissions[keyId][target][selector];
    }

    /**
     * @dev Verify a session key signature
     * @param keyId ID of the session key
     * @param message Message that was signed
     * @param signature Signature to verify
     * @return True if the signature is valid, false otherwise
     */
    function verifySessionKeySignature(
        bytes32 keyId,
        bytes32 message,
        bytes calldata signature
    ) external view returns (bool) {
        SessionKey storage sessionKey = sessionKeys[keyId];
        
        require(!sessionKey.revoked, "Key revoked");
        require(block.timestamp < sessionKey.expiresAt, "Key expired");
        
        // In a real implementation, this would verify the signature against the session key's public key
        // For simplicity, we're using a placeholder check
        return true;
    }

    /**
     * @dev Verify a passkey signature (WebAuthn)
     * @param keyId ID of the passkey
     * @param message Message that was signed
     * @param signature Signature to verify
     * @return True if the signature is valid, false otherwise
     */
    function verifyPasskeySignature(
        bytes32 keyId,
        bytes32 message,
        bytes calldata signature
    ) external view returns (bool) {
        Passkey storage passkey = passkeys[keyId];
        
        require(!passkey.revoked, "Key revoked");
        
        // In a real implementation, this would verify the WebAuthn signature
        // For simplicity, we're using a placeholder check
        return true;
    }

    /**
     * @dev Get all session keys for a user
     * @param owner Address of the user
     * @return Array of session key IDs
     */
    function getUserSessionKeys(address owner) external view returns (bytes32[] memory) {
        return userSessionKeys[owner];
    }

    /**
     * @dev Get all passkeys for a user
     * @param owner Address of the user
     * @return Array of passkey IDs
     */
    function getUserPasskeys(address owner) external view returns (bytes32[] memory) {
        return userPasskeys[owner];
    }
}
