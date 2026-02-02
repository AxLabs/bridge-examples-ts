# Execution Manager Examples

This directory contains examples for interacting with the ExecutionManager contract, which handles message execution and bridge management operations.

## Files

- `executeMessage.ts` - Execute messages with specified nonce and code
- `pauseOperations.ts` - Pause and unpause operations for the execution manager
- `readOnlyMethods.ts` - Read-only method calls to query execution manager state
- `serializeCall.ts` - Examples of serializing and validating calls

## Available Scripts

### Execution Manager Operations
- `npm run neo:em:execute` - Execute a message using MESSAGE_NONCE and EXECUTABLE_CODE
- `npm run neo:em:readonly` - Read all execution manager state information
- `npm run neo:em:pause` - Test pause/unpause operations
- `npm run neo:em:serialize` - Test serialization and validation methods
- `npm run neo:em:serialize-pause` - Test serialization of isPaused method

## Required Environment Variables

- `EXECUTION_MANAGER_CONTRACT_HASH` - Contract hash of the ExecutionManager
- `NEO_NODE_URL` - RPC URL of the Neo node
- `NEO_WALLET_PATH` - Path to the wallet file
- `NEO_WALLET_PASSWORD` - Password for the wallet (if encrypted)

### Operation-specific Variables
- For `executeMessage.ts`: `MESSAGE_NONCE` (integer), `EXECUTABLE_CODE`
- For `serializeCall.ts`: `SERIALIZE_TARGET` (or `MESSAGE_BRIDGE_CONTRACT_HASH`), `SERIALIZE_METHOD` (optional, defaults to 'isPaused')
- Optional: `MESSAGE_BRIDGE_CONTRACT_HASH` - Used for testing serialization methods
