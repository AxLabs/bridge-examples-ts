import {
    type Account,
    type ContractWrapperConfig,
    createAccountFromWalletFile,
    createDecryptedAccountFromWalletFile,
    GenericError,
    MessageBridge
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

    return new MessageBridge(config);
}

export function waitForStateUpdate(waitMs: number = 1000): Promise<void> {
    console.log(`  Waiting ${waitMs}ms for state update...`);
    return new Promise(resolve => setTimeout(resolve, waitMs));
}

// endregion
