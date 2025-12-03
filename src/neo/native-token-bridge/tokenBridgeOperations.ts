import { createNativeTokenBridgeFromEnvironment, ensureEnv } from "../utils";
import { NativeTokenBridge } from "@bane-labs/bridge-sdk-ts";

async function tokenBridgeOperations(neoXBridge: NativeTokenBridge) {
    console.log("\n--- Testing NeoX Bridge Token Operations ---");

    const operation = process.env.TOKEN_OPERATION;
    if (!operation) {
        console.log("Set TOKEN_OPERATION environment variable to specify operation.");
        return;
    }

    try {
        switch (operation) {
            case 'register-token':
                await registerToken(neoXBridge);
                break;
            case 'deposit-token':
                await depositToken(neoXBridge);
                break;
            case 'claim-token':
                await claimToken(neoXBridge);
                break;
            case 'pause-token':
                await pauseTokenBridge(neoXBridge);
                break;
            case 'unpause-token':
                await unpauseTokenBridge(neoXBridge);
                break;
            case 'set-token-fee':
                await setTokenDepositFee(neoXBridge);
                break;
            case 'set-token-min':
                await setMinTokenDeposit(neoXBridge);
                break;
            case 'set-token-max':
                await setMaxTokenDeposit(neoXBridge);
                break;
            case 'set-token-withdrawals':
                await setMaxTokenWithdrawals(neoXBridge);
                break;
            default:
                console.error(`Unknown operation: ${operation}`);
        }
    } catch (error) {
        console.error(`Failed to execute ${operation}:`, error);
    }
}

async function registerToken(neoXBridge: NativeTokenBridge) {
    const token = process.env.TOKEN_ADDRESS;
    if (!token) {
        throw new Error('TOKEN_ADDRESS environment variable is required');
    }

    const decimalsOnLinkedChain = process.env.TOKEN_DECIMALS_LINKED_CHAIN ? parseInt(process.env.TOKEN_DECIMALS_LINKED_CHAIN, 10) : 18;
    const depositFee = process.env.TOKEN_DEPOSIT_FEE ? parseInt(process.env.TOKEN_DEPOSIT_FEE, 10) : 0;
    const minDeposit = process.env.TOKEN_MIN_DEPOSIT ? parseInt(process.env.TOKEN_MIN_DEPOSIT, 10) : 1000000;
    const maxDeposit = process.env.TOKEN_MAX_DEPOSIT ? parseInt(process.env.TOKEN_MAX_DEPOSIT, 10) : 1000000000000;
    const maxWithdrawals = process.env.TOKEN_MAX_WITHDRAWALS ? parseInt(process.env.TOKEN_MAX_WITHDRAWALS, 10) : 1000;

    const tokenConfig = {
        decimalsOnLinkedChain,
        depositFee,
        minDeposit,
        maxDeposit,
        maxWithdrawals
    };

    console.log(`Registering token: ${token}`);
    console.log(`Token config:`);
    console.log(`  Decimals on linked chain: ${decimalsOnLinkedChain}`);
    console.log(`  Deposit fee: ${depositFee}`);
    console.log(`  Min deposit: ${minDeposit}`);
    console.log(`  Max deposit: ${maxDeposit}`);
    console.log(`  Max withdrawals: ${maxWithdrawals}`);

    const result = await neoXBridge.registerToken(token, tokenConfig);
    console.log(`Token registered. Transaction: ${result.txHash}`);
}

async function depositToken(neoXBridge: NativeTokenBridge) {
    const token = process.env.TOKEN_ADDRESS;
    const from = neoXBridge.getConfig().account.scriptHash;
    const to = process.env.TOKEN_TO_ADDRESS;
    const amount = process.env.TOKEN_AMOUNT;
    const maxFee = process.env.TOKEN_MAX_FEE;

    if (!token || !from || !to || !amount || !maxFee) {
        throw new Error('TOKEN_ADDRESS, TOKEN_FROM_ADDRESS, TOKEN_TO_ADDRESS, TOKEN_AMOUNT, and TOKEN_MAX_FEE environment variables are required');
    }

    const amountValue = parseInt(amount, 10);
    const maxFeeValue = parseInt(maxFee, 10);
    const feeSponsor = from;

    console.log(`Depositing token: ${token}`);
    console.log(`From: ${from} to: ${to}`);
    console.log(`Amount: ${amountValue}, Max fee: ${maxFeeValue}`);
    if (feeSponsor) {
        console.log(`Fee sponsor: ${feeSponsor}`);
    }

    const result = await neoXBridge.depositToken(token, from, to, amountValue, maxFeeValue, feeSponsor);
    console.log(`Token deposit completed. Transaction: ${result.txHash}`);
}

async function claimToken(neoXBridge: NativeTokenBridge) {
    const token = process.env.TOKEN_ADDRESS;
    const nonce = process.env.TOKEN_CLAIM_NONCE;

    if (!token || !nonce) {
        throw new Error('TOKEN_ADDRESS and TOKEN_CLAIM_NONCE environment variables are required');
    }

    const nonceValue = parseInt(nonce, 10);
    console.log(`Claiming token: ${token} for nonce: ${nonceValue}`);

    const result = await neoXBridge.claimToken(token, nonceValue);
    console.log(`Token claim completed. Transaction: ${result.txHash}`);
}

