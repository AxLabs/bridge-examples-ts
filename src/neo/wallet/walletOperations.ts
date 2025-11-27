import {
    createAccountFromWalletFile,
    createDecryptedAccountFromWalletFile,
    createWalletFromFile,
    neonAdapter
} from "@bane-labs/bridge-sdk-ts";
import { ensureEnv } from "../utils";

export async function testWalletOperations() {
    const walletPath = process.env.WALLET_PATH;
    const walletPassword = process.env.WALLET_PASSWORD || "";

    console.log("Wallet path:", walletPath);
    console.log("Wallet password provided:", walletPassword ? "yes" : "no");

    if (walletPath) {
        try {
            const walletInstance = createWalletFromFile(walletPath);
            console.log("Wallet name:", walletInstance.name);
            console.log("Number of accounts:", walletInstance.accounts.length);
            if (walletInstance.accounts.length > 0) {
                const firstAccount = walletInstance.accounts[0];
                console.log("First account address:", firstAccount.address);
                console.log("Is valid address:", neonAdapter.is.address(firstAccount.address));
            }
            if (walletPassword || walletPassword === "") {
                const account = await createDecryptedAccountFromWalletFile(walletPath, walletPassword);
                if (account) {
                    console.log("Decrypted account address:", account.address);
                    console.log("Private key (WIF) available:", !!account.tryGet('WIF'));
                } else {
                    console.log("No decrypted account found in wallet file.");
                }
            } else {
                const account = createAccountFromWalletFile(walletPath);
                if (account) {
                    console.log("Account address:", account.address);
                    console.log("Account is encrypted:", !!account.tryGet('encrypted'));
                } else {
                    console.log("No account found in wallet file.");
                }
            }
        } catch (error) {
            console.error('Wallet operation failed:', error instanceof Error ? error.message : error);
        }
    } else {
        console.error('No WALLET_PATH environment variable set. Set it to load a wallet.');
    }
}

(async () => {
    ensureEnv();
    await testWalletOperations();
})();
