import { NeoMessageBridge } from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv, waitForStateUpdate } from "../utils";

async function setExecutionManager(messageBridge: NeoMessageBridge) {
    const executionManager = process.env.EXECUTION_MANAGER_ADDRESS;

    if (!executionManager) {
        throw new Error('EXECUTION_MANAGER_ADDRESS environment variable is required for changing the execution manager');
    }

    try {
        const oldExecutionManager = await messageBridge.executionManager();
        console.log('Old execution manager is now set to:', oldExecutionManager);

        console.log(`Setting new execution manager: ${executionManager}`);

        const result = await messageBridge.setExecutionManager(executionManager);
        console.log('Execution manager changed successfully:', result.txHash);
        // Wait for state update
        await waitForStateUpdate();
        // Get and log the execution result
        const newExecutionManager = await messageBridge.executionManager();
        console.log('New execution manager is now set to:', newExecutionManager);
    } catch (error: any) {
        console.error('Failed to execute message:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const messageBridge = await createMessageBridgeFromEnvironment();
    await setExecutionManager(messageBridge);
})();
