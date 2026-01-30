import { EvmMessageBridge } from "@bane-labs/bridge-sdk-ts";
import { createMessageBridgeFromEnvironment, ensureEnv, requireEnvVar } from "../utils";

async function setExecutionManager(messageBridge: EvmMessageBridge, executionManagerAddress: string) {
    console.log(`Setting execution manager address to: ${executionManagerAddress}`);

    try {
        const currentAddress = await messageBridge.executionManager();
        console.log(`Current execution manager address: ${currentAddress}`);

        if (currentAddress.toLowerCase() === executionManagerAddress.toLowerCase()) {
            console.log('The execution manager address is already set to the specified value');
            return;
        }

        const hash = await messageBridge.setExecutionManager(executionManagerAddress as `0x${string}`);
        console.log(`Set execution manager transaction hash: ${hash}`);

        console.log('Execution manager address updated successfully');
        return hash;
    } catch (error) {
        console.error('Failed to set execution manager address:', error);
        throw error;
    }
}

async function main() {
    ensureEnv();

    try {
        const messageBridge = createMessageBridgeFromEnvironment();

        if (!process.env.EVM_PRIVATE_KEY) {
            throw new Error('Wallet client is required for write operations. Please set EVM_PRIVATE_KEY environment variable.');
        }

        const executionManagerAddress = requireEnvVar('EXECUTION_MANAGER_ADDRESS');

        await setExecutionManager(messageBridge, executionManagerAddress);

        console.log('\nExecution manager setup completed successfully!');
    } catch (error) {
        console.error('Failed to set execution manager:', error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
