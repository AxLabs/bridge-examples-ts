import { ContractParamType, MessageBridge, neonAdapter } from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv } from "../utils";

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
            15, // CallFlags.ALL
            [] // No parameters
        );

        console.log('Serialized isPaused call:');
        console.log(serializedCall);

        // Validate the serialized call
        const isValid = await messageBridge.isValidCall(serializedCall);
        console.log('Is valid call:', isValid);

        const isAllowed = await messageBridge.isAllowedCall(serializedCall);
        console.log('Is allowed call:', isAllowed);

        if (!isValid) {
            console.error('Warning: The serialized call is not valid');
        }

        if (!isAllowed) {
            console.error('Warning: The serialized call is not allowed');
        }

        if (isValid && isAllowed) {
            console.log('The serialized call is both valid and allowed');
        }
    } catch (error) {
        console.error('Failed to serialize isPaused call:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const messageBridge = await createMessageBridgeFromEnvironment();
    await serializeIsPausedCall(messageBridge);
})();
