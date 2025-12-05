import { NativeBridge, neonAdapter } from "@bane-labs/bridge-sdk-ts";
import { createNativeBridgeFromEnvironment, ensureEnv, waitForStateUpdate } from "../utils";

async function pauseOperations(nativeBridge: NativeBridge) {
    console.log("\n--- Testing Native Bridge Pause/Unpause Operations ---");

    const config = nativeBridge.getConfig();
    let waitInterval = 5000;

    try {
        const version = await neonAdapter.create.rpcClient(config.rpcUrl).getVersion();
        waitInterval = version.protocol.msperblock;
    } catch (error) {
        console.log('Could not get block time, using default wait interval');
    }

    try {
        console.log("\n1. Initial State Check:");
        await logPauseStates(nativeBridge);

        console.log("\n2. Testing bridge pause/unpause...");
        let bridgeIsPaused = await nativeBridge.isPaused();

        if (!bridgeIsPaused) {
            console.log("Pausing bridge...");
            const pauseResult = await nativeBridge.pauseBridge();
            console.log(`Bridge pause transaction: ${pauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            bridgeIsPaused = await nativeBridge.isPaused();
        }

        if (bridgeIsPaused) {
            console.log("Unpausing bridge...");
            const unpauseResult = await nativeBridge.unpauseBridge();
            console.log(`Bridge unpause transaction: ${unpauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
        }

        console.log("\n3. Testing deposits pause/unpause...");
        let depositsArePaused = await nativeBridge.depositsArePaused();

        if (!depositsArePaused) {
            console.log("Pausing deposits...");
            const pauseDepositsResult = await nativeBridge.pauseDeposits();
            console.log(`Deposits pause transaction: ${pauseDepositsResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            depositsArePaused = await nativeBridge.depositsArePaused();
        }

        if (depositsArePaused) {
            console.log("Unpausing deposits...");
            const unpauseDepositsResult = await nativeBridge.unpauseDeposits();
            console.log(`Deposits unpause transaction: ${unpauseDepositsResult.txHash}`);
            await waitForStateUpdate(waitInterval);
        }

        console.log("\n4. Final State Check:");
        await logPauseStates(nativeBridge);

    } catch (error) {
        console.error('Pause operations test failed:', error instanceof Error ? error.message : error);
    }
}

async function logPauseStates(nativeBridge: NativeBridge) {
    try {
        const bridgeIsPaused = await nativeBridge.isPaused();
        console.log(`  Bridge Paused: ${bridgeIsPaused}`);

        const depositsArePaused = await nativeBridge.depositsArePaused();
        console.log(`  Deposits Paused: ${depositsArePaused}`);
    } catch (error) {
        console.error('  Failed to get pause states:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const nativeBridge = await createNativeBridgeFromEnvironment();
    await pauseOperations(nativeBridge);
})();
