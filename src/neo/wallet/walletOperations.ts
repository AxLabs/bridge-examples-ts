import {
    type NeoAssetBalance,
    type NeoBalanceResponse,
    createAccountFromWalletFile,
    createDecryptedAccountFromWalletFile,
    createWalletFromFile,
    getAllBalances,
    neonAdapter
} from "@bane-labs/bridge-sdk-ts";
import { ensureEnv } from "../utils";

// Type definitions for better type safety
interface BalanceCache {
    [address: string]: {
        balances: NeoAssetBalance[];
        timestamp: number;
    };
}

interface AccountInfo {
    address: string;
    publicKey?: string;
    scriptHash?: string;
    encrypted?: boolean;
    hasPrivateKey?: boolean;
}

// Cache to avoid duplicate RPC calls (5 minute cache)
const balanceCache: BalanceCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Known token contract hashes
const TOKEN_HASHES = neonAdapter.constants.NATIVE_CONTRACT_HASH;

function getTokenName(tokenHash: string): string {
    const hash = tokenHash.toLowerCase();

    if (hash.includes(TOKEN_HASHES.NeoToken.toLowerCase())) {
        return "NEO";
    } else if (hash.includes(TOKEN_HASHES.GasToken.toLowerCase())) {
        return "GAS";
    } else {
        return `Token (${tokenHash.substring(2, 10)}...)`;
    }
}

function isCacheValid(address: string): boolean {
    const cached = balanceCache[address];
    return cached && (Date.now() - cached.timestamp) < CACHE_DURATION;
}

export function displayBalances(balances: NeoAssetBalance[]): void {
    balances.forEach((balance) => {
        if (balance && balance.assethash && balance.amount !== undefined) {
            const tokenName = getTokenName(balance.assethash);
            console.log(`  ${tokenName}: ${balance.amount}`);
        }
    });
}

export function displayAccountInfo(accountInfo: AccountInfo, accountType: string): void {
    console.log(`\n=== ${accountType} Info ===`);
    console.log("Address:", accountInfo.address);
    console.log("Public key:", accountInfo.publicKey || "not available");
    console.log("Script hash:", accountInfo.scriptHash || "not available");

    if (accountInfo.encrypted !== undefined) {
        console.log("Account is encrypted:", accountInfo.encrypted);
    }

    if (accountInfo.hasPrivateKey !== undefined) {
        console.log("Private key (WIF) available:", accountInfo.hasPrivateKey);
    }
}

async function checkAccountBalances(accountAddress: string, rpcUrl: string, accountType: string = "Account"): Promise<void> {
    try {
        console.log(`\nChecking ${accountType} balances for: ${accountAddress}`);

        // Check cache first
        if (isCacheValid(accountAddress)) {
            console.log("Using cached balances:");
            const cached = balanceCache[accountAddress];
            displayBalances(cached.balances);
            return;
        }

        const rpcClient = neonAdapter.create.rpcClient(rpcUrl);
        const balances = await getAllBalances(rpcClient, accountAddress) as NeoAssetBalance[];

        console.log("Account Balances:");

        if (balances && Array.isArray(balances) && balances.length > 0) {
            // Validate balance structure for type safety
            const validBalances = balances.filter((balance): balance is NeoAssetBalance =>
                balance !== null &&
                balance !== undefined &&
                'assethash' in balance &&
                'amount' in balance &&
                typeof balance.assethash === 'string' &&
                typeof balance.amount === 'string'
            );

            if (validBalances.length > 0) {
                // Cache the results
                balanceCache[accountAddress] = {
                    balances: validBalances,
                    timestamp: Date.now()
                };

                displayBalances(validBalances);
            } else {
                console.log("  No valid token balances found");
            }
        } else {
            console.log("  No tokens found");
        }

    } catch (error) {
        console.error(`${accountType} balance check failed:`, error instanceof Error ? error.message : error);
    }
}

// Export types for external use
export type { NeoAssetBalance, NeoBalanceResponse, BalanceCache, AccountInfo };

