import {
    type Account,
    type NeoContractWrapperConfig,
    createAccountFromWalletFile,
    createDecryptedAccountFromWalletFile,
    NeoGenericError,
    NeoBridgeManagement,
    NeoMessageBridge,
    NeoNativeBridge,
    NeoTokenBridge,
    NeoExecutionManager
} from "@bane-labs/bridge-sdk-ts";
import dotenv from "dotenv";

// region Helper Functions
export function ensureEnv() {
    dotenv.config();
}

export async function createMessageBridgeFromEnvironment(): Promise<NeoMessageBridge> {
    const contractHash = process.env.MESSAGE_BRIDGE_CONTRACT_HASH;
    if (!contractHash) {
        throw new NeoGenericError('MESSAGE_BRIDGE_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }

    const config = await createContractWrapperConfigFromEnv(contractHash);

    return new NeoMessageBridge(config);
}

export async function createExecutionManagerFromEnvironment(): Promise<NeoExecutionManager> {
    const contractHash = process.env.EXECUTION_MANAGER_CONTRACT_HASH;
    if (!contractHash) {
        throw new NeoGenericError('EXECUTION_MANAGER_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }

    const config = await createContractWrapperConfigFromEnv(contractHash);

    return new NeoExecutionManager(config);
}

export async function createNativeBridgeFromEnvironment(): Promise<NeoNativeBridge> {
    const contractHash = process.env.NATIVE_BRIDGE_CONTRACT_HASH;
    if (!contractHash) {
        throw new NeoGenericError('NATIVE_BRIDGE_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }

    const config = await createContractWrapperConfigFromEnv(contractHash);

    return new NeoNativeBridge(config);
}

export async function createTokenBridgeFromEnvironment(): Promise<NeoTokenBridge> {
    const contractHash = process.env.TOKEN_BRIDGE_CONTRACT_HASH;
    if (!contractHash) {
        throw new NeoGenericError('TOKEN_BRIDGE_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }

    const config = await createContractWrapperConfigFromEnv(contractHash);

    return new NeoTokenBridge(config);
}

// Legacy function for backward compatibility
export async function createNativeTokenBridgeFromEnvironment(): Promise<NeoNativeBridge> {
    console.warn('createNativeTokenBridgeFromEnvironment is deprecated. Use createNativeBridgeFromEnvironment instead.');
    return createNativeBridgeFromEnvironment();
}

export async function createManagementFromEnvironment(): Promise<NeoBridgeManagement> {
    const contractHash = process.env.BRIDGE_MANAGEMENT_CONTRACT_HASH;
    const rpcUrl = process.env.NEO_NODE_URL;
    const walletPath = process.env.NEO_WALLET_PATH;
    const walletPassword = process.env.NEO_WALLET_PASSWORD || '';

    if (!contractHash) {
        throw new NeoGenericError('BRIDGE_MANAGEMENT_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }
    if (!rpcUrl) {
        throw new NeoGenericError('NEO_NODE_URL environment variable is required', 'MISSING_RPC_URL');
    }
    if (!walletPath) {
        throw new NeoGenericError('NEO_WALLET_PATH environment variable is required', 'MISSING_WALLET_PATH');
    }

    const account = await createDecryptedAccountFromWalletFile(walletPath, walletPassword);
    if (!account) {
        throw new NeoGenericError('Failed to load account from wallet file.', 'ACCOUNT_LOAD_FAILED');
    }
    const config = {contractHash, rpcUrl, account};
    return new NeoBridgeManagement(config);
}

export function waitForStateUpdate(waitMs: number = 1000): Promise<void> {
    console.log(`  Waiting ${waitMs}ms for state update...`);
    return new Promise(resolve => setTimeout(resolve, waitMs));
}

async function createContractWrapperConfigFromEnv(contractHash: string) {
    const walletPath = process.env.NEO_WALLET_PATH;
    if (!walletPath) {
        throw new NeoGenericError('NEO_WALLET_PATH environment variable is required', 'MISSING_WALLET_PATH');
    }

    const walletPassword = process.env.NEO_WALLET_PASSWORD || '';
    const rpcUrl = process.env.NEO_NODE_URL;

    let account: Account | null;
    if (walletPassword || walletPassword === "") {
        account = await createDecryptedAccountFromWalletFile(walletPath, walletPassword);
    } else {
        account = createAccountFromWalletFile(walletPath);

        if (account && (account.tryGet("encrypted") || account.tryGet("WIF"))) {
            throw new NeoGenericError(
                'Wallet contains encrypted private key but no NEO_WALLET_PASSWORD environment variable provided. Please set NEO_WALLET_PASSWORD to decrypt the wallet.',
                'ENCRYPTED_WALLET_NO_PASSWORD'
            );
        }
    }

    if (!account) {
        throw new NeoGenericError('Failed to load account from wallet file', 'ACCOUNT_LOAD_FAILED');
    }

    if (!rpcUrl) {
        throw new NeoGenericError('NEO_NODE_URL environment variable is required', 'MISSING_RPC_URL');
    }

    const config: NeoContractWrapperConfig = {
        contractHash,
        rpcUrl,
        account
    };
    return config;
}

// endregion
