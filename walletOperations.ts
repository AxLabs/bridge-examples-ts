import {
    createAccountFromWalletFile,
    createDecryptedAccountFromWalletFile,
    createWalletFromFile,
    neonAdapter
} from "@bane-labs/bridge-sdk-ts";

export async function testWalletOperations() {
    const walletPath = process.env.WALLET_PATH;
    const walletPassword = process.env.WALLET_PASSWORD || "";

    if (walletPath) {
        try {
            const walletInstance = createWalletFromFile(walletPath);
            if (walletInstance.accounts.length > 0) {
                neonAdapter.is.address(walletInstance.accounts[0].address);
            }
            if (walletPassword || walletPassword === "") {
                const account = await createDecryptedAccountFromWalletFile(walletPath, walletPassword);
                if (account) {
                    account.tryGet('WIF');
                }
            } else {
                const account = createAccountFromWalletFile(walletPath);
                if (account) {
                    account.tryGet('encrypted');
                }
            }
        } catch (error) {
            console.error('Wallet operation failed:', error instanceof Error ? error.message : error);
        }
    }
}

(async () => {
    await testWalletOperations();
})();
