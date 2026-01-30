import { EvmMessageBridge } from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv } from "../utils";

async function testPauseOperations(messageBridge: EvmMessageBridge) {
    console.log("\n--- Testing EVM Message Bridge Pause Operations ---");

    try {
        console.log("\n1. Checking initial pause states...");
        const isSendingPaused = await messageBridge.sendingPaused();
        const isExecutingPaused = await messageBridge.executingPaused();
        console.log(`Initial - Sending Paused: ${isSendingPaused}, Executing Paused: ${isExecutingPaused}`);

        console.log("\n2. Testing pause sending...");
        if (!isSendingPaused) {
            const hash = await messageBridge.pauseSending();
            console.log(`Pause sending transaction hash: ${hash}`);
        } else {
            console.log("Sending is already paused");
        }

        console.log("\n3. Testing pause executing...");
        if (!isExecutingPaused) {
            const hash = await messageBridge.pauseExecuting();
            console.log(`Pause executing transaction hash: ${hash}`);
        } else {
            console.log("Executing is already paused");
        }

        console.log("\n4. Checking pause states after pausing...");
        const sendingPausedAfter = await messageBridge.sendingPaused();
        const executingPausedAfter = await messageBridge.executingPaused();
        console.log(`After pausing - Sending Paused: ${sendingPausedAfter}, Executing Paused: ${executingPausedAfter}`);

        console.log("\n5. Testing unpause sending...");
        if (sendingPausedAfter) {
            const hash = await messageBridge.unpauseSending();
            console.log(`Unpause sending transaction hash: ${hash}`);
        } else {
            console.log("Sending is not paused");
        }

        console.log("\n6. Testing unpause executing...");
        if (executingPausedAfter) {
            const hash = await messageBridge.unpauseExecuting();
            console.log(`Unpause executing transaction hash: ${hash}`);
        } else {
            console.log("Executing is not paused");
        }

        console.log("\n7. Checking final pause states...");
        const finalSendingPaused = await messageBridge.sendingPaused();
        const finalExecutingPaused = await messageBridge.executingPaused();
        console.log(`Final - Sending Paused: ${finalSendingPaused}, Executing Paused: ${finalExecutingPaused}`);

        console.log("\n--- EVM Message Bridge Pause Operations Completed Successfully ---");
    } catch (error) {
        console.error("Error testing pause operations:", error);
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

        await testPauseOperations(messageBridge);
    } catch (error) {
        console.error('Failed to test EVM Message Bridge pause operations:', error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