async function pauseTokenBridge(neoXBridge: NativeTokenBridge) {
    const neoN3Token = process.env.TOKEN_ADDRESS;
    if (!neoN3Token) {
        throw new Error('TOKEN_ADDRESS environment variable is required');
    }

    console.log(`Pausing token bridge for: ${neoN3Token}`);
    const result = await neoXBridge.pauseTokenBridge(neoN3Token);
    console.log(`Token bridge paused. Transaction: ${result.txHash}`);
}

async function unpauseTokenBridge(neoXBridge: NativeTokenBridge) {
    const neoN3Token = process.env.TOKEN_ADDRESS;
    if (!neoN3Token) {
        throw new Error('TOKEN_ADDRESS environment variable is required');
    }

    console.log(`Unpausing token bridge for: ${neoN3Token}`);
    const result = await neoXBridge.unpauseTokenBridge(neoN3Token);
    console.log(`Token bridge unpaused. Transaction: ${result.txHash}`);
}

async function setTokenDepositFee(neoXBridge: NativeTokenBridge) {
    const token = process.env.TOKEN_ADDRESS;
    const newFee = process.env.NEW_TOKEN_DEPOSIT_FEE;

    if (!token || !newFee) {
        throw new Error('TOKEN_ADDRESS and NEW_TOKEN_DEPOSIT_FEE environment variables are required');
    }

    const isToken = await neoXBridge.isRegisteredToken(token);
    console.log(`Is token ${token} registered: ${isToken}`);

    const newFeeValue = parseInt(newFee, 10);
    const newDepositFees = new Map<string, number>();
    newDepositFees.set(token, newFeeValue);

    console.log(`Setting token deposit fee for ${token}: ${newFeeValue}`);

    const result = await neoXBridge.setTokenDepositFee(newDepositFees);
    console.log(`Token deposit fee updated. Transaction: ${result.txHash}`);
}

async function setMinTokenDeposit(neoXBridge: NativeTokenBridge) {
    const token = process.env.TOKEN_ADDRESS;
    const newMinDeposit = process.env.NEW_MIN_TOKEN_DEPOSIT;

    if (!token || !newMinDeposit) {
        throw new Error('TOKEN_ADDRESS and NEW_MIN_TOKEN_DEPOSIT environment variables are required');
    }

    const newMinDepositValue = parseInt(newMinDeposit, 10);
    const newMinDeposits = new Map<string, number>();
    newMinDeposits.set(token, newMinDepositValue);

    console.log(`Setting minimum token deposit for ${token}: ${newMinDepositValue}`);

    const result = await neoXBridge.setMinTokenDeposit(newMinDeposits);
    console.log(`Minimum token deposit updated. Transaction: ${result.txHash}`);
}

async function setMaxTokenDeposit(neoXBridge: NativeTokenBridge) {
    const token = process.env.TOKEN_ADDRESS;
    const newMaxDeposit = process.env.NEW_MAX_TOKEN_DEPOSIT;

    if (!token || !newMaxDeposit) {
        throw new Error('TOKEN_ADDRESS and NEW_MAX_TOKEN_DEPOSIT environment variables are required');
    }

    const newMaxDepositValue = parseInt(newMaxDeposit, 10);
    const newMaxDeposits = new Map<string, number>();
    newMaxDeposits.set(token, newMaxDepositValue);

    console.log(`Setting maximum token deposit for ${token}: ${newMaxDepositValue}`);

    const result = await neoXBridge.setMaxTokenDeposit(newMaxDeposits);
    console.log(`Maximum token deposit updated. Transaction: ${result.txHash}`);
}

async function setMaxTokenWithdrawals(neoXBridge: NativeTokenBridge) {
    const token = process.env.TOKEN_ADDRESS;
    const newMaxWithdrawals = process.env.NEW_MAX_TOKEN_WITHDRAWALS;

    if (!token || !newMaxWithdrawals) {
        throw new Error('TOKEN_ADDRESS and NEW_MAX_TOKEN_WITHDRAWALS environment variables are required');
    }

    const newMaxWithdrawalsValue = parseInt(newMaxWithdrawals, 10);
    const newMaxWithdrawalsMap = new Map<string, number>();
    newMaxWithdrawalsMap.set(token, newMaxWithdrawalsValue);

    console.log(`Setting maximum token withdrawals for ${token}: ${newMaxWithdrawalsValue}`);

    const result = await neoXBridge.setMaxTokenWithdrawals(newMaxWithdrawalsMap);
    console.log(`Maximum token withdrawals updated. Transaction: ${result.txHash}`);
}

(async () => {
    ensureEnv();
    const neoXBridge = await createNativeTokenBridgeFromEnvironment();
    await tokenBridgeOperations(neoXBridge);
})();
