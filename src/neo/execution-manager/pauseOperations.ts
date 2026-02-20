import { NeoExecutionManager, neonAdapter } from "@bane-labs/bridge-sdk-ts";
import { createExecutionManagerFromEnvironment, ensureEnv, waitForStateUpdate } from "../utils";

async function performPauseOperations(executionManager: NeoExecutionManager) {
    console.log("\n--- Testing ExecutionManager Pause/Unpause Operations ---");

    const config = executionManager.getConfig();
    const version = await neonAdapter.create.rpcClient(config.rpcUrl).getVersion();
    const waitInterval = version.protocol.msperblock;

    try {
        console.log("\n1. Initial State Check:");
        let isPaused = await logPauseState(executionManager);

        console.log("\n2. Testing pause/unpause...");
        if (!isPaused) {
            const pauseResult = await executionManager.pause();
            console.log(`Pause transaction: ${pauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            isPaused = await logPauseState(executionManager);
        }

        if (isPaused) {
            const unpauseResult = await executionManager.unpause();
            console.log(`Unpause transaction: ${unpauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            await logPauseState(executionManager);
        }

        console.log("\n3. Final State Check:");
        await logPauseState(executionManager);

    } catch (error) {
        console.error('Pause operations test failed:', error instanceof Error ? error.message : error);
    }
}

async function logPauseState(executionManager: NeoExecutionManager): Promise<boolean> {
    try {
        const isPaused = await executionManager.isPaused();
        console.log(`  ExecutionManager Paused: ${isPaused}`);
        return isPaused;
    } catch (error) {
        console.error('  Failed to get pause state:', error instanceof Error ? error.message : error);
        return false;
    }
}

(async () => {
    ensureEnv();
    const executionManager = await createExecutionManagerFromEnvironment();
    await performPauseOperations(executionManager);
})();
