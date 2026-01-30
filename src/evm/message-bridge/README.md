# EVM Message Bridge Examples

This directory contains examples for interacting with the EVM Message Bridge contract, which handles cross-chain message bridging operations between EVM and Neo.

## Files

- `executeMessage.ts` - Execute messages with specified nonce
- `pauseOperations.ts` - Test pause/unpause operations for sending and executing
- `readOnlyMethods.ts` - Read-only method calls to query message bridge state
- `sendMessage.ts` - Send executable, result, or store-only messages
- `setExecutionManager.ts` - Set the execution manager address
- `encodeExecutableMessage.ts` - Examples of encoding ERC20 balanceOf function calls for executable messages

## Available Scripts

### Message Bridge Operations
- `npm run evm:amb:execute` - Execute a message using MESSAGE_NONCE
- `npm run evm:amb:readonly` - Read all message bridge state information
- `npm run evm:amb:pause` - Test all pause/unpause operations
- `npm run evm:amb:send-executable` - Send an executable message
- `npm run evm:amb:send-result` - Send a result message
- `npm run evm:amb:send-store-only` - Send a store-only message
- `npm run evm:amb:set-executor` - Set execution manager address
- `npm run evm:amb:encode-message` - Encode ERC20 balanceOf function calls for executable messages

## Required Environment Variables

- `EVM_MESSAGE_BRIDGE_CONTRACT_ADDRESS` - Contract address of the EVM Message Bridge
- `EVM_RPC_URL` - RPC URL of the EVM node (defaults to http://localhost:8545)
- `EVM_PRIVATE_KEY` - Private key for the wallet (required for write operations)

### Operation-specific Variables
- For `sendMessage.ts`: `MESSAGE_BRIDGE_OPERATION` (send-executable, send-result, send-store-only), `MESSAGE_EXECUTABLE_DATA`, `MESSAGE_STORE_RESULT` (boolean), `MESSAGE_NONCE` (for result), `MESSAGE_STORE_ONLY_DATA`
- For `executeMessage.ts`: `MESSAGE_NONCE` (integer)
- For `setExecutionManager.ts`: `EXECUTION_MANAGER_ADDRESS`
- For `readOnlyMethods.ts`: Optional `MESSAGE_NONCE` (integer, defaults to 1 for testing)
- For `encodeExecutableMessage.ts`: 
  - `ERC20_TARGET` or `TARGET_CONTRACT_ADDRESS` (address) - Target ERC20 contract address (defaults to Neo token address)
  - `ADDRESS` or `EVM_WALLET_ADDRESS` (address) - Address parameter for balanceOf function call
  - `VALUE` (optional, wei amount) - Native token value to send (defaults to 0)
