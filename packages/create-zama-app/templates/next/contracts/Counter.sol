// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { FHE, euint64, ebool, externalEuint64 } from "@fhevm/solidity/lib/FHE.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SepoliaConfig, ZamaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Counter
 * @dev A simple counter contract using FHEVM for encrypted operations
 */
contract Counter is Ownable {
    // Encrypted counter value
    euint64 private _counter;
    
    // Events
    event CounterIncremented(address indexed user);
    event CounterDecremented(address indexed user);
    event CounterSet(address indexed user);
    
    constructor() Ownable(msg.sender) {
        // Initialize counter to 0
        _counter = FHE.asEuint64(0);
    }
    
    /**
     * @dev Increment the counter by an encrypted amount
     * @param encryptedAmount The encrypted amount to add
     */
    function increment(externalEuint64 calldata encryptedAmount) external {
        euint64 amount = FHE.asEuint64(encryptedAmount);
        _counter = FHE.add(_counter, amount);
        emit CounterIncremented(msg.sender);
    }
    
    /**
     * @dev Decrement the counter by an encrypted amount
     * @param encryptedAmount The encrypted amount to subtract
     */
    function decrement(externalEuint64 calldata encryptedAmount) external {
        euint64 amount = FHE.asEuint64(encryptedAmount);
        _counter = FHE.sub(_counter, amount);
        emit CounterDecremented(msg.sender);
    }
    
    /**
     * @dev Set the counter to a specific encrypted value (only owner)
     * @param encryptedValue The encrypted value to set
     */
    function setCounter(externalEuint64 calldata encryptedValue) external onlyOwner {
        _counter = FHE.asEuint64(encryptedValue);
        emit CounterSet(msg.sender);
    }
    
    /**
     * @dev Get the encrypted counter value
     * @return The encrypted counter value
     */
    function getCounter() external view returns (euint64) {
        return _counter;
    }
    
    /**
     * @dev Check if counter is greater than an encrypted threshold
     * @param encryptedThreshold The encrypted threshold to compare against
     * @return Boolean result of the comparison
     */
    function isGreaterThan(externalEuint64 calldata encryptedThreshold) external view returns (ebool) {
        euint64 threshold = FHE.asEuint64(encryptedThreshold);
        return FHE.gt(_counter, threshold);
    }
    
    /**
     * @dev Reset the counter to zero (only owner)
     */
    function reset() external onlyOwner {
        _counter = FHE.asEuint64(0);
        emit CounterSet(msg.sender);
    }
}