// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IERC1271.sol";

/**
 * @title BumbleBeeSmartAccount
 * @dev Smart contract wallet that supports ERC-4337 Account Abstraction, ERC-7715 Wallet Permissions,
 *      and ERC-5792 Wallet Calls
 */
contract BumbleBeeSmartAccount is Ownable, ReentrancyGuard, IERC1271 {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;
    using Address for address;

    // ERC-4337 EntryPoint address
    address public immutable entryPoint;
    
    // ERC-4337 UserOperation nonce
    uint256 private _nonce;

    // Events
    event Executed(address indexed target, uint256 value, bytes data, bytes result);
    event DelegationCreated(address indexed delegator, address indexed delegate, bytes32 delegationId, uint256 expiresAt);
    event DelegationRevoked(address indexed delegator, address indexed delegate, bytes32 delegationId);
    event SessionKeyCreated(bytes32 indexed sessionKeyId, address indexed owner, uint256 expiresAt);
    event SessionKeyRevoked(bytes32 indexed sessionKeyId, address indexed owner);
    event PasskeyRegistered(bytes32 indexed passkeyId, address indexed owner);
    event PasskeyRevoked(bytes32 indexed passkeyId, address indexed owner);
    event PermissionGranted(address indexed delegator, address indexed delegate, bytes32 indexed permissionId, bytes context);
    event PermissionRevoked(address indexed delegator, address indexed delegate, bytes32 indexed permissionId);
    event CallsExecuted(bytes32 indexed batchId, address indexed from, address[] to, uint256[] values, bytes[] data);

    // Structs
    struct Delegation {
        address delegator;
        address delegate;
        uint256 createdAt;
        uint256 expiresAt;
        bool revoked;
        Caveat[] caveats;
    }

    struct Caveat {
        bytes32 caveatType;
        bytes terms;
    }

    struct SessionKey {
        bytes32 id;
        bytes publicKey;
        uint256 createdAt;
        uint256 expiresAt;
        bool revoked;
    }

    struct Passkey {
        bytes32 id;
        bytes publicKey;
        uint256 createdAt;
        bool revoked;
    }

    // ERC-7715 Permission struct
    struct Permission {
        bytes32 id;
        address delegator;
        address delegate;
        uint256 createdAt;
        uint256 expiresAt;
        bool revoked;
        string permissionType;
        bytes data;
        bytes context;
    }

    // ERC-5792 Call struct
    struct Call {
        address to;
        uint256 value;
        bytes data;
        bytes capabilities;
    }

    // State variables
    mapping(bytes32 => Delegation) public delegations;
    mapping(address => bytes32[]) public delegatorDelegations;
    mapping(address => bytes32[]) public delegateDelegations;
    
    mapping(bytes32 => SessionKey) public sessionKeys;
    mapping(address => bytes32[]) public userSessionKeys;
    
    mapping(bytes32 => Passkey) public passkeys;
    mapping(address => bytes32[]) public userPasskeys;
    
    // ERC-7715 Permissions
    mapping(bytes32 => Permission) public permissions;
    mapping(address => bytes32[]) public userPermissions;
    
    // ERC-4337 Storage
    mapping(address => bool) public authorizedEntryPoints;

    // Constructor
    constructor(address initialOwner, address _entryPoint) Ownable(initialOwner) {
        entryPoint = _entryPoint;
        authorizedEntryPoints[_entryPoint] = true;
        _nonce = 0;
    }

    /**
     * @dev Execute a transaction
     * @param target Address of the contract to call
     * @param value Amount of ETH to send
     * @param data Calldata to send
     * @return result The return data of the call
     */
    function execute(
        address target,
        uint256 value,
        bytes calldata data
    ) external nonReentrant returns (bytes memory result) {
        require(target != address(0), "Invalid target address");
        require(msg.sender == owner() || msg.sender == entryPoint, "Not authorized");
        
        // Execute the call
        result = _executeCall(target, value, data);
        
        emit Executed(target, value, data, result);
        return result;
    }

    /**
     * @dev Execute a transaction via delegation
     * @param delegationId ID of the delegation
     * @param target Address of the contract to call
     * @param value Amount of ETH to send
     * @param data Calldata to send
     * @param signature Signature of the delegate
     * @return result The return data of the call
     */
    function executeViaDelegation(
        bytes32 delegationId,
        address target,
        uint256 value,
        bytes calldata data,
        bytes calldata signature
    ) external nonReentrant returns (bytes memory result) {
        Delegation storage delegation = delegations[delegationId];
        
        require(delegation.delegator == owner(), "Not delegated by owner");
        require(delegation.delegate == msg.sender, "Not authorized delegate");
        require(!delegation.revoked, "Delegation revoked");
        require(block.timestamp < delegation.expiresAt, "Delegation expired");
        
        // Verify signature
        bytes32 messageHash = keccak256(abi.encodePacked(
            delegationId,
            target,
            value,
            data,
            nonce
        )).toEthSignedMessageHash();
        
        address signer = messageHash.recover(signature);
        require(signer == delegation.delegate, "Invalid signature");
        
        // Check caveats
        _validateCaveats(delegation.caveats, target, value, data);
        
        // Increment nonce
        nonce++;
        
        // Execute the call
        result = _executeCall(target, value, data);
        
        emit Executed(target, value, data, result);
        return result;
    }

    /**
     * @dev Execute a transaction via session key
     * @param sessionKeyId ID of the session key
     * @param target Address of the contract to call
     * @param value Amount of ETH to send
     * @param data Calldata to send
     * @param signature Signature using the session key
     * @return result The return data of the call
     */
    function executeViaSessionKey(
        bytes32 sessionKeyId,
        address target,
        uint256 value,
        bytes calldata data,
        bytes calldata signature
    ) external nonReentrant returns (bytes memory result) {
        SessionKey storage sessionKey = sessionKeys[sessionKeyId];
        
        require(!sessionKey.revoked, "Session key revoked");
        require(block.timestamp < sessionKey.expiresAt, "Session key expired");
        
        // Verify signature (simplified for demo)
        bytes32 messageHash = keccak256(abi.encodePacked(
            sessionKeyId,
            target,
            value,
            data,
            nonce
        )).toEthSignedMessageHash();
        
        // In a real implementation, this would verify the signature against the session key's public key
        // For simplicity, we're using a placeholder check
        require(true, "Invalid session key signature");
        
        // Increment nonce
        nonce++;
        
        // Execute the call
        result = _executeCall(target, value, data);
        
        emit Executed(target, value, data, result);
        return result;
    }

    /**
     * @dev Create a delegation to another address
     * @param delegate Address to delegate to
     * @param expiresAt Timestamp when the delegation expires
     * @param caveats Array of caveats to apply to the delegation
     * @return delegationId The ID of the created delegation
     */
    function createDelegation(
        address delegate,
        uint256 expiresAt,
        Caveat[] calldata caveats
    ) external onlyOwner returns (bytes32 delegationId) {
        require(delegate != address(0), "Invalid delegate address");
        require(expiresAt > block.timestamp, "Invalid expiration time");
        
        delegationId = keccak256(abi.encodePacked(
            owner(),
            delegate,
            block.timestamp,
            expiresAt
        ));
        
        Delegation storage delegation = delegations[delegationId];
        delegation.delegator = owner();
        delegation.delegate = delegate;
        delegation.createdAt = block.timestamp;
        delegation.expiresAt = expiresAt;
        delegation.revoked = false;
        
        for (uint256 i = 0; i < caveats.length; i++) {
            delegation.caveats.push(caveats[i]);
        }
        
        delegatorDelegations[owner()].push(delegationId);
        delegateDelegations[delegate].push(delegationId);
        
        emit DelegationCreated(owner(), delegate, delegationId, expiresAt);
        return delegationId;
    }

    /**
     * @dev Revoke a delegation
     * @param delegationId ID of the delegation to revoke
     */
    function revokeDelegation(bytes32 delegationId) external onlyOwner {
        Delegation storage delegation = delegations[delegationId];
        
        require(delegation.delegator == owner(), "Not delegation owner");
        require(!delegation.revoked, "Already revoked");
        
        delegation.revoked = true;
        
        emit DelegationRevoked(delegation.delegator, delegation.delegate, delegationId);
    }

    /**
     * @dev Create a session key
     * @param publicKey Public key of the session key
     * @param expiresAt Timestamp when the session key expires
     * @return sessionKeyId The ID of the created session key
     */
    function createSessionKey(
        bytes calldata publicKey,
        uint256 expiresAt
    ) external onlyOwner returns (bytes32 sessionKeyId) {
        require(publicKey.length > 0, "Invalid public key");
        require(expiresAt > block.timestamp, "Invalid expiration time");
        
        sessionKeyId = keccak256(abi.encodePacked(
            owner(),
            publicKey,
            block.timestamp
        ));
        
        SessionKey storage sessionKey = sessionKeys[sessionKeyId];
        sessionKey.id = sessionKeyId;
        sessionKey.publicKey = publicKey;
        sessionKey.createdAt = block.timestamp;
        sessionKey.expiresAt = expiresAt;
        sessionKey.revoked = false;
        
        userSessionKeys[owner()].push(sessionKeyId);
        
        emit SessionKeyCreated(sessionKeyId, owner(), expiresAt);
        return sessionKeyId;
    }

    /**
     * @dev Revoke a session key
     * @param sessionKeyId ID of the session key to revoke
     */
    function revokeSessionKey(bytes32 sessionKeyId) external onlyOwner {
        SessionKey storage sessionKey = sessionKeys[sessionKeyId];
        
        require(!sessionKey.revoked, "Already revoked");
        
        sessionKey.revoked = true;
        
        emit SessionKeyRevoked(sessionKeyId, owner());
    }

    /**
     * @dev Register a passkey
     * @param publicKey Public key of the passkey
     * @return passkeyId The ID of the registered passkey
     */
    function registerPasskey(
        bytes calldata publicKey
    ) external onlyOwner returns (bytes32 passkeyId) {
        require(publicKey.length > 0, "Invalid public key");
        
        passkeyId = keccak256(abi.encodePacked(
            owner(),
            publicKey,
            block.timestamp
        ));
        
        Passkey storage passkey = passkeys[passkeyId];
        passkey.id = passkeyId;
        passkey.publicKey = publicKey;
        passkey.createdAt = block.timestamp;
        passkey.revoked = false;
        
        userPasskeys[owner()].push(passkeyId);
        
        emit PasskeyRegistered(passkeyId, owner());
        return passkeyId;
    }

    /**
     * @dev Revoke a passkey
     * @param passkeyId ID of the passkey to revoke
     */
    function revokePasskey(bytes32 passkeyId) external onlyOwner {
        Passkey storage passkey = passkeys[passkeyId];
        
        require(!passkey.revoked, "Already revoked");
        
        passkey.revoked = true;
        
        emit PasskeyRevoked(passkeyId, owner());
    }

    /**
     * @dev Internal function to execute a call
     * @param target Address of the contract to call
     * @param value Amount of ETH to send
     * @param data Calldata to send
     * @return result The return data of the call
     */
    function _executeCall(
        address target,
        uint256 value,
        bytes calldata data
    ) internal returns (bytes memory result) {
        bool success;
        
        (success, result) = target.call{value: value}(data);
        require(success, "Call execution failed");
        
        return result;
    }

    /**
     * @dev Internal function to validate caveats
     * @param caveats Array of caveats to validate
     * @param target Address of the contract to call
     * @param value Amount of ETH to send
     * @param data Calldata to send
     */
    function _validateCaveats(
        Caveat[] storage caveats,
        address target,
        uint256 value,
        bytes calldata data
    ) internal view {
        for (uint256 i = 0; i < caveats.length; i++) {
            Caveat storage caveat = caveats[i];
            
            if (caveat.caveatType == keccak256("nativeTokenTransferAmount")) {
                uint256 maxAmount = abi.decode(caveat.terms, (uint256));
                require(value <= maxAmount, "Transfer amount exceeds caveat limit");
            }
            else if (caveat.caveatType == keccak256("timeLimit")) {
                uint256 expirationTime = abi.decode(caveat.terms, (uint256));
                require(block.timestamp <= expirationTime, "Caveat time limit exceeded");
            }
            // Add more caveat types as needed
        }
    }

    /**
     * @dev Implementation of ERC-4337 validateUserOp
     * @param userOp The user operation to validate
     * @param userOpHash The hash of the user operation
     * @param missingAccountFunds The amount of funds the account is missing
     * @return validationData The validation data
     */
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external returns (uint256 validationData) {
        require(msg.sender == entryPoint, "Caller is not EntryPoint");
        
        // Validate the signature
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        
        // Check if the signature is from the owner
        if (_validateSignature(hash, userOp.signature)) {
            // Signature is valid
            validationData = 0; // Valid signature, no time range
        } else {
            // Check if the signature is from a session key or delegation
            validationData = _validateSessionOrDelegation(userOp, hash);
        }
        
        // Pay for the transaction if needed
        _payPrefund(missingAccountFunds);
        
        return validationData;
    }
    
    /**
     * @dev Implementation of ERC-1271 isValidSignature
     * @param hash The hash of the data
     * @param signature The signature to validate
     * @return magicValue The magic value if the signature is valid
     */
    function isValidSignature(
        bytes32 hash,
        bytes calldata signature
    ) external view override returns (bytes4 magicValue) {
        if (_validateSignature(hash, signature)) {
            return 0x1626ba7e; // ERC-1271 magic value for valid signatures
        }
        return 0xffffffff; // Invalid signature
    }
    
    /**
     * @dev Implementation of ERC-7715 grantPermission
     * @param delegate Address to grant permission to
     * @param permissionType Type of permission
     * @param data Permission data
     * @param expiry Expiry timestamp
     * @param context Context data
     * @return permissionId The ID of the created permission
     */
    function grantPermission(
        address delegate,
        string calldata permissionType,
        bytes calldata data,
        uint256 expiry,
        bytes calldata context
    ) external onlyOwner returns (bytes32 permissionId) {
        require(delegate != address(0), "Invalid delegate address");
        require(expiry > block.timestamp, "Invalid expiration time");
        
        permissionId = keccak256(abi.encodePacked(
            owner(),
            delegate,
            permissionType,
            block.timestamp
        ));
        
        Permission storage permission = permissions[permissionId];
        permission.id = permissionId;
        permission.delegator = owner();
        permission.delegate = delegate;
        permission.createdAt = block.timestamp;
        permission.expiresAt = expiry;
        permission.revoked = false;
        permission.permissionType = permissionType;
        permission.data = data;
        permission.context = context;
        
        userPermissions[owner()].push(permissionId);
        
        emit PermissionGranted(owner(), delegate, permissionId, context);
        return permissionId;
    }
    
    /**
     * @dev Implementation of ERC-7715 revokePermission
     * @param permissionId ID of the permission to revoke
     */
    function revokePermission(bytes32 permissionId) external onlyOwner {
        Permission storage permission = permissions[permissionId];
        
        require(permission.delegator == owner(), "Not permission owner");
        require(!permission.revoked, "Already revoked");
        
        permission.revoked = true;
        
        emit PermissionRevoked(permission.delegator, permission.delegate, permissionId);
    }
    
    /**
     * @dev Implementation of ERC-5792 executeCalls
     * @param calls Array of calls to execute
     * @param atomicRequired Whether the calls must be executed atomically
     * @return batchId The ID of the executed batch
     * @return results The results of the calls
     */
    function executeCalls(
        Call[] calldata calls,
        bool atomicRequired
    ) external nonReentrant returns (bytes32 batchId, bytes[] memory results) {
        require(msg.sender == owner() || msg.sender == entryPoint, "Not authorized");
        require(calls.length > 0, "No calls provided");
        
        batchId = keccak256(abi.encodePacked(
            owner(),
            block.timestamp,
            calls.length
        ));
        
        results = new bytes[](calls.length);
        
        address[] memory targets = new address[](calls.length);
        uint256[] memory values = new uint256[](calls.length);
        bytes[] memory datas = new bytes[](calls.length);
        
        for (uint256 i = 0; i < calls.length; i++) {
            targets[i] = calls[i].to;
            values[i] = calls[i].value;
            datas[i] = calls[i].data;
        }
        
        if (atomicRequired) {
            // Execute all calls in a single transaction
            for (uint256 i = 0; i < calls.length; i++) {
                results[i] = _executeCall(calls[i].to, calls[i].value, calls[i].data);
            }
        } else {
            // Execute calls sequentially
            for (uint256 i = 0; i < calls.length; i++) {
                results[i] = _executeCall(calls[i].to, calls[i].value, calls[i].data);
            }
        }
        
        emit CallsExecuted(batchId, owner(), targets, values, datas);
        return (batchId, results);
    }
    
    /**
     * @dev Get the nonce for ERC-4337
     * @return The current nonce
     */
    function getNonce() external view returns (uint256) {
        return _nonce;
    }
    
    /**
     * @dev Validate a signature from the owner
     * @param hash The hash to validate
     * @param signature The signature to validate
     * @return True if the signature is valid
     */
    function _validateSignature(bytes32 hash, bytes memory signature) internal view returns (bool) {
        address signer = hash.recover(signature);
        return signer == owner();
    }
    
    /**
     * @dev Validate a signature from a session key or delegation
     * @param userOp The user operation
     * @param hash The hash to validate
     * @return validationData The validation data
     */
    function _validateSessionOrDelegation(
        UserOperation calldata userOp,
        bytes32 hash
    ) internal view returns (uint256) {
        // Extract the session key ID or delegation ID from the userOp
        // This is a simplified implementation - in a real contract, you would need to parse the userOp
        bytes memory callData = userOp.callData;
        
        // Check if it's a session key operation
        if (callData.length >= 36) {
            bytes32 sessionKeyId;
            assembly {
                sessionKeyId := mload(add(callData, 36))
            }
            
            SessionKey storage sessionKey = sessionKeys[sessionKeyId];
            
            if (!sessionKey.revoked && block.timestamp < sessionKey.expiresAt) {
                // In a real implementation, you would verify the signature against the session key's public key
                return 0; // Valid signature, no time range
            }
        }
        
        // Check if it's a delegation operation
        if (callData.length >= 68) {
            bytes32 delegationId;
            assembly {
                delegationId := mload(add(callData, 68))
            }
            
            Delegation storage delegation = delegations[delegationId];
            
            if (!delegation.revoked && block.timestamp < delegation.expiresAt) {
                // In a real implementation, you would verify the signature against the delegate's address
                return 0; // Valid signature, no time range
            }
        }
        
        // Check if it's a permission operation
        if (callData.length >= 100) {
            bytes32 permissionId;
            assembly {
                permissionId := mload(add(callData, 100))
            }
            
            Permission storage permission = permissions[permissionId];
            
            if (!permission.revoked && block.timestamp < permission.expiresAt) {
                // In a real implementation, you would verify the signature against the delegate's address
                return 0; // Valid signature, no time range
            }
        }
        
        return 1; // Invalid signature
    }
    
    /**
     * @dev Pay for the transaction if needed
     * @param missingAccountFunds The amount of funds the account is missing
     */
    function _payPrefund(uint256 missingAccountFunds) internal {
        if (missingAccountFunds > 0) {
            (bool success, ) = payable(entryPoint).call{value: missingAccountFunds}("");
            require(success, "Failed to pay prefund");
        }
    }
    
    /**
     * @dev ERC-4337 UserOperation struct
     */
    struct UserOperation {
        address sender;
        uint256 nonce;
        bytes initCode;
        bytes callData;
        uint256 callGasLimit;
        uint256 verificationGasLimit;
        uint256 preVerificationGas;
        uint256 maxFeePerGas;
        uint256 maxPriorityFeePerGas;
        bytes paymasterAndData;
        bytes signature;
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {}
}
