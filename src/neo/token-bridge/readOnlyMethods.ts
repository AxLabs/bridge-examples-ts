/**
 * Token Bridge Read-Only Methods Example
 *
 * This script demonstrates how to call read-only methods on the Token Bridge contract.
 *
 * Required environment variables:
 * - TOKEN_BRIDGE_CONTRACT_HASH: The contract hash of the Token Bridge
 * - NEO_NODE_URL: The RPC URL of the Neo node
 * - WALLET_PATH: Path to the wallet file
 * - WALLET_PASSWORD: Password for the wallet (if encrypted)
 *
 * Usage:
 *   npm run tb:readonly
 */
import { createTokenBridgeFromEnvironment, ensureEnv } from "../utils";
import { TokenBridge } from "@bane-labs/bridge-sdk-ts";

export async function callReadOnlyMethods(tokenBridge: TokenBridge) {
    console.log("\n--- Testing Token Bridge Read-Only Methods ---");

    try {
        console.log("\n=== Token Bridge Info ===");
        const registeredTokens = await tokenBridge.getRegisteredTokens();
        console.log(`Registered Tokens (${registeredTokens.length}):`);

        for (let i = 0; i < Math.min(registeredTokens.length, 5); i++) {
            const token = registeredTokens[i];
            console.log(`  Token ${i + 1}: ${JSON.stringify(token)}`);

            if (typeof token === 'string' || (token && token.token)) {
                const tokenAddress = typeof token === 'string' ? token : token.token;
                try {
                    const isRegistered = await tokenBridge.isRegisteredToken(tokenAddress);
                    console.log(`    Is Registered: ${isRegistered}`);

                    const tokenBridgeConfig = await tokenBridge.getTokenBridge(tokenAddress);
                    console.log(`    Bridge Config: ${JSON.stringify(tokenBridgeConfig, null, 2)}`);

                    const tokenDepositFee = await tokenBridge.tokenDepositFee(tokenAddress);
                    console.log(`    Deposit Fee: ${tokenDepositFee}`);

                    const minTokenDeposit = await tokenBridge.minTokenDeposit(tokenAddress);
                    console.log(`    Min Deposit: ${minTokenDeposit}`);

                    const maxTokenDeposit = await tokenBridge.maxTokenDeposit(tokenAddress);
                    console.log(`    Max Deposit: ${maxTokenDeposit}`);

                    const maxTokenWithdrawals = await tokenBridge.maxTokenWithdrawals(tokenAddress);
                    console.log(`    Max Withdrawals: ${maxTokenWithdrawals}`);

                    const tokenDepositNonce = await tokenBridge.tokenDepositNonce(tokenAddress);
                    console.log(`    Deposit Nonce: ${tokenDepositNonce}`);

                    const tokenDepositRoot = await tokenBridge.tokenDepositRoot(tokenAddress);
                    console.log(`    Deposit Root: ${tokenDepositRoot}`);

                    const tokenWithdrawalNonce = await tokenBridge.tokenWithdrawalNonce(tokenAddress);
                    console.log(`    Withdrawal Nonce: ${tokenWithdrawalNonce}`);

                    const tokenWithdrawalRoot = await tokenBridge.tokenWithdrawalRoot(tokenAddress);
                    console.log(`    Withdrawal Root: ${tokenWithdrawalRoot}`);
                } catch (error) {
                    console.log(`    Error getting token info: ${error instanceof Error ? error.message : error}`);
                }
            }
        }

        if (registeredTokens.length > 5) {
            console.log(`  ... and ${registeredTokens.length - 5} more tokens`);
        }

        if (registeredTokens.length === 0) {
            console.log("  No tokens registered yet");
        }

    } catch (error) {
        console.error('Failed to call read-only methods:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const tokenBridge = await createTokenBridgeFromEnvironment();
    await callReadOnlyMethods(tokenBridge);
})();
