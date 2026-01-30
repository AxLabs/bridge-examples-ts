import { createNativeBridgeFromEnvironment, ensureEnv } from "../utils";

async function nativeBridgeOperations() {
    const operation = process.env.NATIVE_OPERATION;
    if (!operation) {
        console.error("Set NATIVE_OPERATION environment variable to specify operation.");
        console.log("Available operations: set, deposit, claim, pause-bridge, unpause-bridge, set-fee, set-min, set-max, set-total");
        return;
    }

    const nativeBridge = createNativeBridgeFromEnvironment();

    try {
        switch (operation) {
            case 'set':
                await setNativeBridge(nativeBridge);
                break;
            case 'deposit':
                await depositNative(nativeBridge);
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

async function setNativeBridge(nativeBridge: any) {
    const neoTokenAddress = process.env.NEO_TOKEN_ADDRESS;
    const decimals = Number(process.env.NATIVE_DECIMALS || '18');

    if (!neoTokenAddress) {
        console.error('Missing NEO_TOKEN_ADDRESS');
        return;
    }

    console.log('Setting native bridge with Neo token address:', neoTokenAddress);
    const tx = await nativeBridge.write.setNativeBridge([neoTokenAddress, decimals]);
    console.log('Set native bridge transaction:', tx);
}

async function depositNative(nativeBridge: any) {
    const amount = process.env.NATIVE_AMOUNT;
    const recipient = process.env.NATIVE_RECIPIENT;

    if (!amount || !recipient) {
        console.error('Missing NATIVE_AMOUNT or NATIVE_RECIPIENT');
        return;
    }

    console.log(`Depositing ${amount} native tokens to recipient: ${recipient}`);
    const tx = await nativeBridge.write.depositNative([recipient], { value: BigInt(amount) });
    console.log('Deposit native transaction:', tx);
}

async function claimNative(nativeBridge: any) {
    const nonce = Number(process.env.NATIVE_CLAIM_NONCE);
    const proof = process.env.NATIVE_CLAIM_PROOF;

    if (!nonce || !proof) {
        console.error('Missing NATIVE_CLAIM_NONCE or NATIVE_CLAIM_PROOF');
        return;
    }

    console.log(`Claiming native tokens for nonce: ${nonce}`);
    const tx = await nativeBridge.write.claimNative([nonce, proof]);
    console.log('Claim native transaction:', tx);
}

async function pauseNativeBridge(nativeBridge: any) {
    console.log('Pausing native bridge...');
    const tx = await nativeBridge.write.pauseNativeBridge();
    console.log('Pause native bridge transaction:', tx);
}

async function unpauseNativeBridge(nativeBridge: any) {
    console.log('Unpausing native bridge...');
    const tx = await nativeBridge.write.unpauseNativeBridge();
    console.log('Unpause native bridge transaction:', tx);
}

async function setNativeDepositFee(nativeBridge: any) {
    const fee = process.env.NATIVE_DEPOSIT_FEE;

    if (!fee) {
        console.error('Missing NATIVE_DEPOSIT_FEE');
        return;
    }

    console.log(`Setting native deposit fee to: ${fee}`);
    const tx = await nativeBridge.write.setNativeDepositFee([BigInt(fee)]);
    console.log('Set native deposit fee transaction:', tx);
}

async function setMinNativeDeposit(nativeBridge: any) {
    const minAmount = process.env.NATIVE_MIN_DEPOSIT;

    if (!minAmount) {
        console.error('Missing NATIVE_MIN_DEPOSIT');
        return;
    }

    console.log(`Setting minimum native deposit to: ${minAmount}`);
    const tx = await nativeBridge.write.setMinNativeDeposit([BigInt(minAmount)]);
    console.log('Set minimum native deposit transaction:', tx);
}

async function setMaxNativeDeposit(nativeBridge: any) {
    const maxAmount = process.env.NATIVE_MAX_DEPOSIT;

    if (!maxAmount) {
        console.error('Missing NATIVE_MAX_DEPOSIT');
        return;
    }

    console.log(`Setting maximum native deposit to: ${maxAmount}`);
    const tx = await nativeBridge.write.setMaxNativeDeposit([BigInt(maxAmount)]);
    console.log('Set maximum native deposit transaction:', tx);
}

async function setMaxTotalDepositedNative(nativeBridge: any) {
    const maxTotal = process.env.NATIVE_MAX_TOTAL_DEPOSIT;

    if (!maxTotal) {
        console.error('Missing NATIVE_MAX_TOTAL_DEPOSIT');
        return;
    }

    console.log(`Setting maximum total deposited native to: ${maxTotal}`);
    const tx = await nativeBridge.write.setMaxTotalDepositedNative([BigInt(maxTotal)]);
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
