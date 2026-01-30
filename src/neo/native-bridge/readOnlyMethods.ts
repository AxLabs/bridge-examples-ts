/**
 * Native Bridge Read-Only Methods Example
 *
 * This script demonstrates how to call read-only methods on the Native Bridge contract.
 *
 * Required environment variables:
 * - NATIVE_BRIDGE_CONTRACT_HASH: The contract hash of the Native Bridge
 * - NEO_NODE_URL: The RPC URL of the Neo node
 * - WALLET_PATH: Path to the wallet file
 * - WALLET_PASSWORD: Password for the wallet (if encrypted)
 *
 * Usage:
 *   npm run nb:readonly
 */
import { createNativeBridgeFromEnvironment, ensureEnv } from "../utils";
import { NeoNativeBridge, getAllBalances, neonAdapter, type NeoAssetBalance } from "@bane-labs/bridge-sdk-ts";

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

function displayBalances(balances: NeoAssetBalance[]): void {
    balances.forEach((balance) => {
        if (balance && balance.assethash && balance.amount !== undefined) {
            const tokenName = getTokenName(balance.assethash);
            console.log(`  ${tokenName}: ${balance.amount}`);
        }
    });
}

async function checkBridgeBalances(bridgeAddress: string, rpcUrl: string): Promise<void> {
    try {
        console.log(`\n=== Bridge NEP-17 Balances ===`);
        console.log(`Bridge Address: ${bridgeAddress}`);

        const rpcClient = neonAdapter.create.rpcClient(rpcUrl);
        const balances = await getAllBalances(rpcClient, bridgeAddress) as NeoAssetBalance[];

        if (balances && Array.isArray(balances) && balances.length > 0) {
            const validBalances = balances.filter((balance): balance is NeoAssetBalance =>
                balance !== null &&
                balance !== undefined &&
                'assethash' in balance &&
                'amount' in balance &&
                typeof balance.assethash === 'string' &&
                typeof balance.amount === 'string'
            );

            if (validBalances.length > 0) {
                console.log("Bridge Token Balances:");
                displayBalances(validBalances);
            } else {
                console.log("  No valid token balances found");
            }
        } else {
            console.log("  No tokens found");
        }

    } catch (error) {
        console.error('Bridge balance check failed:', error instanceof Error ? error.message : error);
    }
}

export async function callReadOnlyMethods(nativeBridge: NeoNativeBridge) {
    console.log("\n--- Testing Native Bridge Read-Only Methods ---");

    try {
        console.log("\n=== Bridge Status ===");
        const isPaused = await nativeBridge.isPaused();
        console.log(`Bridge Paused: ${isPaused}`);

        const depositsArePaused = await nativeBridge.depositsArePaused();
        console.log(`Deposits Paused: ${depositsArePaused}`);

        const linkedChainId = await nativeBridge.linkedChainId();
        console.log(`Linked Chain ID: ${linkedChainId}`);

        const management = await nativeBridge.management();
        console.log(`Management Contract: ${management}`);

        const unclaimedRewards = await nativeBridge.unclaimedRewards();
        console.log(`Unclaimed Rewards: ${unclaimedRewards}`);

        const neoHoldingGasRewards = await nativeBridge.neoHoldingGasRewards();
        console.log(`NEO Holding GAS Rewards: ${neoHoldingGasRewards}`);

        console.log("\n=== Native Bridge Info ===");
        const nativeBridgeIsSet = await nativeBridge.nativeBridgeIsSet();
        console.log(`Native Bridge Set: ${nativeBridgeIsSet}`);

        if (nativeBridgeIsSet) {
            const nativeToken = await nativeBridge.nativeToken();
            console.log(`Native Token: ${nativeToken}`);

            const nativeBridgeConfig = await nativeBridge.getNativeBridge();
            console.log(`Native Bridge Config:`, nativeBridgeConfig);

            const nativeDepositFee = await nativeBridge.nativeDepositFee();
            console.log(`Native Deposit Fee: ${nativeDepositFee}`);

            const minNativeDeposit = await nativeBridge.minNativeDeposit();
            console.log(`Min Native Deposit: ${minNativeDeposit}`);

            const maxNativeDeposit = await nativeBridge.maxNativeDeposit();
            console.log(`Max Native Deposit: ${maxNativeDeposit}`);

            const maxTotalDepositedNative = await nativeBridge.maxTotalDepositedNative();
            console.log(`Max Total Deposited Native: ${maxTotalDepositedNative}`);

            const nativeDepositNonce = await nativeBridge.nativeDepositNonce();
            console.log(`Native Deposit Nonce: ${nativeDepositNonce}`);

            const nativeDepositRoot = await nativeBridge.nativeDepositRoot();
            console.log(`Native Deposit Root: ${nativeDepositRoot}`);

            const nativeWithdrawalNonce = await nativeBridge.nativeWithdrawalNonce();
            console.log(`Native Withdrawal Nonce: ${nativeWithdrawalNonce}`);

            const nativeWithdrawalRoot = await nativeBridge.nativeWithdrawalRoot();
            console.log(`Native Withdrawal Root: ${nativeWithdrawalRoot}`);
        }

        // Check NEP-17 balances of the bridge contract
        const bridgeContractHash = process.env.NATIVE_BRIDGE_CONTRACT_HASH;
        const rpcUrl = process.env.NEO_NODE_URL;

        if (bridgeContractHash && rpcUrl) {
            // Convert contract hash to address for balance checking
            try {
                // const bridgeAddress = wallet.getAddressFromScriptHash(bridgeContractHash);
                await checkBridgeBalances(bridgeContractHash, rpcUrl);
            } catch (addressError) {
                console.error('Failed to convert contract hash to address:', addressError instanceof Error ? addressError.message : addressError);
            }
        } else {
            console.log("\nSkipping bridge balance check - missing NATIVE_BRIDGE_CONTRACT_HASH or NEO_NODE_URL");
        }

    } catch (error) {
        console.error('Failed to call read-only methods:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const nativeBridge = await createNativeBridgeFromEnvironment();
    await callReadOnlyMethods(nativeBridge);
})();
