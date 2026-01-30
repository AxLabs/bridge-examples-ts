import { NeoMessageBridge } from "@bane-labs/bridge-sdk-ts";
import { ensureEnv } from "../utils";

export async function callReadOnlyMethods(messageBridge: NeoMessageBridge) {
    console.log("\n--- Testing Read-Only Methods ---");

    try {
        const version = await messageBridge.version();
        console.log(`Contract Version: ${version}`);

        const sendingFee = await messageBridge.sendingFee();
        console.log(`Sending Fee: ${sendingFee} (10^-8 GAS units)`);

        const managementAddress = await messageBridge.management();
        console.log(`Management Contract Address: ${managementAddress}`);

        const unclaimedFees = await messageBridge.unclaimedFees();
        console.log(`Unclaimed Fees: ${unclaimedFees} (10^-8 GAS units)`);

        const linkedChainId = await messageBridge.linkedChainId();
        console.log(`Linked Chain ID: ${linkedChainId}`);

        const executionManagerAddress = await messageBridge.executionManager();
        console.log(`Execution Manager Address: ${executionManagerAddress}`);

        const neoToEvmNonce = await messageBridge.neoToEvmNonce();
        console.log(`Neo to EVM Nonce: ${neoToEvmNonce}`);

        const evmToNeoNonce = await messageBridge.evmToNeoNonce();
        console.log(`EVM to Neo Nonce: ${evmToNeoNonce}`);

        const neoToEvmRoot = await messageBridge.neoToEvmRoot();
        console.log(`Neo to EVM Root: ${neoToEvmRoot}`);

        const evmToNeoRoot = await messageBridge.evmToNeoRoot();
        console.log(`EVM to Neo Root: ${evmToNeoRoot}`);

        const messageBridgeInfo = await messageBridge.getMessageBridge();
        console.log(`Message Bridge Info:`);
        console.log(`  EVM to Neo State:`, messageBridgeInfo.evmToNeoState);
        console.log(`  Neo to EVM State:`, messageBridgeInfo.neoToEvmState);
        console.log(`  Config:`, messageBridgeInfo.config);

        // Test methods that require parameters with example values
        const testNonce = process.env.MESSAGE_NONCE ? Number(process.env.MESSAGE_NONCE) : 1;

        try {
            const message = await messageBridge.getMessage(testNonce);
            console.log(`Message (nonce ${testNonce}):`);
            console.log(`  Metadata Bytes: ${message.metadataBytes}`);
            console.log(`  Raw Message: ${message.rawMessage}`);
        } catch (error) {
            console.log(`getMessage(${testNonce}): No message found or error - ${error instanceof Error ? error.message : error}`);
        }

        try {
            const metadata = await messageBridge.getMetadata(testNonce);
            console.log(`Metadata (nonce ${testNonce}):`);
            console.log(`  Type: ${metadata.type} (${metadata.type === 0 ? 'EXECUTABLE' : metadata.type === 1 ? 'STORE_ONLY' : 'RESULT'})`);
            console.log(`  Timestamp: ${metadata.timestamp}`);
            console.log(`  Sender: ${metadata.sender}`);

            // Type-specific fields
            if (metadata.type === 0) {
                console.log(`  Store Result: ${metadata.storeResult}`);
            } else if (metadata.type === 2) {
                console.log(`  Initial Message Nonce: ${metadata.initialMessageNonce}`);
            }
        } catch (error) {
            console.log(`getMetadata(${testNonce}): No metadata found or error - ${error instanceof Error ? error.message : error}`);
        }

        try {
            const executableState = await messageBridge.getExecutableState(testNonce);
            console.log(`Executable State (nonce ${testNonce}):`);
            console.log(`  Executed: ${executableState.executed}`);
            console.log(`  Expiration Time: ${executableState.expirationTime}`);
        } catch (error) {
            console.log(`getExecutableState(${testNonce}): No state found or error - ${error instanceof Error ? error.message : error}`);
        }

        try {
            const evmExecutionResult = await messageBridge.getEvmExecutionResult(Number(process.env.MESSAGE_NONCE));
            console.log(`EVM Execution Result (nonce 1): ${evmExecutionResult}`);
        } catch (error) {
            console.log(`getEvmExecutionResult: No result found or error - ${error instanceof Error ? error.message : error}`);
        }

        try {
            const neoExecutionResult = await messageBridge.getNeoExecutionResult(Number(process.env.MESSAGE_NONCE));
            console.log(`Neo Execution Result (nonce 1): ${neoExecutionResult}`);
        } catch (error) {
            console.log(`getNeoExecutionResult: No result found or error - ${error instanceof Error ? error.message : error}`);
        }

    } catch (error) {
        console.error('Failed to call read-only methods:', error instanceof Error ? error.message : error);
    }
}

(async () => {
    ensureEnv();
    const {createMessageBridgeFromEnvironment} = await import("../utils");
    const messageBridge = await createMessageBridgeFromEnvironment();
    await callReadOnlyMethods(messageBridge);
})();
