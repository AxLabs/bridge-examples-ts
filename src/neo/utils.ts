import {
    type Account,
    type ContractWrapperConfig,
    createAccountFromWalletFile,
    createDecryptedAccountFromWalletFile,
    GenericError,
    BridgeManagement,
    MessageBridge,
    NativeBridge,
    TokenBridge,
    ExecutionManager
} from "@bane-labs/bridge-sdk-ts";
import dotenv from "dotenv";

// region Helper Functions
export function ensureEnv() {
    dotenv.config();
}

export async function createMessageBridgeFromEnvironment(): Promise<MessageBridge> {
    const contractHash = process.env.MESSAGE_BRIDGE_CONTRACT_HASH;
    if (!contractHash) {
        throw new GenericError('MESSAGE_BRIDGE_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }

    const config = await createContractWrapperConfigFromEnv(contractHash);

    return new MessageBridge(config);
}

export async function createExecutionManagerFromEnvironment(): Promise<ExecutionManager> {
    const contractHash = process.env.EXECUTION_MANAGER_CONTRACT_HASH;
    if (!contractHash) {
        throw new GenericError('EXECUTION_MANAGER_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }

    const config = await createContractWrapperConfigFromEnv(contractHash);

    return new ExecutionManager(config);
}

export async function createNativeBridgeFromEnvironment(): Promise<NativeBridge> {
    const contractHash = process.env.NATIVE_BRIDGE_CONTRACT_HASH;
    if (!contractHash) {
        throw new GenericError('NATIVE_BRIDGE_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }

    const config = await createContractWrapperConfigFromEnv(contractHash);

    return new NativeBridge(config);
}

export async function createTokenBridgeFromEnvironment(): Promise<TokenBridge> {
    const contractHash = process.env.TOKEN_BRIDGE_CONTRACT_HASH;
    if (!contractHash) {
        throw new GenericError('TOKEN_BRIDGE_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }

    const config = await createContractWrapperConfigFromEnv(contractHash);

    return new TokenBridge(config);
}

// Legacy function for backward compatibility
export async function createNativeTokenBridgeFromEnvironment(): Promise<NativeBridge> {
    console.warn('createNativeTokenBridgeFromEnvironment is deprecated. Use createNativeBridgeFromEnvironment instead.');
    return createNativeBridgeFromEnvironment();
}

export async function createManagementFromEnvironment(): Promise<BridgeManagement> {
    const contractHash = process.env.BRIDGE_MANAGEMENT_CONTRACT_HASH;
    const rpcUrl = process.env.NEO_NODE_URL;
    const walletPath = process.env.WALLET_PATH;
    const walletPassword = process.env.WALLET_PASSWORD || '';

    if (!contractHash) {
        throw new GenericError('BRIDGE_MANAGEMENT_CONTRACT_HASH environment variable is required', 'MISSING_CONTRACT_HASH');
    }
    if (!rpcUrl) {
        throw new GenericError('NEO_NODE_URL environment variable is required', 'MISSING_RPC_URL');
    }
    if (!walletPath) {
        throw new GenericError('WALLET_PATH environment variable is required', 'MISSING_WALLET_PATH');
    }

    const account = await createDecryptedAccountFromWalletFile(walletPath, walletPassword);
    if (!account) {
        throw new GenericError('Failed to load account from wallet file.', 'ACCOUNT_LOAD_FAILED');
    }
    const config = {contractHash, rpcUrl, account};
    return new BridgeManagement(config);
}

export function waitForStateUpdate(waitMs: number = 1000): Promise<void> {
    console.log(`  Waiting ${waitMs}ms for state update...`);
    return new Promise(resolve => setTimeout(resolve, waitMs));
}

async function createContractWrapperConfigFromEnv(contractHash: string) {
    const walletPath = process.env.WALLET_PATH;
    if (!walletPath) {
        throw new GenericError('WALLET_PATH environment variable is required', 'MISSING_WALLET_PATH');
    }

    const walletPassword = process.env.WALLET_PASSWORD || '';
    const rpcUrl = process.env.NEO_NODE_URL;

    let account: Account | null;
    if (walletPassword || walletPassword === "") {
        account = await createDecryptedAccountFromWalletFile(walletPath, walletPassword);
    } else {
        account = createAccountFromWalletFile(walletPath);

        if (account && (account.tryGet("encrypted") || account.tryGet("WIF"))) {
            throw new GenericError(
                'Wallet contains encrypted private key but no WALLET_PASSWORD environment variable provided. Please set WALLET_PASSWORD to decrypt the wallet.',
                'ENCRYPTED_WALLET_NO_PASSWORD'
            );
        }
    }

    if (!account) {
        throw new GenericError('Failed to load account from wallet file', 'ACCOUNT_LOAD_FAILED');
    }

    if (!rpcUrl) {
        throw new GenericError('NEO_NODE_URL environment variable is required', 'MISSING_RPC_URL');
    }

    const config: ContractWrapperConfig = {
        contractHash,
        rpcUrl,
        account
    };
    return config;
}

// endregion
