import {
    GenericError,
    MessageBridge,
    type SendExecutableMessageParams,
    type SendResultMessageParams,
    type SendStoreOnlyMessageParams
} from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv } from "../utils";

async function sendExecutableMessage(messageBridge: MessageBridge) {
    const messageData = process.env.MESSAGE_EXECUTABLE_DATA;
    if (!messageData) {
        throw new Error('MESSAGE_EXECUTABLE_DATA environment variable is required for executable messages');
    }

    const storeResult = process.env.MESSAGE_STORE_RESULT === 'true';

    const sendingFee = await messageBridge.sendingFee();

    const params: SendExecutableMessageParams = {
        messageData,
        storeResult,
        maxFee: sendingFee
    };

    const result = await messageBridge.sendExecutableMessage(params);
    console.log('Executable message sent successfully:', result.txHash);
}

async function sendResultMessage(messageBridge: MessageBridge) {
    const nonce = process.env.MESSAGE_NONCE;
    if (!nonce) {
        throw new Error('MESSAGE_NONCE environment variable is required for result messages');
    }

    const sendingFee = await messageBridge.sendingFee();

    const params: SendResultMessageParams = {
        nonce: parseInt(nonce, 10),
        maxFee: sendingFee
    };

    const result = await messageBridge.sendResultMessage(params);
    console.log('Result message sent successfully:', result.txHash);
}

async function sendStoreOnlyMessage(messageBridge: MessageBridge) {
    const messageData = process.env.MESSAGE_STORE_ONLY_DATA;
    if (!messageData) {
        throw new GenericError('MESSAGE_STORE_ONLY_DATA environment variable is required for store-only messages');
    }

    const sendingFee = await messageBridge.sendingFee();

    const params: SendStoreOnlyMessageParams = {
        messageData,
        maxFee: sendingFee
    };

    const result = await messageBridge.sendStoreOnlyMessage(params);
    console.log('Store-only message sent successfully:', result.txHash);
}

async function main() {
    ensureEnv();
    const messageBridge = await createMessageBridgeFromEnvironment();

    const operation = process.env.MESSAGE_BRIDGE_OPERATION
    switch (operation) {
        case 'send-executable':
            await sendExecutableMessage(messageBridge);
            break;
        case 'send-result':
            await sendResultMessage(messageBridge);
            break;
        case 'send-store-only':
            await sendStoreOnlyMessage(messageBridge);
            break;
        default:
            console.log('No valid MESSAGE_BRIDGE_OPERATION specified. Available operations: send-executable, send-result, send-store-only');
    }
}

// Change this to only run when executed, not when imported
main().catch((error) => {
    console.error('Error in sendMessage script:', error instanceof Error ? error.message : error);
    process.exit(1);
});
