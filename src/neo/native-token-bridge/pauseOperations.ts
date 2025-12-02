import { NeoXBridge } from "@bane-labs/bridge-sdk-ts/dist/neo/contracts/neo-x-bridge.js";
import { neonAdapter } from "@bane-labs/bridge-sdk-ts";
import { createNativeTokenBridgeFromEnvironment, ensureEnv, waitForStateUpdate } from "../utils";

async function pauseOperations(neoXBridge: NeoXBridge) {
    console.log("\n--- Testing NeoX Bridge Pause/Unpause Operations ---");

    const config = neoXBridge.getConfig();
    let waitInterval = 5000;

    try {
        const version = await neonAdapter.create.rpcClient(config.rpcUrl).getVersion();
        waitInterval = version.protocol.msperblock;
    } catch (error) {
        console.log('Could not get block time, using default wait interval');
    }

    try {
        console.log("\n1. Initial State Check:");
        await logPauseStates(neoXBridge);

        console.log("\n2. Testing bridge pause/unpause...");
        let bridgeIsPaused = await neoXBridge.isPaused();

        if (!bridgeIsPaused) {
            console.log("Pausing bridge...");
            const pauseResult = await neoXBridge.pauseBridge();
            console.log(`Bridge pause transaction: ${pauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            bridgeIsPaused = await neoXBridge.isPaused();
        }

        if (bridgeIsPaused) {
            console.log("Unpausing bridge...");
            const unpauseResult = await neoXBridge.unpauseBridge();
            console.log(`Bridge unpause transaction: ${unpauseResult.txHash}`);
            await waitForStateUpdate(waitInterval);
        }

        console.log("\n3. Testing deposits pause/unpause...");
        let depositsArePaused = await neoXBridge.depositsArePaused();

        if (!depositsArePaused) {
            console.log("Pausing deposits...");
            const pauseDepositsResult = await neoXBridge.pauseDeposits();
            console.log(`Deposits pause transaction: ${pauseDepositsResult.txHash}`);
            await waitForStateUpdate(waitInterval);
            depositsArePaused = await neoXBridge.depositsArePaused();
        }

        if (depositsArePaused) {
            console.log("Unpausing deposits...");
            const unpauseDepositsResult = await neoXBridge.unpauseDeposits();
            console.log(`Deposits unpause transaction: ${unpauseDepositsResult.txHash}`);
            await waitForStateUpdate(waitInterval);
        }

        console.log("\n4. Final State Check:");
        await logPauseStates(neoXBridge);

    } catch (error) {
        console.error('Pause operations test failed:', error instanceof Error ? error.message : error);
    }
}

async function logPauseStates(neoXBridge: NeoXBridge) {
    try {
        const bridgeIsPaused = await neoXBridge.isPaused();
        console.log(`  Bridge Paused: ${bridgeIsPaused}`);

        const depositsArePaused = await neoXBridge.depositsArePaused();
        console.log(`  Deposits Paused: ${depositsArePaused}`);
    } catch (error) {
        console.error('  Failed to get pause states:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const neoXBridge = await createNativeTokenBridgeFromEnvironment();
    await pauseOperations(neoXBridge);
})();
