import { ExecutionManager } from "@bane-labs/bridge-sdk-ts";
import { createExecutionManagerFromEnvironment, ensureEnv, waitForStateUpdate } from "../utils";

async function executeMessage(executionManager: ExecutionManager) {
    const nonce = process.env.MESSAGE_NONCE;
    if (!nonce) {
        throw new Error('MESSAGE_NONCE environment variable is required for executing messages');
    }

    const executableCode = process.env.EXECUTABLE_CODE;
    if (!executableCode) {
        throw new Error('EXECUTABLE_CODE environment variable is required for executing messages');
    }

    const nonceValue = parseInt(nonce, 10);
    if (isNaN(nonceValue)) {
        throw new Error('MESSAGE_NONCE must be a valid integer');
    }

    try {
        console.log(`Executing message with nonce: ${nonceValue}`);
        console.log(`Executable code: ${executableCode}`);

        const result = await executionManager.executeMessage(nonceValue, executableCode);
        console.log('Message executed successfully:', result.txHash);

        await waitForStateUpdate();

        const newExecutingNonce = await executionManager.getExecutingNonce();
        console.log(`New executing nonce: ${newExecutingNonce}`);
    } catch (error) {
        console.error('Failed to execute message:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const executionManager = await createExecutionManagerFromEnvironment();
    await executeMessage(executionManager);
})();
