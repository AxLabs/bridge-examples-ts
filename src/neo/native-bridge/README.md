# Native Bridge Examples

This directory contains examples for interacting with the Native Bridge contract, which handles native token (GAS/NEO) bridging operations.

## Files

- `nativeBridgeOperations.ts` - Native bridge management operations (set, deposit, claim, pause/unpause, fee management)
- `pauseOperations.ts` - Bridge and deposits pause/unpause operations testing
- `readOnlyMethods.ts` - Comprehensive read-only queries for bridge state, configuration, and NEP-17 token balances

## Available Scripts

### Native Bridge Operations
- `npm run neo:nb:operations` - Interactive operations based on NATIVE_OPERATION env var
- `npm run neo:nb:readonly` - Display comprehensive bridge state, configuration, and NEP-17 token balances
- `npm run neo:nb:pause` - Test pause/unpause operations

### Specific Native Operations
- `npm run neo:nb:set` - Set native bridge configuration
- `npm run neo:nb:deposit` - Deposit native tokens
- `npm run neo:nb:claim` - Claim native tokens
- `npm run neo:nb:pause-bridge` - Pause the native bridge
- `npm run neo:nb:unpause-bridge` - Unpause the native bridge
- `npm run neo:nb:set-fee` - Set native deposit fee
- `npm run neo:nb:set-min` - Set minimum native deposit amount
- `npm run neo:nb:set-max` - Set maximum native deposit amount
- `npm run neo:nb:set-total` - Set maximum total deposited native amount

## Required Environment Variables

- `NATIVE_BRIDGE_CONTRACT_HASH` - Contract hash of the Native Bridge
- `NEO_NODE_URL` - RPC URL of the Neo node
- `WALLET_PATH` - Path to the wallet file
- `WALLET_PASSWORD` - Password for the wallet (if encrypted)

### Operation-specific Variables
See individual files for specific environment variables required for each operation.
