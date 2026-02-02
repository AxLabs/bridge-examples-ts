import { EvmBridgeManagement } from "@bane-labs/bridge-sdk-ts";
import { ensureEnv } from "../utils";

export async function callReadOnlyMethods(bridgeManagement: EvmBridgeManagement) {
    console.log("\n--- Testing EVM Bridge Management Read-Only Methods ---");

    try {
        const owner = await bridgeManagement.owner();
        console.log(`Owner: ${owner}`);

        const relayer = await bridgeManagement.getRelayer();
        console.log(`Relayer: ${relayer}`);

        const governor = await bridgeManagement.getGovernor();
        console.log(`Governor: ${governor}`);

        const validators = await bridgeManagement.getValidators();
        console.log(`Validator Count: ${validators.length}`);

        const threshold = await bridgeManagement.getValidatorThreshold();
        console.log(`Validator Threshold: ${threshold}`);

        console.log("\nValidators:");
        for (let i = 0n; i < validators.length; i++) {
            console.log(`  Validator ${i}: ${validators[Number(i)]}`);
        }

        const testValidatorAddress = process.env.VALIDATOR_ADDRESS as `0x${string}`;
        if (testValidatorAddress) {
            const isValidator = await bridgeManagement.isValidator(testValidatorAddress);
            console.log(`Is Validator (${testValidatorAddress}): ${isValidator}`);
        }

        console.log("\n--- EVM Bridge Management Read-Only Methods Completed Successfully ---");
    } catch (error) {
        console.error("Error calling read-only methods:", error);
        throw error;
    }
}

async function main() {
    ensureEnv();

    const { createBridgeManagementFromEnvironment } = await import("../utils");

    try {
        const bridgeManagement = await createBridgeManagementFromEnvironment();
        await callReadOnlyMethods(bridgeManagement);
    } catch (error) {
        console.error("Failed to test EVM Bridge Management read-only methods:", error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
