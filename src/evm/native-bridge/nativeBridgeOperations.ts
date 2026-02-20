import { createNativeBridgeFromEnvironment, ensureEnv } from "../utils";
import { type EvmNativeBridge } from "@bane-labs/bridge-sdk-ts";

async function nativeBridgeOperations() {
    const operation = process.env.NATIVE_OPERATION;
    if (!operation) {
        console.error("Set NATIVE_OPERATION environment variable to specify operation.");
        console.log("Available operations: set, withdraw, claim, pause-bridge, unpause-bridge, set-fee, set-min, set-max, set-total");
        return;
    }

    const nativeBridge = await createNativeBridgeFromEnvironment();

    try {
        switch (operation) {
            case 'set':
                await setNativeBridge(nativeBridge);
                break;
            case 'withdraw':
                await withdrawNative(nativeBridge);
                break;
            case 'claim':
                await claimNative(nativeBridge);
                break;
            case 'pause-bridge':
                await pauseNativeBridge(nativeBridge);
                break;
            case 'unpause-bridge':
                await unpauseNativeBridge(nativeBridge);
                break;
            case 'set-fee':
                await setNativeDepositFee(nativeBridge);
                break;
            case 'set-min':
                await setMinNativeDeposit(nativeBridge);
                break;
            case 'set-max':
                await setMaxNativeDeposit(nativeBridge);
                break;
            case 'set-total':
                await setMaxTotalDepositedNative(nativeBridge);
                break;
            default:
                console.error(`Unknown operation: ${operation}`);
                console.log("Available operations: set, deposit, claim, pause-bridge, unpause-bridge, set-fee, set-min, set-max, set-total");
        }
    } catch (error) {
        console.error(`Failed to execute ${operation}:`, error);
    }
}

async function setNativeBridge(nativeBridge: EvmNativeBridge) {
    const fee = BigInt(process.env.NATIVE_DEPOSIT_FEE || '0');
    const minAmount = BigInt(process.env.NATIVE_MIN_DEPOSIT || '1000000');
    const maxAmount = BigInt(process.env.NATIVE_MAX_DEPOSIT || '1000000000000');
    const maxDeposits = BigInt(process.env.NATIVE_MAX_WITHDRAWALS || '1000');
    const decimalsHere = BigInt(process.env.NATIVE_DECIMALS || '18');
    const decimalsOnN3 = BigInt(process.env.NATIVE_DECIMALS_LINKED_CHAIN || '18');

    console.log('Setting native bridge with parameters:');
    console.log(`Fee: ${fee}, Min: ${minAmount}, Max: ${maxAmount}, MaxDeposits: ${maxDeposits}`);
    console.log(`DecimalsHere: ${decimalsHere}, DecimalsOnN3: ${decimalsOnN3}`);

    const tx = await nativeBridge.setNativeBridge(fee, minAmount, maxAmount, maxDeposits, decimalsHere, decimalsOnN3);
    console.log('Set native bridge transaction:', tx);
}

async function withdrawNative(nativeBridge: EvmNativeBridge) {
    const amount = process.env.NATIVE_AMOUNT;
    const recipient = process.env.NATIVE_RECIPIENT;
    const maxFee = process.env.NATIVE_MAX_FEE;

    if (!amount || !recipient || !maxFee) {
        console.error('Missing NATIVE_AMOUNT, NATIVE_RECIPIENT, or NATIVE_MAX_FEE');
        return;
    }

    console.log(`Withdrawing ${amount} native tokens to recipient: ${recipient}, maxFee: ${maxFee}`);
    const tx = await nativeBridge.withdrawNative(recipient as `0x${string}`, BigInt(maxFee), { value: BigInt(amount) });
    console.log('Withdraw native transaction:', tx);
}

async function claimNative(nativeBridge: EvmNativeBridge) {
    const nonce = Number(process.env.NATIVE_CLAIM_NONCE);

    if (!nonce) {
        console.error('Missing NATIVE_CLAIM_NONCE');
        return;
    }

    console.log(`Claiming native tokens for nonce: ${nonce}`);
    const tx = await nativeBridge.claimNative(BigInt(nonce));
    console.log('Claim native transaction:', tx);
}

async function pauseNativeBridge(nativeBridge: EvmNativeBridge) {
    console.log('Pausing native bridge...');
    const tx = await nativeBridge.pauseNativeBridge();
    console.log('Pause native bridge transaction:', tx);
}

async function unpauseNativeBridge(nativeBridge: EvmNativeBridge) {
    console.log('Unpausing native bridge...');
    const tx = await nativeBridge.unpauseNativeBridge();
    console.log('Unpause native bridge transaction:', tx);
}

async function setNativeDepositFee(nativeBridge: EvmNativeBridge) {
    const fee = process.env.NATIVE_DEPOSIT_FEE;

    if (!fee) {
        console.error('Missing NATIVE_DEPOSIT_FEE');
        return;
    }

    console.log(`Setting native deposit fee to: ${fee}`);
    const tx = await nativeBridge.setNativeWithdrawalFee(BigInt(fee));
    console.log('Set native deposit fee transaction:', tx);
}

async function setMinNativeDeposit(nativeBridge: EvmNativeBridge) {
    const minAmount = process.env.NATIVE_MIN_DEPOSIT;

    if (!minAmount) {
        console.error('Missing NATIVE_MIN_DEPOSIT');
        return;
    }

    console.log(`Setting minimum native deposit to: ${minAmount}`);
    const tx = await nativeBridge.setMinNativeWithdrawalAmount(BigInt(minAmount));
    console.log('Set minimum native deposit transaction:', tx);
}

async function setMaxNativeDeposit(nativeBridge: EvmNativeBridge) {
    const maxAmount = process.env.NATIVE_MAX_DEPOSIT;

    if (!maxAmount) {
        console.error('Missing NATIVE_MAX_DEPOSIT');
        return;
    }

    console.log(`Setting maximum native deposit to: ${maxAmount}`);
    const tx = await nativeBridge.setMaxNativeWithdrawalAmount(BigInt(maxAmount));
    console.log('Set maximum native deposit transaction:', tx);
}

async function setMaxTotalDepositedNative(nativeBridge: EvmNativeBridge) {
    const maxTotal = process.env.NATIVE_MAX_TOTAL_DEPOSIT;

    if (!maxTotal) {
        console.error('Missing NATIVE_MAX_TOTAL_DEPOSIT');
        return;
    }

    console.log(`Setting maximum total deposited native to: ${maxTotal}`);
    const tx = await nativeBridge.setMaxNativeDeposits(BigInt(maxTotal));
    console.log('Set maximum total deposited native transaction:', tx);
}

(async () => {
    try {
        ensureEnv();
        await nativeBridgeOperations();
    } catch (error) {
        console.error('Error executing native bridge operations:', error);
        process.exit(1);
    }
})();
