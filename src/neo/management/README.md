# Management Examples

This directory contains examples for interacting with the Management contract, which handles ownership, relayer, governor, security guard, and validator management operations.

## Files

- `ownerRelayerGovernor.ts` - Set owner, relayer, governor, and security guard
- `readOnlyMethods.ts` - Read-only method calls to query management state
- `validatorManagement.ts` - Add, remove, replace validators and set validator threshold

## Available Scripts

### Management Operations
- `npm run mg:owner` - Set owner/relayer/governor/security guard based on MANAGEMENT_ACTION
- `npm run mg:readonly` - Read all management state information
- `npm run mg:validator` - Manage validators based on VALIDATOR_ACTION

### Specific Management Operations
- `npm run mg:set-owner` - Set new owner
- `npm run mg:set-relayer` - Set new relayer
- `npm run mg:set-governor` - Set new governor
- `npm run mg:set-security-guard` - Set new security guard
- `npm run mg:add-validator` - Add a validator
- `npm run mg:remove-validator` - Remove a validator
- `npm run mg:replace-validator` - Replace a validator
- `npm run mg:set-threshold` - Set validator threshold

## Required Environment Variables

- `MANAGEMENT_CONTRACT_HASH` - Contract hash of the Management contract
- `NEO_NODE_URL` - RPC URL of the Neo node
- `WALLET_PATH` - Path to the wallet file
- `WALLET_PASSWORD` - Password for the wallet (if encrypted)

### Operation-specific Variables
- For `ownerRelayerGovernor.ts`: `MANAGEMENT_ACTION` (set-owner, set-relayer, set-governor, set-security-guard), corresponding `NEW_OWNER`, `NEW_RELAYER`, `NEW_GOVERNOR`, `NEW_SECURITY_GUARD`
- For `validatorManagement.ts`: `VALIDATOR_ACTION` (add, remove, replace, set-threshold), `VALIDATOR_PUBLIC_KEY`, `OLD_VALIDATOR_PUBLIC_KEY`, `NEW_VALIDATOR_PUBLIC_KEY`, `VALIDATOR_THRESHOLD`, `INCREMENT_THRESHOLD`, `DECREMENT_THRESHOLD`
- For `readOnlyMethods.ts`: Optional `VALIDATOR_ADDRESS` to check if a specific address is a validator
