/**
 * ExecutionManager Read-Only Methods Example
 *
 * This script demonstrates how to call read-only methods on the ExecutionManager contract.
 *
 * Required environment variables:
 * - EXECUTION_MANAGER_CONTRACT_HASH: The contract hash of the ExecutionManager
 * - NEO_NODE_URL: The RPC URL of the Neo node
 * - WALLET_PATH: Path to the wallet file
 * - WALLET_PASSWORD: Password for the wallet (if encrypted)
 *
 * Optional environment variables:
 * - MESSAGE_BRIDGE_CONTRACT_HASH: Used for testing serialization methods
 *
 * Usage:
 *   npm run em:readonly
 */

import { NeoExecutionManager } from "@bane-labs/bridge-sdk-ts";
import { createExecutionManagerFromEnvironment, ensureEnv } from "../utils";

export async function callReadOnlyMethods(executionManager: NeoExecutionManager) {
    console.log("\n--- Testing ExecutionManager Read-Only Methods ---");

    try {
        const version = await executionManager.version();
        console.log(`Contract Version: ${version}`);

        const isPaused = await executionManager.isPaused();
        console.log(`Is Paused: ${isPaused}`);

        const executingNonce = await executionManager.getExecutingNonce();
        console.log(`Executing Nonce: ${executingNonce}`);

        const bridgeManagement = await executionManager.bridgeManagement();
        console.log(`Bridge Management Address: ${bridgeManagement}`);

        const messageBridge = await executionManager.messageBridge();
        console.log(`Message Bridge Address: ${messageBridge}`);

        // Test serialization and validation methods with example values
        const testTarget = process.env.MESSAGE_BRIDGE_CONTRACT_HASH || "0x0000000000000000000000000000000000000000";
        const testMethod = "isPaused";
        const testCallFlags = 0;
        const testArgs: any[] = [];

        try {
            // log serialized call params
            console.log(`Serializing call to ${testMethod} on target ${testTarget} with flags ${testCallFlags} and args ${JSON.stringify(testArgs)}`);
            const serializedCall = await executionManager.serializeCall(testTarget, testMethod, testCallFlags, testArgs);
            console.log(`Serialized Call (${testMethod}): ${serializedCall}`);

            const isValidCall = await executionManager.isValidCall(serializedCall);
            console.log(`Is Valid Call: ${isValidCall}`);

            const isAllowedCall = await executionManager.isAllowedCall(serializedCall);
            console.log(`Is Allowed Call: ${isAllowedCall}`);
        } catch (error) {
            console.log(`Serialization/validation error: ${error}`);
        }

    } catch (error) {
        console.error('Failed to call read-only methods:', error);
    }
}

(async () => {
    ensureEnv();
    const executionManager = await createExecutionManagerFromEnvironment();
    await callReadOnlyMethods(executionManager);
})();
