import {
    type EvmContractWrapperConfig,
    EvmMessageBridge,
    EvmExecutionManager,
    EvmNativeBridge,
    EvmTokenBridge,
    EvmBridgeManagement, EvmMessageBridgeFactory, EvmNativeBridgeFactory, EvmTokenBridgeFactory,
    EvmExecutionManagerFactory, EvmBridgeManagementFactory
} from "@bane-labs/bridge-sdk-ts";
import { createPublicClient, createWalletClient, http, type Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import dotenv from "dotenv";

export function ensureEnv() {
    dotenv.config();
}

export function createEvmContractWrapperConfig(contractAddress: Address): EvmContractWrapperConfig {
    const rpcUrl = process.env.EVM_RPC_URL || 'http://localhost:8545';
    const privateKey = process.env.EVM_PRIVATE_KEY;

    const publicClient = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl)
    });

    let walletClient = undefined;
    if (privateKey) {
        const account = privateKeyToAccount(privateKey as `0x${string}`);
        walletClient = createWalletClient({
            account,
            chain: mainnet,
            transport: http(rpcUrl)
        });
    }

    return {
        contractAddress,
        publicClient,
        walletClient
    };
}

export function createMessageBridgeFromEnvironment(): EvmMessageBridge {
    const contractAddress = process.env.EVM_MESSAGE_BRIDGE_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_MESSAGE_BRIDGE_CONTRACT_ADDRESS environment variable is required');
    }

    const config = createEvmContractWrapperConfig(contractAddress as Address);
    return EvmMessageBridgeFactory.create(config);
}

export function createExecutionManagerFromEnvironment(): EvmExecutionManager {
    const contractAddress = process.env.EVM_EXECUTION_MANAGER_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_EXECUTION_MANAGER_CONTRACT_ADDRESS environment variable is required');
    }

    const config = createEvmContractWrapperConfig(contractAddress as Address);
    return EvmExecutionManagerFactory.create(config);
}

export function createNativeBridgeFromEnvironment(): EvmNativeBridge {
    const contractAddress = process.env.EVM_NATIVE_BRIDGE_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_NATIVE_BRIDGE_CONTRACT_ADDRESS environment variable is required');
    }

    const config = createEvmContractWrapperConfig(contractAddress as Address);
    return EvmNativeBridgeFactory.create(config);
}

export function createTokenBridgeFromEnvironment(): EvmTokenBridge {
    const contractAddress = process.env.EVM_TOKEN_BRIDGE_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_TOKEN_BRIDGE_CONTRACT_ADDRESS environment variable is required');
    }

    const config = createEvmContractWrapperConfig(contractAddress as Address);
    return EvmTokenBridgeFactory.create(config);
}

export function createBridgeManagementFromEnvironment(): EvmBridgeManagement {
    const contractAddress = process.env.EVM_BRIDGE_MANAGEMENT_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('EVM_BRIDGE_MANAGEMENT_CONTRACT_ADDRESS environment variable is required');
    }

    const config = createEvmContractWrapperConfig(contractAddress as Address);
    return EvmBridgeManagementFactory.create(config);
}

export function requireEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} environment variable is required`);
    }
    return value;
}
