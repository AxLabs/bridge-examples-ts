import { EvmMessageBridge } from "@bane-labs/bridge-sdk-ts";
import { ensureEnv } from "../utils";

export async function callReadOnlyMethods(messageBridge: EvmMessageBridge) {
    console.log("\n--- Testing EVM Message Bridge Read-Only Methods ---");

    try {
        const sendingFee = await messageBridge.sendingFee();
        console.log(`Sending Fee: ${sendingFee} wei`);

        const managementAddress = await messageBridge.management();
        console.log(`Management Contract Address: ${managementAddress}`);

        const unclaimedFees = await messageBridge.unclaimedFees();
        console.log(`Unclaimed Fees: ${unclaimedFees} wei`);

        const executionManagerAddress = await messageBridge.executionManager();
        console.log(`Execution Manager Address: ${executionManagerAddress}`);

        const evmToNeoState = await messageBridge.evmToNeoState();
        console.log(`EVM to Neo State: nonce=${evmToNeoState.nonce}, root=${evmToNeoState.root}`);

        const neoToEvmState = await messageBridge.neoToEvmState();
        console.log(`Neo to EVM State: nonce=${neoToEvmState.nonce}, root=${neoToEvmState.root}`);

        const isSendingPaused = await messageBridge.sendingPaused();
        console.log(`Is Sending Paused: ${isSendingPaused}`);

        const isExecutingPaused = await messageBridge.executingPaused();
        console.log(`Is Executing Paused: ${isExecutingPaused}`);

        const messageNonce = process.env.MESSAGE_NONCE ? BigInt(process.env.MESSAGE_NONCE) : 1n;

        const executableState = await messageBridge.getEvmExecutableState(messageNonce);
        console.log(`Executable State for nonce ${messageNonce}: executed=${executableState.executed}, expiration=${executableState.expirationTimestamp}`);

        try {
            const messageData = await messageBridge.getEvmMessage(messageNonce);
            console.log(`Message Data for nonce ${messageNonce}:`, {
                encodedMetadata: messageData.encodedMetadata,
                rawMessage: messageData.rawMessage
            });
        } catch (error) {
            console.log(`No message found for nonce ${messageNonce}`);
        }

        console.log("\n--- EVM Message Bridge Read-Only Methods Completed Successfully ---");
    } catch (error) {
        console.error("Error calling read-only methods:", error);
        throw error;
    }
}

async function main() {
    ensureEnv();

    const { createMessageBridgeFromEnvironment } = await import("../utils");

    try {
        const messageBridge = await createMessageBridgeFromEnvironment();
        await callReadOnlyMethods(messageBridge);
    } catch (error) {
        console.error("Failed to test EVM Message Bridge read-only methods:", error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
