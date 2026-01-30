import {
    type EvmContractWrapperConfig,
    EvmMessageBridge,
    EvmExecutionManager,
    EvmNativeBridge,
    EvmTokenBridge,
    EvmBridgeManagement, EvmMessageBridgeFactory, EvmNativeBridgeFactory, EvmTokenBridgeFactory,
    EvmExecutionManagerFactory, EvmBridgeManagementFactory
} from "@bane-labs/bridge-sdk-ts";
import { createPublicClient, createWalletClient, http, type Address, PrivateKeyAccount } from 'viem';
import { privateKeyToAccount, HDAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import * as fs from 'fs';
import dotenv from "dotenv";

export function ensureEnv() {
    dotenv.config();
}

async function createAccountFromWalletFile(walletPath: string, password: string): Promise<PrivateKeyAccount> {
    if (!fs.existsSync(walletPath)) {
        throw new Error(`Wallet file not found: ${walletPath}`);
    }

    const walletJson = fs.readFileSync(walletPath, 'utf8');

    // Use ethers for decryption since viem doesn't have native support for encrypted JSON wallets yet
    const { ethers } = await import('ethers');
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password);

    // Convert to viem account
    return  privateKeyToAccount(wallet.privateKey as `0x${string}`);
}

export async function createEvmContractWrapperConfig(contractAddress: Address): Promise<EvmContractWrapperConfig> {
    const rpcUrl = process.env.EVM_RPC_URL || 'http://localhost:8562';

    const publicClient = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl)
    });

    let walletClient = undefined;

    const walletPath = process.env.EVM_WALLET_PATH;
    const walletPassword = process.env.EVM_WALLET_PASSWORD || '';

    if (walletPath) {
        try {
            const account = await createAccountFromWalletFile(walletPath, walletPassword);
            walletClient = createWalletClient({
                account,
                chain: mainnet,
                transport: http(rpcUrl)
            });
        } catch (error) {
            throw new Error(`Failed to load EVM wallet from ${walletPath}: ${error instanceof Error ? error.message : error}`);
        }
    }

    return {
        contractAddress,
        publicClient,
        walletClient
    };
}

export async function createMessageBridgeFromEnvironment(): Promise<EvmMessageBridge> {
    const contractAddress = process.env.EVM_MESSAGE_BRIDGE_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_MESSAGE_BRIDGE_CONTRACT_ADDRESS environment variable is required');
    }

    const config = await createEvmContractWrapperConfig(contractAddress as Address);
    return EvmMessageBridgeFactory.create(config);
}

export async function createExecutionManagerFromEnvironment(): Promise<EvmExecutionManager> {
    const contractAddress = process.env.EVM_EXECUTION_MANAGER_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_EXECUTION_MANAGER_CONTRACT_ADDRESS environment variable is required');
    }

    const config = await createEvmContractWrapperConfig(contractAddress as Address);
    return EvmExecutionManagerFactory.create(config);
}

export async function createNativeBridgeFromEnvironment(): Promise<EvmNativeBridge> {
    const contractAddress = process.env.EVM_NATIVE_BRIDGE_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_NATIVE_BRIDGE_CONTRACT_ADDRESS environment variable is required');
    }

    const config = await createEvmContractWrapperConfig(contractAddress as Address);
    return EvmNativeBridgeFactory.create(config);
}

export async function createTokenBridgeFromEnvironment(): Promise<EvmTokenBridge> {
    const contractAddress = process.env.EVM_TOKEN_BRIDGE_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_TOKEN_BRIDGE_CONTRACT_ADDRESS environment variable is required');
    }

    const config = await createEvmContractWrapperConfig(contractAddress as Address);
    return EvmTokenBridgeFactory.create(config);
}

export async function createBridgeManagementFromEnvironment(): Promise<EvmBridgeManagement> {
    const contractAddress = process.env.EVM_BRIDGE_MANAGEMENT_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_BRIDGE_MANAGEMENT_CONTRACT_ADDRESS environment variable is required');
    }

    const config = await createEvmContractWrapperConfig(contractAddress as Address);
    return EvmBridgeManagementFactory.create(config);
}

export function requireEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} environment variable is required`);
    }
    return value;
}
