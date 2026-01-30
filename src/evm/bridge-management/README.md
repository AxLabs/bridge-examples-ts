# EVM Bridge Management Examples

This directory contains examples for interacting with the EVM Bridge Management contract, which handles governance and configuration operations.

## Files

- `validatorManagement.ts` - Validator management operations (add, remove, replace, set threshold)
- `ownerRelayerGovernor.ts` - Owner, relayer, and governor management operations
- `readOnlyMethods.ts` - Read-only method calls to query bridge management state

## Available Scripts

### Bridge Management Operations
- `npm run evm:mgmt:readonly` - Read all bridge management state information
- `npm run evm:mgmt:validator-add` - Add a new validator
- `npm run evm:mgmt:validator-remove` - Remove a validator  
- `npm run evm:mgmt:validator-replace` - Replace an existing validator
- `npm run evm:mgmt:validator-threshold` - Set validator threshold
- `npm run evm:mgmt:set-owner` - Set contract owner
- `npm run evm:mgmt:set-relayer` - Set relayer address
- `npm run evm:mgmt:set-governor` - Set governor address
- `npm run evm:mgmt:set-security` - Set security guard address

## Required Environment Variables

- `EVM_BRIDGE_MANAGEMENT_CONTRACT_ADDRESS` - Contract address of the EVM Bridge Management
- `EVM_RPC_URL` - RPC URL of the EVM node (defaults to http://localhost:8545)
- `EVM_PRIVATE_KEY` - Private key for the wallet (required for write operations)

### Operation-specific Variables
- For `ownerRelayerGovernor.ts`: `MANAGEMENT_ACTION` (set-owner, set-relayer, set-governor, set-security-guard), corresponding `NEW_OWNER`, `NEW_RELAYER`, `NEW_GOVERNOR`, `NEW_SECURITY_GUARD`
- For `validatorManagement.ts`: `VALIDATOR_ACTION` (add, remove, replace, set-threshold), `VALIDATOR_ADDRESS`, `OLD_VALIDATOR_ADDRESS`, `NEW_VALIDATOR_ADDRESS`, `VALIDATOR_THRESHOLD`
- For `readOnlyMethods.ts`: Optional `VALIDATOR_ADDRESS` to check if a specific address is a validator
- For role operations: `OWNER_ADDRESS`, `RELAYER_ADDRESS`, `GOVERNOR_ADDRESS`
