# TypeScript Examples for Bridge Contracts

This directory contains TypeScript scripts demonstrating how to interact with various bridge contracts on both Neo and EVM chains using the `@bane-labs/bridge-sdk-ts` library.

## Prerequisites
- Node.js v18 or newer
- npm
- Access to running nodes (Neo and/or EVM compatible)
- Valid wallet configurations for target chains
- Contract addresses/hashes for deployed bridge contracts

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `env-template` to `.env` and fill in the required variables:
   ```sh
   cp env-template .env
   ```
   Edit `.env` and configure values for your target chain(s). See [Environment Variables](#environment-variables) section below.

## Usage
Scripts are organized by blockchain platform and bridge component. All scripts can be run using npm scripts with the following naming conventions:
- **Neo**: `npm run neo:<component>:<operation>`
- **EVM**: `npm run evm:<component>:<operation>`

See the platform-specific sections below and individual README files for detailed instructions.

## Environment Variables
See `env-template` for all required and optional variables. 

### Neo Chain Variables
- `NEO_NODE_URL` - RPC URL of the Neo node
- `WALLET_PATH` - Path to your Neo wallet JSON file
- `WALLET_PASSWORD` - Password for the wallet (if encrypted)
- Contract-specific hashes (e.g., `MESSAGE_BRIDGE_CONTRACT_HASH`, `NATIVE_BRIDGE_CONTRACT_HASH`)

### EVM Chain Variables
- `EVM_RPC_URL` - RPC URL of the EVM node (defaults to http://localhost:8545)
- `EVM_PRIVATE_KEY` - Private key for the wallet (required for write operations)
- Contract-specific addresses (e.g., `EVM_MESSAGE_BRIDGE_CONTRACT_ADDRESS`, `EVM_NATIVE_BRIDGE_CONTRACT_ADDRESS`)

### Operation-specific Variables
Each operation may require additional variables. See subdirectory READMEs for details.

## Neo Bridge Components
- **Native Bridge**: Handles native token (GAS/NEO) bridging. See [src/neo/native-bridge/README.md](src/neo/native-bridge/README.md)
- **Token Bridge**: Handles NEP-17 token bridging. See [src/neo/token-bridge/README.md](src/neo/token-bridge/README.md)
- **Message Bridge**: Handles cross-chain message bridging. See [src/neo/message-bridge/README.md](src/neo/message-bridge/README.md)
- **Management**: Handles ownership, relayer, governor, security guard, and validator management. See [src/neo/management/README.md](src/neo/management/README.md)
- **Execution Manager**: Handles message execution and bridge management. See [src/neo/execution-manager/README.md](src/neo/execution-manager/README.md)
- **Wallet Operations**: Examples for wallet interactions. See [src/neo/wallet/README.md](src/neo/wallet/README.md)

## EVM Bridge Components
- **Message Bridge**: Handles cross-chain message bridging operations between EVM and Neo. See [src/evm/message-bridge/README.md](src/evm/message-bridge/README.md)
- **Execution Manager**: Handles message execution and management. See [src/evm/execution-manager/README.md](src/evm/execution-manager/README.md)
- **Native Bridge**: Handles native token bridging operations. See [src/evm/native-bridge/README.md](src/evm/native-bridge/README.md)
- **Token Bridge**: Handles ERC-20 token bridging operations. See [src/evm/token-bridge/README.md](src/evm/token-bridge/README.md)
- **Bridge Management**: Handles governance and validator management. See [src/evm/bridge-management/README.md](src/evm/bridge-management/README.md)

For a comprehensive overview of EVM examples, see [src/evm/README.md](src/evm/README.md).

## Notes
- Ensure your `.env` file does **not** use quotes or semicolons around values.
- Wallet file paths should be relative to this directory or absolute.
- Scripts are modular; you can add or modify npm scripts in `package.json` as needed.
- All EVM examples now include complete management, execution, message bridge, native bridge, and token bridge operations.

For more details, see the comments in each script file.

## Notes
- Ensure your `.env` file does **not** use quotes or semicolons around values.
- Wallet file paths should be relative to this directory or absolute.
- Scripts are modular; you can add or modify npm scripts in `package.json` as needed.

For more details, see the comments in each script file.
