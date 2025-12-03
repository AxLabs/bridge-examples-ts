
import { createNativeTokenBridgeFromEnvironment, ensureEnv } from "../utils";
import { NativeTokenBridge } from "@bane-labs/bridge-sdk-ts";

async function nativeBridgeOperations(neoXBridge: NativeTokenBridge) {
    const operation = process.env.NATIVE_OPERATION;
    if (!operation) {
        console.error("Set NATIVE_OPERATION environment variable to specify operation.");
        return;
    }

    try {
        switch (operation) {
            case 'set-native-bridge':
                await setNativeBridge(neoXBridge);
                break;
            case 'deposit-native':
                await depositNative(neoXBridge);
                break;
            case 'claim-native':
                await claimNative(neoXBridge);
                break;
            case 'pause-native':
                await pauseNativeBridge(neoXBridge);
                break;
            case 'unpause-native':
                await unpauseNativeBridge(neoXBridge);
                break;
            case 'set-native-fee':
                await setNativeDepositFee(neoXBridge);
                break;
            case 'set-native-min':
                await setMinNativeDeposit(neoXBridge);
                break;
            case 'set-native-max':
                await setMaxNativeDeposit(neoXBridge);
                break;
            case 'set-native-total':
                await setMaxTotalDepositedNative(neoXBridge);
                break;
            default:
                console.error(`Unknown operation: ${operation}`);
        }
    } catch (error) {
        console.error(`Failed to execute ${operation}:`, error);
    }
}

async function setNativeBridge(neoXBridge: NativeTokenBridge) {
    const tokenForNativeBridge = process.env.NATIVE_TOKEN_ADDRESS;
    if (!tokenForNativeBridge) {
        throw new Error('NATIVE_TOKEN_ADDRESS environment variable is required');
    }

    const decimalsOnLinkedChain = process.env.NATIVE_DECIMALS_LINKED_CHAIN ? parseInt(process.env.NATIVE_DECIMALS_LINKED_CHAIN, 10) : 18;
    const depositFee = process.env.NATIVE_DEPOSIT_FEE ? parseInt(process.env.NATIVE_DEPOSIT_FEE, 10) : 0;
    const minAmount = process.env.NATIVE_MIN_AMOUNT ? parseInt(process.env.NATIVE_MIN_AMOUNT, 10) : 1000000;
    const maxAmount = process.env.NATIVE_MAX_AMOUNT ? parseInt(process.env.NATIVE_MAX_AMOUNT, 10) : 1000000000000;
    const maxWithdrawals = process.env.NATIVE_MAX_WITHDRAWALS ? parseInt(process.env.NATIVE_MAX_WITHDRAWALS, 10) : 1000;
    const maxTotalDeposited = process.env.NATIVE_MAX_TOTAL_DEPOSITED ? parseInt(process.env.NATIVE_MAX_TOTAL_DEPOSITED, 10) : 10000000000000;

    console.log(`Setting native bridge for token: ${tokenForNativeBridge}`);
    console.log(`Decimals on linked chain: ${decimalsOnLinkedChain}`);
    console.log(`Deposit fee: ${depositFee}`);
    console.log(`Min amount: ${minAmount}`);
    console.log(`Max amount: ${maxAmount}`);
    console.log(`Max withdrawals: ${maxWithdrawals}`);
    console.log(`Max total deposited: ${maxTotalDeposited}`);

    const result = await neoXBridge.setNativeBridge(
        tokenForNativeBridge,
        decimalsOnLinkedChain,
        depositFee,
        minAmount,
        maxAmount,
        maxWithdrawals,
        maxTotalDeposited
    );
    console.log(`Native bridge set. Transaction: ${result.txHash}`);
}

async function depositNative(neoXBridge: NativeTokenBridge) {
    const from = neoXBridge.getConfig().account.scriptHash;
    const to = process.env.NATIVE_TO_ADDRESS;
    const amount = process.env.NATIVE_AMOUNT;
    const maxFee = process.env.NATIVE_MAX_FEE;

    if (!from || !to || !amount || !maxFee) {
        throw new Error('NATIVE_FROM_ADDRESS, NATIVE_TO_ADDRESS, NATIVE_AMOUNT, and NATIVE_MAX_FEE environment variables are required');
    }

    const amountValue = parseInt(amount, 10);
    const maxFeeValue = parseInt(maxFee, 10);
    const feeSponsor = from;

    console.log(`Depositing native tokens from: ${from} to: ${to}`);
    console.log(`Amount: ${amountValue}, Max fee: ${maxFeeValue}`);
    if (feeSponsor) {
        console.log(`Fee sponsor: ${feeSponsor}`);
    }

    const result = await neoXBridge.depositNative(from, to, amountValue, maxFeeValue, feeSponsor);
    console.log(`Native deposit completed. Transaction: ${result.txHash}`);
}

