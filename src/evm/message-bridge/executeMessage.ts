import { EvmMessageBridge } from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv, requireEnvVar } from "../utils";

async function executeMessage(messageBridge: EvmMessageBridge, nonce: bigint) {
    console.log(`Executing message with nonce: ${nonce}`);

    try {
        const executableState = await messageBridge.getEvmExecutableState(nonce);

        if (executableState.executed) {
            console.log(`Message with nonce ${nonce} has already been executed`);
            return;
        }

        const currentTime = BigInt(Math.floor(Date.now() / 1000));
        if (executableState.expirationTimestamp < currentTime) {
            console.log(`Message with nonce ${nonce} has expired (expiration: ${executableState.expirationTimestamp}, current: ${currentTime})`);
            return;
        }

        const hash = await messageBridge.executeMessage(nonce);
        console.log(`Message executed successfully. Transaction hash: ${hash}`);

        return hash;
    } catch (error) {
        console.error(`Failed to execute message with nonce ${nonce}:`, error);
        throw error;
    }
}

async function main() {
    ensureEnv();

    try {
        const messageBridge = await createMessageBridgeFromEnvironment();

        if (!process.env.EVM_WALLET_PATH) {
            throw new Error('Wallet client is required for write operations. Please set EVM_WALLET_PATH environment variable.');
        }

        const nonceStr = requireEnvVar('MESSAGE_NONCE');
        const nonce = BigInt(nonceStr);

        await executeMessage(messageBridge, nonce);

        console.log('\nMessage execution completed successfully!');
    } catch (error) {
        console.error('Failed to execute message:', error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
