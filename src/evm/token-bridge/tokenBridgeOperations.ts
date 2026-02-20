import { createTokenBridgeFromEnvironment, ensureEnv } from "../utils";
import { type EvmTokenBridge } from "@bane-labs/bridge-sdk-ts";

async function tokenBridgeOperations() {
    console.log("\n--- Testing EVM Token Bridge Operations ---");

    const operation = process.env.TOKEN_OPERATION;
    if (!operation) {
        console.log("Set TOKEN_OPERATION environment variable to specify operation.");
        console.log("Available operations: register, withdraw, claim, pause, unpause, set-fee, set-min, set-max, set-withdrawals");
        return;
    }

    const tokenBridge = await createTokenBridgeFromEnvironment();

    try {
        switch (operation) {
            case 'register':
                await registerToken(tokenBridge);
                break;
            case 'withdraw':
                await withdrawToken(tokenBridge);
                break;
            case 'claim':
                await claimToken(tokenBridge);
                break;
            case 'pause':
                await pauseTokenBridge(tokenBridge);
                break;
            case 'unpause':
                await unpauseTokenBridge(tokenBridge);
                break;
            case 'set-fee':
                await setTokenDepositFee(tokenBridge);
                break;
            case 'set-min':
                await setMinTokenDeposit(tokenBridge);
                break;
            case 'set-max':
                await setMaxTokenDeposit(tokenBridge);
                break;
            case 'set-withdrawals':
                await setMaxTokenWithdrawals(tokenBridge);
                break;
            default:
                console.error(`Unknown operation: ${operation}`);
                console.log("Available operations: register, deposit, claim, pause, unpause, set-fee, set-min, set-max, set-withdrawals");
        }
    } catch (error) {
        console.error(`Failed to execute ${operation}:`, error);
    }
}

async function registerToken(tokenBridge: EvmTokenBridge) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const neoN3Token = process.env.NEO_N3_TOKEN_ADDRESS;
    const fee = BigInt(process.env.TOKEN_DEPOSIT_FEE || '0');
    const minAmount = BigInt(process.env.TOKEN_MIN_DEPOSIT || '1000000');
    const maxAmount = BigInt(process.env.TOKEN_MAX_DEPOSIT || '1000000000000');
    const maxDeposits = BigInt(process.env.TOKEN_MAX_WITHDRAWALS || '1000');
    const decimalsLinkedChain = BigInt(process.env.TOKEN_DECIMALS_LINKED_CHAIN || '18');

    if (!tokenAddress || !neoN3Token) {
        console.error('Missing TOKEN_ADDRESS or NEO_N3_TOKEN_ADDRESS');
        return;
    }

    const tokenConfig = {
        neoN3Token: neoN3Token as `0x${string}`,
        fee,
        minAmount,
        maxAmount,
        maxDeposits,
        decimalScalingFactor: decimalsLinkedChain
    };

    console.log(`Registering token ${tokenAddress} with Neo N3 token ${neoN3Token}`);
    const tx = await tokenBridge.registerToken(tokenAddress as `0x${string}`, tokenConfig);
    console.log('Register token transaction:', tx);
}

async function withdrawToken(tokenBridge: EvmTokenBridge) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const amount = process.env.TOKEN_AMOUNT;
    const recipient = process.env.TOKEN_RECIPIENT;

    if (!tokenAddress || !amount || !recipient) {
        console.error('Missing TOKEN_ADDRESS, TOKEN_AMOUNT, or TOKEN_RECIPIENT');
        return;
    }

    console.log(`Withdrawing ${amount} of token ${tokenAddress} to recipient: ${recipient}`);
    const tx = await tokenBridge.withdrawToken(
        tokenAddress as `0x${string}`,
        recipient as `0x${string}`,
        BigInt(amount)
    );
    console.log('Withdraw token transaction:', tx);
}

