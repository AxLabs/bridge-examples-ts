import { NeoExecutionManager } from "@bane-labs/bridge-sdk-ts";
import { createExecutionManagerFromEnvironment, ensureEnv } from "../utils";

async function serializeCallExamples(executionManager: NeoExecutionManager) {
    console.log("\n--- Testing ExecutionManager Serialization Methods ---");

    const target = process.env.SERIALIZE_TARGET || process.env.MESSAGE_BRIDGE_CONTRACT_HASH;
    if (!target) {
        throw new Error('SERIALIZE_TARGET or MESSAGE_BRIDGE_CONTRACT_HASH environment variable is required');
    }

    const method = process.env.SERIALIZE_METHOD || 'isPaused';
    const callFlags = 15;

    console.log(`Target: ${target}`);
    console.log(`Method: ${method}`);
    console.log(`Call Flags: ${callFlags}`);

    try {
        const serializedCall = await executionManager.serializeCall(
            target,
            method,
            callFlags,
            []
        );

        console.log(`Serialized call: ${serializedCall}`);

        const isValidCall = await executionManager.isValidCall(serializedCall);
        console.log(`Is valid call: ${isValidCall}`);

        const isAllowedCall = await executionManager.isAllowedCall(serializedCall);
        console.log(`Is allowed call: ${isAllowedCall}`);

        console.log("\n--- Testing with parameters ---");

        const methodWithParams = 'executeMessage';
        const testNonce = 1;
        const nonceArgument = {
            type: 'Integer',
            value: testNonce.toString()
        }

        console.log(`Method with params: ${methodWithParams}`);
        console.log(`Test nonce: ${testNonce}`);

        const serializedCallWithParams = await executionManager.serializeCall(
            target,
            methodWithParams,
            callFlags,
            [nonceArgument]
        );

        console.log(`Serialized call with params: ${serializedCallWithParams}`);

        const isValidCallWithParams = await executionManager.isValidCall(serializedCallWithParams);
        console.log(`Is valid call with params: ${isValidCallWithParams}`);

        const isAllowedCallWithParams = await executionManager.isAllowedCall(serializedCallWithParams);
        console.log(`Is allowed call with params: ${isAllowedCallWithParams}`);

    } catch (error) {
        console.error('Failed to serialize call:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const executionManager = await createExecutionManagerFromEnvironment();
    await serializeCallExamples(executionManager);
})();
