/**
 * NeoX Bridge Read-Only Methods Example
 *
 * This script demonstrates how to call read-only methods on the NeoX Bridge contract.
 *
 * Required environment variables:
 * - NEOX_BRIDGE_CONTRACT_HASH: The contract hash of the NeoX Bridge
 * - NEO_NODE_URL: The RPC URL of the Neo node
 * - WALLET_PATH: Path to the wallet file
 * - WALLET_PASSWORD: Password for the wallet (if encrypted)
 *
 * Usage:
 *   npm run ntb:readonly
 */
import { createNativeTokenBridgeFromEnvironment, ensureEnv } from "../utils";
import { NativeTokenBridge } from "@bane-labs/bridge-sdk-ts";

export async function callReadOnlyMethods(neoXBridge: NativeTokenBridge) {
    console.log("\n--- Testing NeoX Bridge Read-Only Methods ---");

    try {
        console.log("\n=== Bridge Status ===");
        const isPaused = await neoXBridge.isPaused();
        console.log(`Bridge Paused: ${isPaused}`);

        const depositsArePaused = await neoXBridge.depositsArePaused();
        console.log(`Deposits Paused: ${depositsArePaused}`);

        const linkedChainId = await neoXBridge.linkedChainId();
        console.log(`Linked Chain ID: ${linkedChainId}`);

        const management = await neoXBridge.management();
        console.log(`Management Contract: ${management}`);

        const unclaimedRewards = await neoXBridge.unclaimedRewards();
        console.log(`Unclaimed Rewards: ${unclaimedRewards}`);

        const neoHoldingGasRewards = await neoXBridge.neoHoldingGasRewards();
        console.log(`NEO Holding GAS Rewards: ${neoHoldingGasRewards}`);

        console.log("\n=== Native Bridge Info ===");
        const nativeBridgeIsSet = await neoXBridge.nativeBridgeIsSet();
        console.log(`Native Bridge Set: ${nativeBridgeIsSet}`);

        if (nativeBridgeIsSet) {
            const nativeToken = await neoXBridge.nativeToken();
            console.log(`Native Token: ${nativeToken}`);

            const nativeBridge = await neoXBridge.getNativeBridge();
            console.log(`Native Bridge Config:`, nativeBridge);

            const nativeDepositFee = await neoXBridge.nativeDepositFee();
            console.log(`Native Deposit Fee: ${nativeDepositFee}`);

            const minNativeDeposit = await neoXBridge.minNativeDeposit();
            console.log(`Min Native Deposit: ${minNativeDeposit}`);

            const maxNativeDeposit = await neoXBridge.maxNativeDeposit();
            console.log(`Max Native Deposit: ${maxNativeDeposit}`);

            const maxTotalDepositedNative = await neoXBridge.maxTotalDepositedNative();
            console.log(`Max Total Deposited Native: ${maxTotalDepositedNative}`);

            const nativeDepositNonce = await neoXBridge.nativeDepositNonce();
            console.log(`Native Deposit Nonce: ${nativeDepositNonce}`);

            const nativeDepositRoot = await neoXBridge.nativeDepositRoot();
            console.log(`Native Deposit Root: ${nativeDepositRoot}`);

            const nativeWithdrawalNonce = await neoXBridge.nativeWithdrawalNonce();
            console.log(`Native Withdrawal Nonce: ${nativeWithdrawalNonce}`);

            const nativeWithdrawalRoot = await neoXBridge.nativeWithdrawalRoot();
            console.log(`Native Withdrawal Root: ${nativeWithdrawalRoot}`);
        }

        console.log("\n=== Token Bridge Info ===");
        const registeredTokens = await neoXBridge.getRegisteredTokens();
        console.log(`Registered Tokens (${registeredTokens.length}):`);

        for (let i = 0; i < Math.min(registeredTokens.length, 5); i++) {
            const token = registeredTokens[i];
            console.log(`  Token ${i + 1}: ${JSON.stringify(token)}`);

            if (typeof token === 'string' || (token && token.token)) {
                const tokenAddress = typeof token === 'string' ? token : token.token;
                try {
                    const tokenBridge = await neoXBridge.getTokenBridge(tokenAddress);
                    console.log(`    Bridge Config: ${JSON.stringify(tokenBridge, null, 2)}`);

                    const tokenDepositFee = await neoXBridge.tokenDepositFee(tokenAddress);
                    console.log(`    Deposit Fee: ${tokenDepositFee}`);

                    const minTokenDeposit = await neoXBridge.minTokenDeposit(tokenAddress);
                    console.log(`    Min Deposit: ${minTokenDeposit}`);

                    const maxTokenDeposit = await neoXBridge.maxTokenDeposit(tokenAddress);
                    console.log(`    Max Deposit: ${maxTokenDeposit}`);

                    const maxTokenWithdrawals = await neoXBridge.maxTokenWithdrawals(tokenAddress);
                    console.log(`    Max Withdrawals: ${maxTokenWithdrawals}`);

                    const tokenDepositNonce = await neoXBridge.tokenDepositNonce(tokenAddress);
                    console.log(`    Deposit Nonce: ${tokenDepositNonce}`);

                    const tokenWithdrawalNonce = await neoXBridge.tokenWithdrawalNonce(tokenAddress);
                    console.log(`    Withdrawal Nonce: ${tokenWithdrawalNonce}`);
                } catch (error) {
                    console.log(`    Error getting token info: ${error instanceof Error ? error.message : error}`);
                }
            }
        }

        if (registeredTokens.length > 5) {
            console.log(`  ... and ${registeredTokens.length - 5} more tokens`);
        }

    } catch (error) {
        console.error('Failed to call read-only methods:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const neoXBridge = await createNativeTokenBridgeFromEnvironment();
    await callReadOnlyMethods(neoXBridge);
})();