async function claimNative(neoXBridge: NativeTokenBridge) {
    const nonce = process.env.NATIVE_CLAIM_NONCE;
    if (!nonce) {
        throw new Error('NATIVE_CLAIM_NONCE environment variable is required');
    }

    const nonceValue = parseInt(nonce, 10);
    console.log(`Claiming native tokens for nonce: ${nonceValue}`);

    const result = await neoXBridge.claimNative(nonceValue);
    console.log(`Native claim completed. Transaction: ${result.txHash}`);
}

async function pauseNativeBridge(neoXBridge: NativeTokenBridge) {
    console.log('Pausing native bridge...');
    const result = await neoXBridge.pauseNativeBridge();
    console.log(`Native bridge paused. Transaction: ${result.txHash}`);
}

async function unpauseNativeBridge(neoXBridge: NativeTokenBridge) {
    console.log('Unpausing native bridge...');
    const result = await neoXBridge.unpauseNativeBridge();
    console.log(`Native bridge unpaused. Transaction: ${result.txHash}`);
}

async function setNativeDepositFee(neoXBridge: NativeTokenBridge) {
    const newFee = process.env.NEW_NATIVE_DEPOSIT_FEE;
    if (!newFee) {
        throw new Error('NEW_NATIVE_DEPOSIT_FEE environment variable is required');
    }

    const newFeeValue = parseInt(newFee, 10);
    console.log(`Setting native deposit fee to: ${newFeeValue}`);

    const result = await neoXBridge.setNativeDepositFee(newFeeValue);
    console.log(`Native deposit fee updated. Transaction: ${result.txHash}`);
}

async function setMinNativeDeposit(neoXBridge: NativeTokenBridge) {
    const newMinAmount = process.env.NEW_MIN_NATIVE_DEPOSIT;
    if (!newMinAmount) {
        throw new Error('NEW_MIN_NATIVE_DEPOSIT environment variable is required');
    }

    const newMinAmountValue = parseInt(newMinAmount, 10);
    console.log(`Setting minimum native deposit to: ${newMinAmountValue}`);

    const result = await neoXBridge.setMinNativeDeposit(newMinAmountValue);
    console.log(`Minimum native deposit updated. Transaction: ${result.txHash}`);
}

async function setMaxNativeDeposit(neoXBridge: NativeTokenBridge) {
    const newMaxAmount = process.env.NEW_MAX_NATIVE_DEPOSIT;
    if (!newMaxAmount) {
        throw new Error('NEW_MAX_NATIVE_DEPOSIT environment variable is required');
    }

    const newMaxAmountValue = parseInt(newMaxAmount, 10);
    console.log(`Setting maximum native deposit to: ${newMaxAmountValue}`);

    const result = await neoXBridge.setMaxNativeDeposit(newMaxAmountValue);
    console.log(`Maximum native deposit updated. Transaction: ${result.txHash}`);
}

async function setMaxTotalDepositedNative(neoXBridge: NativeTokenBridge) {
    const newMaxTotalDeposited = process.env.NEW_MAX_TOTAL_DEPOSITED_NATIVE;
    if (!newMaxTotalDeposited) {
        throw new Error('NEW_MAX_TOTAL_DEPOSITED_NATIVE environment variable is required');
    }

    const newMaxTotalDepositedValue = parseInt(newMaxTotalDeposited, 10);
    console.log(`Setting maximum total deposited native to: ${newMaxTotalDepositedValue}`);

    const result = await neoXBridge.setMaxTotalDepositedNative(newMaxTotalDepositedValue);
    console.log(`Maximum total deposited native updated. Transaction: ${result.txHash}`);
}

(async () => {
    ensureEnv();
    const neoXBridge = await createNativeTokenBridgeFromEnvironment();
    await nativeBridgeOperations(neoXBridge);
})();
