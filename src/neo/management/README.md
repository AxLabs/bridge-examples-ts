# Management Examples

This directory contains examples for interacting with the Management contract, which handles ownership, relayer, governor, security guard, and validator management operations.

## Files

- `ownerRelayerGovernor.ts` - Set owner, relayer, governor, and security guard
- `readOnlyMethods.ts` - Read-only method calls to query management state
- `validatorManagement.ts` - Add, remove, replace validators and set validator threshold

## Available Scripts

### Management Operations
- `npm run neo:mgmt:readonly` - Read all management state information
- `npm run neo:mgmt:validator-add` - Add a validator
- `npm run neo:mgmt:validator-remove` - Remove a validator
- `npm run neo:mgmt:validator-replace` - Replace a validator
- `npm run neo:mgmt:validator-threshold` - Set validator threshold

### Specific Management Operations
- `npm run neo:mgmt:set-owner` - Set new owner
- `npm run neo:mgmt:set-relayer` - Set new relayer
- `npm run neo:mgmt:set-governor` - Set new governor
- `npm run neo:mgmt:set-security` - Set new security guard

## Required Environment Variables

- `MANAGEMENT_CONTRACT_HASH` - Contract hash of the Management contract
- `NEO_NODE_URL` - RPC URL of the Neo node
- `WALLET_PATH` - Path to the wallet file
- `WALLET_PASSWORD` - Password for the wallet (if encrypted)

### Operation-specific Variables
- For `ownerRelayerGovernor.ts`: `MANAGEMENT_ACTION` (set-owner, set-relayer, set-governor, set-security-guard), corresponding `NEW_OWNER`, `NEW_RELAYER`, `NEW_GOVERNOR`, `NEW_SECURITY_GUARD`
- For `validatorManagement.ts`: `VALIDATOR_ACTION` (add, remove, replace, set-threshold), `VALIDATOR_PUBLIC_KEY`, `OLD_VALIDATOR_PUBLIC_KEY`, `NEW_VALIDATOR_PUBLIC_KEY`, `VALIDATOR_THRESHOLD`, `INCREMENT_THRESHOLD`, `DECREMENT_THRESHOLD`
- For `readOnlyMethods.ts`: Optional `VALIDATOR_ADDRESS` to check if a specific address is a validator
