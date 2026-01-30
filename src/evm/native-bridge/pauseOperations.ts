import { createNativeBridgeFromEnvironment, ensureEnv } from "../utils";

async function performPauseOperations() {
    console.log("\n--- Testing EVM Native Bridge Pause/Unpause Operations ---");

    const nativeBridge = await createNativeBridgeFromEnvironment();

    try {
        console.log("\n1. Initial State Check:");
        let bridgePaused = await logBridgePauseState(nativeBridge);
        let nativePaused = await logNativePauseState(nativeBridge);

        console.log("\n2. Testing native bridge pause/unpause...");
        if (!nativePaused) {
            console.log("Attempting to pause native bridge...");
            const tx = await nativeBridge.pauseNativeBridge();
            console.log(`Pause native bridge transaction: ${tx}`);

            // Wait a moment for the transaction to be mined
            await new Promise(resolve => setTimeout(resolve, 2000));
            nativePaused = await logNativePauseState(nativeBridge);
        }

        if (nativePaused) {
            console.log("Attempting to unpause native bridge...");
            const tx = await nativeBridge.unpauseNativeBridge();
            console.log(`Unpause native bridge transaction: ${tx}`);

            // Wait a moment for the transaction to be mined
            await new Promise(resolve => setTimeout(resolve, 2000));
            await logNativePauseState(nativeBridge);
        }

        console.log("\n3. Testing general bridge pause/unpause...");
        if (!bridgePaused) {
            console.log("Attempting to pause bridge...");
            const tx = await nativeBridge.pauseBridge();
            console.log(`Pause bridge transaction: ${tx}`);

            // Wait a moment for the transaction to be mined
            await new Promise(resolve => setTimeout(resolve, 2000));
            bridgePaused = await logBridgePauseState(nativeBridge);
        }

        if (bridgePaused) {
            console.log("Attempting to unpause bridge...");
            const tx = await nativeBridge.unpauseBridge();
            console.log(`Unpause bridge transaction: ${tx}`);

            // Wait a moment for the transaction to be mined
            await new Promise(resolve => setTimeout(resolve, 2000));
            await logBridgePauseState(nativeBridge);
        }

        console.log("\n4. Final State Check:");
        await logBridgePauseState(nativeBridge);
        await logNativePauseState(nativeBridge);

    } catch (error) {
        console.error('Pause operations test failed:', error instanceof Error ? error.message : error);
    }
}

async function logBridgePauseState(nativeBridge: any): Promise<boolean> {
    try {
        const bridgePaused = await nativeBridge.bridgePaused();
        console.log(`  Bridge Paused: ${bridgePaused}`);
        return bridgePaused;
    } catch (error) {
        console.error('  Failed to get bridge pause state:', error instanceof Error ? error.message : error);
        return false;
    }
}

async function logNativePauseState(nativeBridge: any): Promise<boolean> {
    try {
        const nativePaused = await nativeBridge.nativeBridgePaused();
        console.log(`  Native Bridge Paused: ${nativePaused}`);
        return nativePaused;
    } catch (error) {
        console.error('  Failed to get native bridge pause state:', error instanceof Error ? error.message : error);
        return false;
    }
}

(async () => {
    try {
        ensureEnv();
        await performPauseOperations();
    } catch (error) {
        console.error('Error in native bridge pause operations:', error);
        process.exit(1);
    }
})();
