import { EvmExecutionManager } from "@bane-labs/bridge-sdk-ts";
import { ensureEnv } from "../utils";

export async function callReadOnlyMethods(executionManager: EvmExecutionManager) {
    console.log("\n--- Testing EVM Execution Manager Read-Only Methods ---");

    try {
        const version = await executionManager.VERSION();
        console.log(`Contract Version: ${version}`);

        const executingNonce = await executionManager.executingNonce();
        console.log(`Executing Nonce: ${executingNonce}`);

        const defaultAdminRole = await executionManager.DEFAULT_ADMIN_ROLE();
        console.log(`Default Admin Role: ${defaultAdminRole}`);

        const bridgeRole = await executionManager.BRIDGE_ROLE();
        console.log(`Bridge Role: ${bridgeRole}`);

        console.log("\n--- EVM Execution Manager Read-Only Methods Completed Successfully ---");
    } catch (error) {
        console.error("Error calling read-only methods:", error);
        throw error;
    }
}

async function main() {
    ensureEnv();

    const { createExecutionManagerFromEnvironment } = await import("../utils");

    try {
        const executionManager = createExecutionManagerFromEnvironment();
        await callReadOnlyMethods(executionManager);
    } catch (error) {
        console.error("Failed to test EVM Execution Manager read-only methods:", error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
