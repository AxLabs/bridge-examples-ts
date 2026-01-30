# EVM Bridge Examples

This directory contains TypeScript examples for interacting with the EVM side of the bridge using the `@bane-labs/bridge-sdk-ts` package.

## Structure

- **`message-bridge/`** - Examples for cross-chain message bridging operations
- **`execution-manager/`** - Examples for message execution and management
- **`native-bridge/`** - Examples for native token bridging operations
- **`token-bridge/`** - Examples for ERC-20 token bridging operations
- **`bridge-management/`** - Examples for governance and validator management
- **`wallet/`** - Basic wallet operation examples
- **`utils.ts`** - Utility functions for creating contract instances

## Getting Started

### Prerequisites

1. Node.js and npm installed
2. Access to an EVM-compatible network (local or testnet)
3. A funded wallet for transaction operations

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# EVM Network Configuration
EVM_RPC_URL=http://localhost:8545
EVM_PRIVATE_KEY=0x...

# Contract Addresses
EVM_MESSAGE_BRIDGE_CONTRACT_ADDRESS=0x...
EVM_EXECUTION_MANAGER_CONTRACT_ADDRESS=0x...
EVM_NATIVE_BRIDGE_CONTRACT_ADDRESS=0x...
EVM_TOKEN_BRIDGE_CONTRACT_ADDRESS=0x...
EVM_BRIDGE_MANAGEMENT_CONTRACT_ADDRESS=0x...

# Optional: For testing specific operations
MESSAGE_NONCE=1
MESSAGE_EXECUTABLE_DATA=0x...
TOKEN_ADDRESS=0x...
VALIDATOR_ADDRESS=0x...
```

### Running Examples

All examples can be run using npm scripts. The naming convention is:
```
npm run evm:<contract>:<operation>
```

For example:
- `npm run evm:amb:readonly` - Read message bridge state
- `npm run evm:em:execute` - Execute a message
- `npm run evm:nb:readonly` - Read native bridge state

See individual README files in each subdirectory for more specific examples and required environment variables.

## Key Differences from NEO Examples

1. **Address Format**: Uses checksummed Ethereum addresses (0x...) instead of Neo addresses
2. **Value Units**: Uses wei for native token amounts instead of GAS units
3. **Transaction Format**: Uses Ethereum transaction hashes and receipts
4. **Client Setup**: Uses viem's PublicClient/WalletClient instead of Neo's RpcClient/Account
5. **Contract Interaction**: Uses read/write pattern typical of Ethereum contract interactions

## Contract Interactions

### Read-Only Operations
Read-only operations only require `EVM_RPC_URL` and contract addresses. They use the `read` property of contract instances.

### Write Operations
Write operations require `EVM_PRIVATE_KEY` in addition to read requirements. They use the `write` property and return transaction hashes.

## Error Handling

All examples include proper error handling and will exit with status code 1 on failure. Check console output for detailed error messages.
