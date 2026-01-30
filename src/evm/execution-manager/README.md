# EVM Execution Manager Examples

This directory contains examples for interacting with the EVM ExecutionManager contract, which handles message execution and access control operations.

## Files

- `executeMessage.ts` - Execute messages with specified nonce and executable code
- `readOnlyMethods.ts` - Read-only method calls to query execution manager state

## Available Scripts

### Execution Manager Operations
- `npm run evm:em:execute` - Execute a message using MESSAGE_NONCE and EXECUTABLE_CODE
- `npm run evm:em:readonly` - Read all execution manager state information

## Required Environment Variables

- `EVM_EXECUTION_MANAGER_CONTRACT_ADDRESS` - Contract address of the EVM ExecutionManager
- `EVM_RPC_URL` - RPC URL of the EVM node (defaults to http://localhost:8545)
- `EVM_WALLET_PATH` - Path to the EVM wallet file
- `EVM_WALLET_PASSWORD` - Password for the wallet (if encrypted)

### Operation-specific Variables
- For `executeMessage.ts`: 
  - `MESSAGE_NONCE` (integer) - The nonce of the message to execute
  - `EXECUTABLE_CODE` (hex string) - The executable code/data to process
  - `REFUND_ADDRESS` or `EVM_WALLET_ADDRESS` (address) - Address to refund any excess gas to
