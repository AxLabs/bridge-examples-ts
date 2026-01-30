import { createTokenBridgeFromEnvironment, ensureEnv } from "../utils";

async function tokenBridgeOperations() {
    console.log("\n--- Testing EVM Token Bridge Operations ---");

    const operation = process.env.TOKEN_OPERATION;
    if (!operation) {
        console.log("Set TOKEN_OPERATION environment variable to specify operation.");
        console.log("Available operations: register, deposit, claim, pause, unpause, set-fee, set-min, set-max, set-withdrawals");
        return;
    }

    const tokenBridge = createTokenBridgeFromEnvironment();

    try {
        switch (operation) {
            case 'register':
                await registerToken(tokenBridge);
                break;
            case 'deposit':
                await depositToken(tokenBridge);
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

async function registerToken(tokenBridge: any) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const neoTokenHash = process.env.NEO_TOKEN_HASH;
    const decimals = Number(process.env.TOKEN_DECIMALS || '18');

    if (!tokenAddress || !neoTokenHash) {
        console.error('Missing TOKEN_ADDRESS or NEO_TOKEN_HASH');
        return;
    }

    console.log(`Registering token ${tokenAddress} with Neo hash ${neoTokenHash}`);
    const tx = await tokenBridge.registerToken(tokenAddress, neoTokenHash, decimals);
    console.log('Register token transaction:', tx);
}

async function depositToken(tokenBridge: any) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const amount = process.env.TOKEN_AMOUNT;
    const recipient = process.env.TOKEN_RECIPIENT;

    if (!tokenAddress || !amount || !recipient) {
        console.error('Missing TOKEN_ADDRESS, TOKEN_AMOUNT, or TOKEN_RECIPIENT');
        return;
    }

    console.log(`Depositing ${amount} of token ${tokenAddress} to recipient: ${recipient}`);
    const tx = await tokenBridge.depositToken(tokenAddress, BigInt(amount), recipient);
    console.log('Deposit token transaction:', tx);
}

async function claimToken(tokenBridge: any) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const nonce = Number(process.env.TOKEN_CLAIM_NONCE);
    const proof = process.env.TOKEN_CLAIM_PROOF;

    if (!tokenAddress || !nonce || !proof) {
        console.error('Missing TOKEN_ADDRESS, TOKEN_CLAIM_NONCE, or TOKEN_CLAIM_PROOF');
        return;
    }

    console.log(`Claiming tokens for ${tokenAddress} at nonce: ${nonce}`);
    const tx = await tokenBridge.claimToken(tokenAddress, nonce, proof);
    console.log('Claim token transaction:', tx);
}

async function pauseTokenBridge(tokenBridge: any) {
    const tokenAddress = process.env.TOKEN_ADDRESS;

    if (!tokenAddress) {
        console.error('Missing TOKEN_ADDRESS');
        return;
    }

    console.log(`Pausing token bridge for ${tokenAddress}...`);
    const tx = await tokenBridge.pauseTokenBridge(tokenAddress);
    console.log('Pause token bridge transaction:', tx);
}

async function unpauseTokenBridge(tokenBridge: any) {
    const tokenAddress = process.env.TOKEN_ADDRESS;

    if (!tokenAddress) {
        console.error('Missing TOKEN_ADDRESS');
        return;
    }

    console.log(`Unpausing token bridge for ${tokenAddress}...`);
    const tx = await tokenBridge.unpauseTokenBridge(tokenAddress);
    console.log('Unpause token bridge transaction:', tx);
}

async function setTokenDepositFee(tokenBridge: any) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const fee = process.env.TOKEN_DEPOSIT_FEE;

    if (!tokenAddress || !fee) {
        console.error('Missing TOKEN_ADDRESS or TOKEN_DEPOSIT_FEE');
        return;
    }

    console.log(`Setting deposit fee for ${tokenAddress} to: ${fee}`);
    const tx = await tokenBridge.setTokenDepositFee(tokenAddress, BigInt(fee));
    console.log('Set token deposit fee transaction:', tx);
}

async function setMinTokenDeposit(tokenBridge: any) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const minAmount = process.env.TOKEN_MIN_DEPOSIT;

    if (!tokenAddress || !minAmount) {
        console.error('Missing TOKEN_ADDRESS or TOKEN_MIN_DEPOSIT');
        return;
    }

    console.log(`Setting minimum deposit for ${tokenAddress} to: ${minAmount}`);
    const tx = await tokenBridge.setMinTokenDeposit(tokenAddress, BigInt(minAmount));
    console.log('Set minimum token deposit transaction:', tx);
}

async function setMaxTokenDeposit(tokenBridge: any) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const maxAmount = process.env.TOKEN_MAX_DEPOSIT;

    if (!tokenAddress || !maxAmount) {
        console.error('Missing TOKEN_ADDRESS or TOKEN_MAX_DEPOSIT');
        return;
    }

    console.log(`Setting maximum deposit for ${tokenAddress} to: ${maxAmount}`);
    const tx = await tokenBridge.setMaxTokenDeposit(tokenAddress, BigInt(maxAmount));
    console.log('Set maximum token deposit transaction:', tx);
}

async function setMaxTokenWithdrawals(tokenBridge: any) {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const maxWithdrawals = process.env.TOKEN_MAX_WITHDRAWALS;

    if (!tokenAddress || !maxWithdrawals) {
        console.error('Missing TOKEN_ADDRESS or TOKEN_MAX_WITHDRAWALS');
        return;
    }

    console.log(`Setting maximum withdrawals for ${tokenAddress} to: ${maxWithdrawals}`);
    const tx = await tokenBridge.setMaxTokenWithdrawals(tokenAddress, Number(maxWithdrawals));
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
