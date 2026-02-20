import { createMessageBridgeFromEnvironment, ensureEnv, createEvmContractWrapperConfig } from "../utils";
import { encodeFunctionData, encodeAbiParameters, isAddress } from 'viem';

async function encodeExecutableMessageExamples() {
    console.log("\n--- Testing EVM Message Encoding for Executable Messages ---");

    // Configuration from environment variables
    const targetAddress = process.env.ADDRESS || process.env.EVM_WALLET_ADDRESS || "0x170c095a1a24958597177cb74044138c90944bcc";
    const erc20Address = process.env.ERC20_TARGET || process.env.TARGET_CONTRACT_ADDRESS || "0x05fd43b3eFcb4ff1CA08229cAEcf67Bc21D0C0a3";
    const value = BigInt(process.env.VALUE || "0");

    console.log(`ERC20 Contract: ${erc20Address}`);
    console.log(`Function: balanceOf(address)`);
    console.log(`Target Address: ${targetAddress}`);
    console.log(`Value: ${value.toString()}`);

    try {
        console.log("\n--- Encoding EVM Function Call ---");

        // Encode balanceOf function call using viem
        const encodedCallData = encodeFunctionData({
            abi: [
                {
                    name: 'balanceOf',
                    type: 'function',
                    inputs: [{ name: 'account', type: 'address' }],
                    outputs: [{ name: '', type: 'uint256' }],
                    stateMutability: 'view'
                }
            ],
            functionName: 'balanceOf',
            args: [targetAddress as `0x${string}`]
        });
        console.log("Encoded callData:", encodedCallData);

        // Encode as AMBTypes.Call structure using viem
        const encodedEvmCall = encodeEvmCall(erc20Address, true, value, encodedCallData);
        console.log("Encoded AMBTypes.Call:", encodedEvmCall);

        console.log("\n--- Testing Message Bridge State ---");

        // Test current message bridge state using actual available methods
        const messageBridge = await createMessageBridgeFromEnvironment();
        const evmToNeoState = await messageBridge.evmToNeoState();
        console.log(`Current EVM to Neo state: nonce=${evmToNeoState.nonce}, root=${evmToNeoState.root}`);

        const neoToEvmState = await messageBridge.neoToEvmState();
        console.log(`Current Neo to EVM state: nonce=${neoToEvmState.nonce}, root=${neoToEvmState.root}`);

        const sendingPaused = await messageBridge.sendingPaused();
        console.log(`Sending paused: ${sendingPaused}`);

        const executingPaused = await messageBridge.executingPaused();
        console.log(`Executing paused: ${executingPaused}`);

        console.log("\n--- Testing View Function Call ---");

        // Test the encoded call directly
        await callViewFunction(erc20Address, encodedCallData);

        console.log("\n--- Contract Verification ---");

        // Verify target is a contract
        const isTargetContract = await isContract(erc20Address);
        console.log(`Target address is contract: ${isTargetContract}`);

        console.log("\n--- Additional Encoding Examples ---");

        // Show different encoding examples
        await showEncodingExamples();

        console.log("\n--- Message encoding completed ---");
        console.log("Note: This demonstrates how to encode function calls for cross-chain execution.");
        console.log("The encoded data can be used in sendExecutableMessage calls.");

    } catch (error) {
        console.error('Message encoding test failed:', error instanceof Error ? error.message : error);
    }
}

// Helper function to encode EVM call using viem
function encodeEvmCall(target: string, storeResult: boolean, value: bigint, callData: string): string {
    // This mimics the AMBTypes.Call structure encoding using viem
    return encodeAbiParameters(
        [
            { name: 'target', type: 'address' },
            { name: 'storeResult', type: 'bool' },
            { name: 'value', type: 'uint256' },
            { name: 'callData', type: 'bytes' }
        ],
        [target as `0x${string}`, storeResult, value, callData as `0x${string}`]
    );
}

