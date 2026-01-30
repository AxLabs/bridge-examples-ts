import { EvmMessageBridge } from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv, requireEnvVar } from "../utils";

async function sendExecutableMessage(messageBridge: EvmMessageBridge) {
    const messageData = requireEnvVar('MESSAGE_EXECUTABLE_DATA');
    const storeResult = process.env.MESSAGE_STORE_RESULT === 'true';

    console.log(`Sending executable message with data: ${messageData}, storeResult: ${storeResult}`);

    const sendingFee = await messageBridge.sendingFee();
    console.log(`Sending fee: ${sendingFee} wei`);

    const hash = await messageBridge.sendExecutableMessage(
        messageData as `0x${string}`,
        storeResult,
        // {
        //     value: sendingFee
        // }
    );

    console.log('Executable message sent successfully. Transaction hash:', hash);
    return hash;
}

async function sendResultMessage(messageBridge: EvmMessageBridge) {
    const nonceStr = requireEnvVar('MESSAGE_NONCE');
    const nonce = BigInt(nonceStr);

    console.log(`Sending result message for nonce: ${nonce}`);

    const sendingFee = await messageBridge.sendingFee();
    console.log(`Sending fee: ${sendingFee} wei`);

    const hash = await messageBridge.sendResultMessage(nonce,
        // {
        //      value: sendingFee
        // }
    );

    console.log('Result message sent successfully. Transaction hash:', hash);
    return hash;
}

async function sendStoreOnlyMessage(messageBridge: EvmMessageBridge) {
    const messageData = requireEnvVar('MESSAGE_STORE_ONLY_DATA');

    console.log(`Sending store-only message with data: ${messageData}`);

    const sendingFee = await messageBridge.sendingFee();
    console.log(`Sending fee: ${sendingFee} wei`);

    const hash = await messageBridge.sendStoreOnlyMessage(messageData as `0x${string}`,
        // {
        //     value: sendingFee
        // }
    );

    console.log('Store-only message sent successfully. Transaction hash:', hash);
    return hash;
}

async function main() {
    ensureEnv();

    try {
        const messageBridge = createMessageBridgeFromEnvironment();

        if (!process.env.EVM_PRIVATE_KEY) {
            throw new Error('Wallet client is required for write operations. Please set EVM_PRIVATE_KEY environment variable.');
        }

        const operation = process.env.MESSAGE_BRIDGE_OPERATION;

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
                console.log('No valid MESSAGE_BRIDGE_OPERATION specified.');
                console.log('Available operations: send-executable, send-result, send-store-only');
                console.log('Set MESSAGE_BRIDGE_OPERATION environment variable to one of the above values.');
                process.exit(1);
        }

        console.log('\nMessage bridge operation completed successfully!');
    } catch (error) {
        console.error('Failed to perform message bridge operation:', error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
