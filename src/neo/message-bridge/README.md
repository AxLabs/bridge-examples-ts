# Message Bridge Examples

This directory contains examples for interacting with the Message Bridge contract, which handles cross-chain message bridging operations.

## Files

- `executeMessage.ts` - Execute messages with specified nonce
- `performAllPauseOperations.ts` - Test all pause/unpause operations for sending and executing
- `readOnlyMethods.ts` - Read-only method calls to query message bridge state
- `sendMessage.ts` - Send executable, result, or store-only messages
- `serializeCall.ts` - Examples of serializing and validating calls
- `setExecutionManager.ts` - Set the execution manager address

## Available Scripts

### Message Bridge Operations
- `npm run amb:execute` - Execute a message using MESSAGE_NONCE
- `npm run amb:readonly` - Read all message bridge state information
- `npm run amb:pause` - Test all pause/unpause operations
- `npm run amb:send` - Send messages based on MESSAGE_BRIDGE_OPERATION
- `npm run amb:serialize` - Test serialization and validation methods
- `npm run amb:set-execution-manager` - Set execution manager address

### Specific Message Operations
- `npm run amb:send-executable` - Send an executable message
- `npm run amb:send-result` - Send a result message
- `npm run amb:send-store-only` - Send a store-only message

## Required Environment Variables

- `MESSAGE_BRIDGE_CONTRACT_HASH` - Contract hash of the Message Bridge
- `NEO_NODE_URL` - RPC URL of the Neo node
- `WALLET_PATH` - Path to the wallet file
- `WALLET_PASSWORD` - Password for the wallet (if encrypted)

### Operation-specific Variables
- For `sendMessage.ts`: `MESSAGE_BRIDGE_OPERATION` (send-executable, send-result, send-store-only), `MESSAGE_EXECUTABLE_DATA`, `MESSAGE_STORE_RESULT` (boolean), `MESSAGE_NONCE` (for result), `MESSAGE_STORE_ONLY_DATA`
- For `executeMessage.ts`: `MESSAGE_NONCE` (integer)
- For `setExecutionManager.ts`: `EXECUTION_MANAGER_ADDRESS`
- For `readOnlyMethods.ts`: Optional `MESSAGE_NONCE` (integer, defaults to 1 for testing)
