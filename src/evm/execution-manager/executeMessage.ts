import { EvmExecutionManager } from "@bane-labs/bridge-sdk-ts";
import { createExecutionManagerFromEnvironment, ensureEnv, requireEnvVar } from "../utils";

async function executeMessage(executionManager: EvmExecutionManager, nonce: bigint, executableCode: string, refundAddress: string) {
    console.log(`Executing message with nonce: ${nonce}`);
    console.log(`Executable code: ${executableCode}`);
    console.log(`Refund address: ${refundAddress}`);

    try {
        const hash = await executionManager.executeMessage(
            nonce,
            executableCode as `0x${string}`,
            refundAddress as `0x${string}`
        );

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
        const executionManager = await createExecutionManagerFromEnvironment();

        if (!process.env.EVM_WALLET_PATH) {
            throw new Error('Wallet client is required for write operations. Please set EVM_WALLET_PATH environment variable.');
        }

        const nonceStr = requireEnvVar('MESSAGE_NONCE');
        const executableCode = requireEnvVar('EXECUTABLE_CODE');
        const refundAddress = process.env.REFUND_ADDRESS || process.env.EVM_WALLET_ADDRESS;

        if (!refundAddress) {
            throw new Error('REFUND_ADDRESS or EVM_WALLET_ADDRESS environment variable is required');
        }

        const nonce = BigInt(nonceStr);

        await executeMessage(executionManager, nonce, executableCode, refundAddress);

        console.log('\nMessage execution completed successfully!');
    } catch (error) {
        console.error('Failed to execute message:', error);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
