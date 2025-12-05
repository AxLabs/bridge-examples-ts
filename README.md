# TypeScript Examples for Bridge Contracts

This directory contains TypeScript scripts demonstrating how to interact with various bridge contracts on Neo using the `bridge-sdk-ts` library.

## Prerequisites
- Node.js v18 or newer
- npm
- Access to a running Neo node (local or remote)
- A valid Neo wallet file (JSON format)
- Contract hashes for the deployed bridge contracts

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `env-template` to `.env` and fill in the required variables:
   ```sh
   cp env-template .env
   ```
   Edit `.env` and set values for:
   - Contract hashes for deployed bridge contracts (e.g., `MESSAGE_BRIDGE_CONTRACT_HASH`, `NATIVE_BRIDGE_CONTRACT_HASH`, etc.)
   - `NEO_NODE_URL` (RPC URL)
   - `WALLET_PATH` (path to your Neo wallet JSON)
   - `WALLET_PASSWORD` (if your wallet is encrypted)
   - Other variables as needed for specific scripts

## Usage
Scripts are organized by bridge component. See the subdirectories below for specific usage instructions and npm scripts.

## Environment Variables
See `env-template` for all required and optional variables. Key variables include:
- `NEO_NODE_URL`
- `WALLET_PATH`
- `WALLET_PASSWORD`
- Contract-specific hashes (e.g., `MESSAGE_BRIDGE_CONTRACT_HASH`, `NATIVE_BRIDGE_CONTRACT_HASH`)
- Operation-specific variables (see subdirectory READMEs for details)

## Bridge Components
- **Native Bridge**: Handles native token (GAS/NEO) bridging. See [src/neo/native-bridge/README.md](src/neo/native-bridge/README.md)
- **Token Bridge**: Handles NEP-17 token bridging. See [src/neo/token-bridge/README.md](src/neo/token-bridge/README.md)
- **Message Bridge**: Handles cross-chain message bridging. See [src/neo/message-bridge/README.md](src/neo/message-bridge/README.md)
- **Management**: Handles ownership, relayer, governor, security guard, and validator management. See [src/neo/management/README.md](src/neo/management/README.md)
- **Execution Manager**: Handles message execution and bridge management. See [src/neo/execution-manager/README.md](src/neo/execution-manager/README.md)
- **Wallet Operations**: Examples for wallet interactions. See [src/neo/wallet/walletOperations.ts](src/neo/wallet/walletOperations.ts)

## Notes
- Ensure your `.env` file does **not** use quotes or semicolons around values.
- Wallet file paths should be relative to this directory or absolute.
- Scripts are modular; you can add or modify npm scripts in `package.json` as needed.

For more details, see the comments in each script file.
