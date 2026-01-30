import { EvmTokenBridge } from "@bane-labs/bridge-sdk-ts";
import { ensureEnv } from "../utils";

export async function callReadOnlyMethods(tokenBridge: EvmTokenBridge) {
    console.log("\n--- Testing EVM Token Bridge Read-Only Methods ---");

    try {
        // Get management contract address
        const managementAddress = await tokenBridge.management();
        console.log(`Management Contract Address: ${managementAddress}`);

        // Get bridge pause status
        const bridgePaused = await tokenBridge.bridgePaused();
        console.log(`Bridge Paused: ${bridgePaused}`);

        // Get registered tokens list - this returns individual tokens, not an array
        // We'll need to handle this differently since registeredTokens(index) returns a single token
        let registeredTokens: string[] = [];
        try {
            // Try to get tokens by index until we hit an error (indicating no more tokens)
            let index = 0n;
            while (true) {
                try {
                    const token = await tokenBridge.registeredTokens(index);
                    registeredTokens.push(token);
                    index++;
                } catch {
                    break; // No more tokens at this index
                }
            }
        } catch (error) {
            console.log(`Could not retrieve registered tokens list`);
        }

        console.log(`Number of Registered Tokens: ${registeredTokens.length}`);

        if (registeredTokens.length > 0) {
            console.log(`Registered Tokens:`);
            registeredTokens.forEach((token, index) => {
                console.log(`  ${index + 1}. ${token}`);
            });
        }

        // Get unclaimed rewards
        const unclaimedRewards = await tokenBridge.unclaimedRewards();
        console.log(`Unclaimed Rewards: ${unclaimedRewards} wei`);

        // Test with a specific token address if provided
        const testTokenAddress = process.env.TOKEN_ADDRESS as `0x${string}`;
        if (testTokenAddress) {
            console.log(`\n=== Token Bridge Info for ${testTokenAddress} ===`);

            // Check if token is registered using the interface method
            const isRegistered = await tokenBridge.isRegisteredToken(testTokenAddress);
            console.log(`Is Token Registered: ${isRegistered}`);

            if (isRegistered) {
                // Get the token bridge struct for this token
                const tokenBridgeStruct = await tokenBridge.tokenBridges(testTokenAddress);
                const [paused, depositState, withdrawalState, config] = tokenBridgeStruct;

                console.log(`Token Bridge Paused: ${paused}`);

                // Display token configuration
                console.log(`Token Config:`);
                console.log(`  - NEO N3 Token: ${config.neoN3Token}`);
                console.log(`  - Fee: ${config.fee}`);
                console.log(`  - Min Amount: ${config.minAmount}`);
                console.log(`  - Max Amount: ${config.maxAmount}`);
                console.log(`  - Max Deposits: ${config.maxDeposits}`);
                console.log(`  - Decimal Scaling Factor: ${config.decimalScalingFactor}`);

                // Display state information
                console.log(`Deposit State - Nonce: ${depositState.nonce}`);
                console.log(`Deposit State - Root: ${depositState.root}`);
                console.log(`Withdrawal State - Nonce: ${withdrawalState.nonce}`);
                console.log(`Withdrawal State - Root: ${withdrawalState.root}`);

                // Test claimable tokens for a specific nonce
                const testNonce = process.env.TOKEN_CLAIM_NONCE ? BigInt(process.env.TOKEN_CLAIM_NONCE) : 1n;
                try {
                    const claimable = await tokenBridge.tokenClaimables(testTokenAddress, testNonce);
                    const [to, amount] = claimable;
                    console.log(`Claimable for nonce ${testNonce}:`);
                    console.log(`  - To: ${to}`);
                    console.log(`  - Amount: ${amount}`);
                } catch (error) {
                    console.log(`No claimable found for token ${testTokenAddress} at nonce ${testNonce} (this is normal if nothing is claimable)`);
                }
            }
        } else {
            console.log(`\n=== Token-Specific Information ===`);
            console.log(`Set TOKEN_ADDRESS environment variable to get detailed token information`);

            // If no specific token, show info for first registered token if available
            if (registeredTokens.length > 0) {
                const firstToken = registeredTokens[0] as `0x${string}`;
                console.log(`\nShowing info for first registered token: ${firstToken}`);

                const tokenBridgeStruct = await tokenBridge.tokenBridges(firstToken);
                const [paused, , , config] = tokenBridgeStruct;

                console.log(`Token Bridge Paused: ${paused}`);
                console.log(`NEO N3 Token: ${config.neoN3Token}`);
                console.log(`Fee: ${config.fee}`);
                console.log(`Min Amount: ${config.minAmount}`);
                console.log(`Max Amount: ${config.maxAmount}`);
            }
        }

        console.log("\n--- EVM Token Bridge Read-Only Methods Completed Successfully ---");
    } catch (error) {
        console.error("Error calling read-only methods:", error);
        throw error;
    }
}

async function main() {
    ensureEnv();

    const { createTokenBridgeFromEnvironment } = await import("../utils");

    try {
        const tokenBridge = createTokenBridgeFromEnvironment();
        await callReadOnlyMethods(tokenBridge);
    } catch (error) {
        console.error("Failed to test EVM Token Bridge read-only methods:", error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
