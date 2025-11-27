import { MessageBridge } from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv } from "./utils";

async function serializeIsPausedCall(messageBridge: MessageBridge) {
    const contractHash = process.env.MESSAGE_BRIDGE_CONTRACT_HASH;

    if (!contractHash) {
        throw new Error('MESSAGE_BRIDGE_CONTRACT_HASH environment variable is required');
    }

    try {
        // Serialize a call to the isPaused method (no parameters)
        const serializedCall = await messageBridge.serializeCall(
            contractHash,
            'isPaused',
            0, // CallFlags.None
            [] // No parameters
        );

        console.log('Serialized isPaused call:');
        console.log(serializedCall);
    } catch (error) {
        console.error('Failed to serialize isPaused call:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const messageBridge = await createMessageBridgeFromEnvironment();
    await serializeIsPausedCall(messageBridge);
})();
