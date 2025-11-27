# TypeScript Examples for MessageBridge

This directory contains TypeScript scripts demonstrating how to interact with the MessageBridge contract on Neo using the `bridge-sdk-ts` library.

## Prerequisites
- Node.js v18 or newer
- npm
- Access to a running Neo node (local or remote)
- A valid Neo wallet file (JSON format)
- Contract hash for the deployed MessageBridge contract

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
   - `MESSAGE_BRIDGE_CONTRACT_HASH` (contract hash)
   - `NEO_NODE_URL` (RPC URL)
   - `WALLET_PATH` (path to your Neo wallet JSON)
   - `WALLET_PASSWORD` (if your wallet is encrypted)
   - Other variables as needed for specific scripts

## Usage
Scripts can be run using npm scripts or directly with `tsx`:

- **Serialize contract call:**
  ```sh
  npm run example:serialize
  # or
  tsx serializeCall.ts
  ```
- **Wallet operations:**
  ```sh
  npm run example:wallet
  ```
- **Send messages:**
  ```sh
  npm run example:send
  ```
- **Execute message:**
  ```sh
  npm run example:execute
  ```
- **Read-only contract methods:**
  ```sh
  npm run example:readonly
  ```
- **Pause/unpause operations:**
  ```sh
  npm run example:pause
  ```

## Environment Variables
See `env-template` for all required and optional variables. Key variables include:
- `MESSAGE_BRIDGE_CONTRACT_HASH`
- `NEO_NODE_URL`
- `WALLET_PATH`
- `WALLET_PASSWORD`
- `MESSAGE_NONCE`, `MESSAGE_EXECUTABLE_DATA`, etc. (for specific operations)

## Notes
- Ensure your `.env` file does **not** use quotes or semicolons around values.
- Wallet file paths should be relative to this directory or absolute.
- Scripts are modular; you can add or modify npm scripts in `package.json` as needed.

For more details, see the comments in each script file.

