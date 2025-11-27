import { MessageBridge, neonAdapter } from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv, waitForStateUpdate } from "./utils";

async function performAllPauseOperations(messageBridge: MessageBridge) {
    console.log("\n--- Testing All Pause/Unpause Operations ---");

    // Get block time estimate if available from the rpcClient
    const config = messageBridge.getConfig();
    const version = await neonAdapter.create.rpcClient(config.rpcUrl).getVersion();
    const waitInterval = version.protocol.msperblock;

    try {
        // Check initial state
        console.log("\n1. Initial State Check:");
        let pausedStates = await logPauseStates(messageBridge);

        // Test general pause
        console.log("\n2. Testing general pause/unpause...");
        if (pausedStates && !pausedStates.isPaused) {
            const generalPauseResult = await messageBridge.pause();
            console.log(`General pause transaction: ${generalPauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            pausedStates = await logPauseStates(messageBridge);
        }

        if (pausedStates && pausedStates.isPaused) {
            const generalUnpauseResult = await messageBridge.unpause();
            console.log(`General unpause transaction: ${generalUnpauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            pausedStates = await logPauseStates(messageBridge);
        }

        // Test sending pause
        if (pausedStates && !pausedStates.sendingIsPaused) {
            console.log("\n3. Testing sending pause/unpause...");
            const sendingPauseResult = await messageBridge.pauseSending();
            console.log(`Sending pause transaction: ${sendingPauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            pausedStates = await logPauseStates(messageBridge);
        }

        if (pausedStates && pausedStates.sendingIsPaused) {
            const sendingUnpauseResult = await messageBridge.unpauseSending();
            console.log(`Sending unpause transaction: ${sendingUnpauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            pausedStates = await logPauseStates(messageBridge);
        }

        // Test executing pause
        if (pausedStates && !pausedStates.executingIsPaused) {
            console.log("\n4. Testing executing pause/unpause...");
            const executingPauseResult = await messageBridge.pauseExecuting();
            console.log(`Executing pause transaction: ${executingPauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            pausedStates = await logPauseStates(messageBridge);
        }

        if (pausedStates && pausedStates.executingIsPaused) {
            const executingUnpauseResult = await messageBridge.unpauseExecuting();
            console.log(`Executing unpause transaction: ${executingUnpauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);

            await logPauseStates(messageBridge);
        }


        console.log("\n5. Final State Check:");
        await logPauseStates(messageBridge);

    } catch (error) {
        console.error('All pause operations test failed:', error instanceof Error ? error.message : error);
    }
}

async function logPauseStates(messageBridge: MessageBridge) {
    try {
        const isPaused = await messageBridge.isPaused();
        const sendingIsPaused = await messageBridge.sendingIsPaused();
        const executingIsPaused = await messageBridge.executingIsPaused();

        console.log(`  General Paused: ${isPaused}`);
        console.log(`  Sending Paused: ${sendingIsPaused}`);
        console.log(`  Executing Paused: ${executingIsPaused}`);
        return {isPaused, sendingIsPaused, executingIsPaused};
    } catch (error) {
        console.error('  Failed to get pause states:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const messageBridge = await createMessageBridgeFromEnvironment();
    await performAllPauseOperations(messageBridge);
})();