// Test the encoded function call
async function callViewFunction(contractAddress: string, encodedCallData: string) {
    try {
        console.log(`Calling contract ${contractAddress} with data: ${encodedCallData}`);

        // Create public client from utils
        const config = await createEvmContractWrapperConfig(contractAddress as `0x${string}`);
        const publicClient = config.publicClient;

        // Make the actual call
        const result = await publicClient.call({
            to: contractAddress as `0x${string}`,
            data: encodedCallData as `0x${string}`
        });

        console.log("View function call result:", result);

        // Try to decode the result as uint256 for balanceOf
        if (result.data && result.data !== '0x') {
            try {
                const balance = BigInt(result.data);
                console.log("Decoded balance:", balance.toString());
            } catch (decodeError) {
                console.log("Could not decode result as uint256:", result.data);
            }
        } else {
            console.log("No data returned from call");
        }

    } catch (error) {
        console.log("View function call failed:", error instanceof Error ? error.message : error);
    }
}

// Check if address is a contract using viem
async function isContract(address: string): Promise<boolean> {
    try {
        // First validate the address format
        const isValidAddress = isAddress(address);
        if (!isValidAddress) {
            console.log(`Invalid address format: ${address}`);
            return false;
        }

        // Create public client to check if address has code
        const config = await createEvmContractWrapperConfig(address as `0x${string}`);
        const publicClient = config.publicClient;

        const code = await publicClient.getBytecode({
            address: address as `0x${string}`
        });

        const hasCode = !!(code && code !== '0x' && code.length > 2);
        console.log(`Address ${address} has bytecode: ${hasCode}`);
        console.log(`Bytecode length: ${code ? code.length : 0} characters`);

        return hasCode;
    } catch (error) {
        console.log("Could not verify contract:", error instanceof Error ? error.message : error);
        return false;
    }
}

// Show various encoding examples using viem
async function showEncodingExamples() {
    console.log("--- Additional Encoding Examples ---");

    // Example 1: ERC20 transfer
    try {
        const transferData = encodeFunctionData({
            abi: [
                {
                    name: 'transfer',
                    type: 'function',
                    inputs: [
                        { name: 'to', type: 'address' },
                        { name: 'amount', type: 'uint256' }
                    ],
                    outputs: [{ name: '', type: 'bool' }],
                    stateMutability: 'nonpayable'
                }
            ],
            functionName: 'transfer',
            args: ['0x170c095a1a24958597177cb74044138c90944bcc' as `0x${string}`, BigInt('1000000000000000000')]
        });
        console.log("ERC20 transfer encoded data:", transferData);
    } catch (error) {
        console.log("Transfer encoding example failed:", error instanceof Error ? error.message : error);
    }

    // Example 2: Simple contract call with no parameters
    try {
        const totalSupplyData = encodeFunctionData({
            abi: [
                {
                    name: 'totalSupply',
                    type: 'function',
                    inputs: [],
                    outputs: [{ name: '', type: 'uint256' }],
                    stateMutability: 'view'
                }
            ],
            functionName: 'totalSupply',
            args: []
        });
        console.log("ERC20 totalSupply encoded data:", totalSupplyData);
    } catch (error) {
        console.log("TotalSupply encoding example failed:", error instanceof Error ? error.message : error);
    }

    // Example 3: Contract call with multiple parameters
    try {
        const approveData = encodeFunctionData({
            abi: [
                {
                    name: 'approve',
                    type: 'function',
                    inputs: [
                        { name: 'spender', type: 'address' },
                        { name: 'amount', type: 'uint256' }
                    ],
                    outputs: [{ name: '', type: 'bool' }],
                    stateMutability: 'nonpayable'
                }
            ],
            functionName: 'approve',
            args: ['0x170c095a1a24958597177cb74044138c90944bcc' as `0x${string}`, BigInt('1000000000000000000')]
        });
        console.log("ERC20 approve encoded data:", approveData);
    } catch (error) {
        console.log("Approve encoding example failed:", error instanceof Error ? error.message : error);
    }
}

(async () => {
    try {
        ensureEnv();
        await encodeExecutableMessageExamples();
    } catch (error) {
        console.error('Error in message encoding examples:', error);
        process.exit(1);
    }
})();