async function claimToken(tokenBridge: EvmTokenBridge) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const nonce = Number(process.env.TOKEN_CLAIM_NONCE);

    if (!tokenAddress || !nonce) {
        console.error('Missing TOKEN_ADDRESS or TOKEN_CLAIM_NONCE');
        return;
    }

    console.log(`Claiming tokens for ${tokenAddress} at nonce: ${nonce}`);
    const tx = await tokenBridge.claimToken(tokenAddress as `0x${string}`, BigInt(nonce));
    console.log('Claim token transaction:', tx);
}

async function pauseTokenBridge(tokenBridge: EvmTokenBridge) {
    const tokenAddress = process.env.TOKEN_ADDRESS;

    if (!tokenAddress) {
        console.error('Missing TOKEN_ADDRESS');
        return;
    }

    console.log(`Pausing token bridge for ${tokenAddress}...`);
    const tx = await tokenBridge.pauseTokenBridge(tokenAddress as `0x${string}`);
    console.log('Pause token bridge transaction:', tx);
}

async function unpauseTokenBridge(tokenBridge: EvmTokenBridge) {
    const tokenAddress = process.env.TOKEN_ADDRESS;

    if (!tokenAddress) {
        console.error('Missing TOKEN_ADDRESS');
        return;
    }

    console.log(`Unpausing token bridge for ${tokenAddress}...`);
    const tx = await tokenBridge.unpauseTokenBridge(tokenAddress as `0x${string}`);
    console.log('Unpause token bridge transaction:', tx);
}

async function setTokenDepositFee(tokenBridge: EvmTokenBridge) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const fee = process.env.TOKEN_DEPOSIT_FEE;

    if (!tokenAddress || !fee) {
        console.error('Missing TOKEN_ADDRESS or TOKEN_DEPOSIT_FEE');
        return;
    }

    console.log(`Setting deposit fee for ${tokenAddress} to: ${fee}`);
    const tx = await tokenBridge.setTokenWithdrawalFee([tokenAddress as `0x${string}`], [BigInt(fee)]);
    console.log('Set token deposit fee transaction:', tx);
}

async function setMinTokenDeposit(tokenBridge: EvmTokenBridge) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const minAmount = process.env.TOKEN_MIN_DEPOSIT;

    if (!tokenAddress || !minAmount) {
        console.error('Missing TOKEN_ADDRESS or TOKEN_MIN_DEPOSIT');
        return;
    }

    console.log(`Setting minimum deposit for ${tokenAddress} to: ${minAmount}`);
    const tx = await tokenBridge.setMinTokenWithdrawalAmount([tokenAddress as `0x${string}`], [BigInt(minAmount)]);
    console.log('Set minimum token deposit transaction:', tx);
}

async function setMaxTokenDeposit(tokenBridge: EvmTokenBridge) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const maxAmount = process.env.TOKEN_MAX_DEPOSIT;

    if (!tokenAddress || !maxAmount) {
        console.error('Missing TOKEN_ADDRESS or TOKEN_MAX_DEPOSIT');
        return;
    }

    console.log(`Setting maximum deposit for ${tokenAddress} to: ${maxAmount}`);
    const tx = await tokenBridge.setMaxTokenWithdrawalAmount([tokenAddress as `0x${string}`], [BigInt(maxAmount)]);
    console.log('Set maximum token deposit transaction:', tx);
}

async function setMaxTokenWithdrawals(tokenBridge: EvmTokenBridge) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const maxWithdrawals = process.env.TOKEN_MAX_WITHDRAWALS;

    if (!tokenAddress || !maxWithdrawals) {
        console.error('Missing TOKEN_ADDRESS or TOKEN_MAX_WITHDRAWALS');
        return;
    }

    console.log(`Setting maximum withdrawals for ${tokenAddress} to: ${maxWithdrawals}`);
    const tx = await tokenBridge.setMaxTokenDeposits([tokenAddress as `0x${string}`], [BigInt(maxWithdrawals)]);
    console.log('Set maximum token withdrawals transaction:', tx);
}

(async () => {
    try {
        ensureEnv();
        await tokenBridgeOperations();
    } catch (error) {
        console.error('Error executing token bridge operations:', error);
        process.exit(1);
    }
})();
