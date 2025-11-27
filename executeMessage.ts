import { MessageBridge } from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv, waitForStateUpdate } from "./utils";

async function executeMessage(messageBridge: MessageBridge) {
    const nonce = process.env.MESSAGE_NONCE;
    if (!nonce) {
        throw new Error('MESSAGE_NONCE environment variable is required for executing messages');
    }

    const nonceValue = parseInt(nonce, 10);
    if (isNaN(nonceValue)) {
        throw new Error('MESSAGE_NONCE must be a valid integer');
    }

    try {
        console.log(`Executing message with nonce: ${nonceValue}`);

        const result = await messageBridge.executeMessage(nonceValue);
        console.log('Message executed successfully:', result.txHash);
        // Wait for state update
        await waitForStateUpdate();
        // Get and log the execution result
        const executionResult = await messageBridge.getEvmExecutionResult(nonceValue);
        console.log(`Execution result for nonce ${nonceValue}:`, executionResult);
    } catch (error: any) {
        console.error('Failed to execute message:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const messageBridge = await createMessageBridgeFromEnvironment();
    await executeMessage(messageBridge);
})();
