# Token Bridge Examples

This directory contains examples for interacting with the Token Bridge contract, which handles NEP-17 token bridging operations.

## Files

- `tokenBridgeOperations.ts` - Token bridge management operations (register, deposit, claim, pause/unpause, fee management)
- `readOnlyMethods.ts` - Read-only method calls to query token bridge state

## Available Scripts

### Token Bridge Operations
- `npm run tb:operations` - Interactive operations based on TOKEN_OPERATION env var
- `npm run tb:readonly` - Read all token bridge state information

### Specific Token Operations
- `npm run tb:register` - Register a new token
- `npm run tb:deposit` - Deposit tokens
- `npm run tb:claim` - Claim tokens
- `npm run tb:pause` - Pause token bridge for a specific token
- `npm run tb:unpause` - Unpause token bridge for a specific token
- `npm run tb:set-fee` - Set token deposit fee
- `npm run tb:set-min` - Set minimum token deposit amount
- `npm run tb:set-max` - Set maximum token deposit amount
- `npm run tb:set-withdrawals` - Set maximum token withdrawals

## Required Environment Variables

- `TOKEN_BRIDGE_CONTRACT_HASH` - Contract hash of the Token Bridge
- `NEO_NODE_URL` - RPC URL of the Neo node
- `WALLET_PATH` - Path to the wallet file
- `WALLET_PASSWORD` - Password for the wallet (if encrypted)

### Operation-specific Variables
See individual files for specific environment variables required for each operation.
