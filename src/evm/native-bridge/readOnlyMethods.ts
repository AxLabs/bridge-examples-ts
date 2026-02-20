import { EvmNativeBridge } from "@bane-labs/bridge-sdk-ts";
import { ensureEnv } from "../utils";

export async function callReadOnlyMethods(nativeBridge: EvmNativeBridge) {
    console.log("\n--- Testing EVM Native Bridge Read-Only Methods ---");

    try {
        // Check if native bridge is set up
        const isNativeBridgeSet = await nativeBridge.nativeBridgeIsSet();
        console.log(`Native Bridge Is Set: ${isNativeBridgeSet}`);

        if (!isNativeBridgeSet) {
            console.log("Native bridge is not set up yet. Limited information available.");
            return;
        }

        // Get management contract address
        const managementAddress = await nativeBridge.management();
        console.log(`Management Contract Address: ${managementAddress}`);

        // Get bridge pause status
        const bridgePaused = await nativeBridge.bridgePaused();
        console.log(`Bridge Paused: ${bridgePaused}`);

        // Get native bridge struct which contains config and state
        const nativeBridgeStruct = await nativeBridge.nativeBridge();
        const [paused, depositState, withdrawalState, config] = nativeBridgeStruct;

        console.log(`Native Bridge Paused: ${paused}`);
        console.log(`Fee: ${config.fee} wei`);
        console.log(`Minimum Amount: ${config.minAmount} wei`);
        console.log(`Maximum Amount: ${config.maxAmount} wei`);
        console.log(`Max Deposits: ${config.maxDeposits}`);
        console.log(`Decimal Scaling Factor: ${config.decimalScalingFactor}`);

        // Get deposit state (EVM to Neo)
        console.log(`Deposit State - Nonce: ${depositState.nonce}`);
        console.log(`Deposit State - Root: ${depositState.root}`);

        // Get withdrawal state (Neo to EVM)
        console.log(`Withdrawal State - Nonce: ${withdrawalState.nonce}`);
        console.log(`Withdrawal State - Root: ${withdrawalState.root}`);

        // Get unclaimed rewards
        const unclaimedRewards = await nativeBridge.unclaimedRewards();
        console.log(`Unclaimed Rewards: ${unclaimedRewards} wei`);

        // Test claimable native for a specific nonce
        const testNonce = process.env.NATIVE_CLAIM_NONCE ? BigInt(process.env.NATIVE_CLAIM_NONCE) : 1n;
        try {
            const claimable = await nativeBridge.claimableNative(testNonce);
            const [to, amount] = claimable;
            console.log(`Claimable for nonce ${testNonce}:`);
            console.log(`  - To: ${to}`);
            console.log(`  - Amount: ${amount} wei`);
        } catch (error) {
            console.log(`No claimable found for nonce ${testNonce} (this is normal if nothing is claimable)`);
        }

        console.log("\n--- EVM Native Bridge Read-Only Methods Completed Successfully ---");
    } catch (error) {
        console.error("Error calling read-only methods:", error);
        throw error;
    }
}

async function main() {
    ensureEnv();

    const { createNativeBridgeFromEnvironment } = await import("../utils");

    try {
        const nativeBridge = await createNativeBridgeFromEnvironment();
        await callReadOnlyMethods(nativeBridge);
    } catch (error) {
        console.error("Failed to test EVM Native Bridge read-only methods:", error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