export async function testWalletOperations(): Promise<void> {
    const walletPath = process.env.WALLET_PATH;
    const walletPassword = process.env.WALLET_PASSWORD;
    const rpcUrl = process.env.NEO_NODE_URL;

    if (!walletPath) {
        console.error('ERROR: No WALLET_PATH environment variable set. Please set it to load a wallet.');
        return;
    }
    if (!rpcUrl) {
        console.error('ERROR: No NEO_NODE_URL environment variable set. Please set it to connect to a Neo node.');
        return;
    }

    console.log("=== Wallet Operations Test ===");
    console.log("Wallet path:", walletPath);
    console.log("Wallet password provided:", walletPassword !== undefined ? "yes" : "no");
    console.log("RPC URL:", rpcUrl);

    try {
        const walletInstance = createWalletFromFile(walletPath);
        console.log(`\nLoaded wallet: ${walletInstance.name}`);
        console.log(`Total accounts in wallet: ${walletInstance.accounts.length}`);

        // Track addresses we've already checked balances for
        const checkedAddresses = new Set<string>();
        const allAccountInfo: AccountInfo[] = [];

        // Process first account from wallet
        if (walletInstance.accounts.length > 0) {
            const firstAccount = walletInstance.accounts[0];
            const accountInfo: AccountInfo = {
                address: firstAccount.address,
                publicKey: firstAccount.publicKey,
                scriptHash: firstAccount.scriptHash
            };

            displayAccountInfo(accountInfo, "First Account");
            console.log("Is valid address:", neonAdapter.is.address(firstAccount.address));

            await checkAccountBalances(firstAccount.address, rpcUrl, "First account");
            checkedAddresses.add(firstAccount.address);
            allAccountInfo.push(accountInfo);
        }

        // Handle password-based account access
        if (walletPassword !== undefined) {
            // Password is explicitly provided (including empty string for unencrypted wallets)
            try {
                const account = await createDecryptedAccountFromWalletFile(walletPath, walletPassword);
                if (account) {
                    const accountInfo: AccountInfo = {
                        address: account.address,
                        publicKey: account.publicKey,
                        scriptHash: account.scriptHash,
                        hasPrivateKey: !!account.tryGet('WIF')
                    };

                    displayAccountInfo(accountInfo, "Decrypted Account");

                    // Check balances only if we haven't already checked this address
                    if (!checkedAddresses.has(account.address)) {
                        await checkAccountBalances(account.address, rpcUrl, "Decrypted account");
                        checkedAddresses.add(account.address);
                        allAccountInfo.push(accountInfo);
                    } else {
                        console.log("(Balance already checked for this address)");
                    }
                } else {
                    console.log("No decrypted account found in wallet file.");
                }
            } catch (decryptError) {
                console.error("Failed to decrypt account:", decryptError instanceof Error ? decryptError.message : decryptError);
            }
        } else {
            // No password provided - try to load account without decryption
            try {
                const account = createAccountFromWalletFile(walletPath);
                if (account) {
                    const accountInfo: AccountInfo = {
                        address: account.address,
                        publicKey: account.publicKey,
                        scriptHash: account.scriptHash,
                        encrypted: !!account.tryGet('encrypted')
                    };

                    displayAccountInfo(accountInfo, "Account (No Password)");

                    // Check balances only if we haven't already checked this address
                    if (!checkedAddresses.has(account.address)) {
                        await checkAccountBalances(account.address, rpcUrl, "Account");
                        checkedAddresses.add(account.address);
                        allAccountInfo.push(accountInfo);
                    } else {
                        console.log("(Balance already checked for this address)");
                    }
                } else {
                    console.log("No account found in wallet file.");
                }
            } catch (loadError) {
                console.error("Failed to load account:", loadError instanceof Error ? loadError.message : loadError);
            }
        }

        // Summary
        console.log(`\n=== Summary ===`);
        console.log(`Total unique addresses processed: ${checkedAddresses.size}`);
        console.log(`Account addresses: ${Array.from(checkedAddresses).join(', ')}`);
        console.log(`Total account info objects: ${allAccountInfo.length}`);

        // Performance note: For multiple addresses, consider using batchCheckBalances()
        if (checkedAddresses.size > 1) {
            console.log("\nNote: For better performance with multiple addresses, consider using batch operations.");
        }

    } catch (error) {
        console.error('FATAL: Wallet operation failed:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    await testWalletOperations();
})();
