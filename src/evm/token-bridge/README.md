# EVM Token Bridge Examples

This directory contains examples for interacting with the EVM Token Bridge contract, which handles token bridging operations between EVM and Neo.

## Files

- `tokenBridgeOperations.ts` - Token bridge management operations (register, deposit, claim, pause/unpause, fee management)
- `readOnlyMethods.ts` - Read-only method calls to query token bridge state and configuration

## Available Scripts

### Token Bridge Operations
- `npm run evm:tb:operations` - Interactive operations based on TOKEN_OPERATION env var
- `npm run evm:tb:readonly` - Read all token bridge state information

### Specific Token Operations
- `npm run evm:tb:register` - Register a new token
- `npm run evm:tb:deposit` - Deposit tokens
- `npm run evm:tb:claim` - Claim tokens
- `npm run evm:tb:pause` - Pause token bridge for a specific token
- `npm run evm:tb:unpause` - Unpause token bridge for a specific token
- `npm run evm:tb:set-fee` - Set token deposit fee
- `npm run evm:tb:set-min` - Set minimum token deposit amount
- `npm run evm:tb:set-max` - Set maximum token deposit amount
- `npm run evm:tb:set-withdrawals` - Set maximum token withdrawals

## Required Environment Variables

- `EVM_TOKEN_BRIDGE_CONTRACT_ADDRESS` - Contract address of the EVM Token Bridge
- `EVM_RPC_URL` - RPC URL of the EVM node (defaults to http://localhost:8545)
- `EVM_PRIVATE_KEY` - Private key for the wallet (required for write operations)

### Optional Environment Variables for Testing
- `TOKEN_ADDRESS` - Specific EVM token address to query detailed information for
- `TOKEN_CLAIM_NONCE` - Nonce to check for claimable tokens (defaults to 1)

## Available Information

The read-only methods provide access to:

### Bridge Status
- Bridge pause status (`bridgePaused`)
- Management contract address
- List of all registered tokens
- Unclaimed rewards

### Token Registration
- Check if a specific token is registered (`isRegisteredToken()`)
- Get all registered token addresses
- Token bridge configuration for each registered token

### Token-Specific Configuration (per registered token)
- NEO N3 token hash (corresponding token on Neo blockchain)
- Bridge pause status for the specific token
- Fee amount for token withdrawals
- Minimum and maximum withdrawal amounts
- Maximum number of deposits allowed
- Decimal configuration (decimals on EVM vs NEO, scaling factor)

### State Information (per registered token)
- Deposit state (EVM to Neo): current nonce and merkle root
- Withdrawal state (Neo to EVM): current nonce and merkle root
- Claimable tokens for specific nonces

### Usage Notes

- Set `TOKEN_ADDRESS` environment variable to get detailed information about a specific token
- If no `TOKEN_ADDRESS` is provided, basic bridge information and first registered token info will be shown
- Each token has its own bridge configuration and state tracking
- Claimable tokens are tracked per token address and nonce
- The system supports multiple tokens, each with independent configuration and state
