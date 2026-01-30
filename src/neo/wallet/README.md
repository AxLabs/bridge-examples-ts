# Wallet Operations Examples

This directory contains examples for interacting with Neo wallets, including loading wallets, decrypting accounts, and querying balances for NEO, GAS, and other tokens.

## Files

- `walletOperations.ts` - Wallet loading, decryption, and balance query operations

## Available Scripts

### Wallet Operations
- `npm run neo:wallet` - Run wallet operations (load, decrypt, display balances, etc.)

## Required Environment Variables

- `NEO_WALLET_PATH` - Path to the Neo wallet file
- `NEO_WALLET_PASSWORD` - Password for the wallet (if encrypted)
- `NEO_NODE_URL` - RPC URL of the Neo node

## Features

- Loads wallet from file and displays account information
- Supports both encrypted and unencrypted wallets
- Decrypts account if password is provided
- Queries and displays balances for NEO, GAS, and other tokens
- Caches balances for 5 minutes to reduce RPC calls
- Type-safe handling of account and balance data

## Notes

- For multiple addresses, batch operations are recommended for better performance.
- See `walletOperations.ts` for more details and usage examples.

