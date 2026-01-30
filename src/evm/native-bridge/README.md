# EVM Native Bridge Examples

This directory contains examples for interacting with the EVM Native Bridge contract, which handles native token bridging operations between EVM and Neo.

## Files

- `readOnlyMethods.ts` - Read-only method calls to query native bridge state and configuration

## Available Scripts

### Native Bridge Operations
- `npm run evm:nb:readonly` - Read all native bridge state information

## Required Environment Variables

- `EVM_NATIVE_BRIDGE_CONTRACT_ADDRESS` - Contract address of the EVM Native Bridge
- `EVM_RPC_URL` - RPC URL of the EVM node (defaults to http://localhost:8545)
- `EVM_PRIVATE_KEY` - Private key for the wallet (required for write operations)

### Optional Environment Variables for Testing
- `NATIVE_CLAIM_NONCE` - Nonce to check for claimable native tokens (defaults to 1)

## Available Information

The read-only methods provide access to:

### Bridge Status
- Bridge setup status (`nativeBridgeIsSet()`)
- Bridge pause status (`bridgePaused`)
- Native bridge specific pause status
- Management contract address
- Unclaimed rewards

### Native Bridge Configuration
- Fee amount (withdrawal fee)
- Minimum and maximum withdrawal amounts
- Maximum number of deposits allowed
- Decimal scaling factor for cross-chain compatibility

### State Information
- Deposit state (EVM to Neo): current nonce and merkle root
- Withdrawal state (Neo to EVM): current nonce and merkle root
- Claimable native tokens for specific nonces

### Usage Notes

- If the native bridge is not set up (`nativeBridgeIsSet()` returns false), only basic bridge information will be available
- The native bridge struct contains comprehensive configuration and state information
- Claimable tokens can be queried by nonce, but will return empty results if no tokens are claimable for that nonce
