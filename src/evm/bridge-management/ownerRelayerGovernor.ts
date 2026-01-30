import { createBridgeManagementFromEnvironment, ensureEnv } from "../utils";

async function main() {
    const action = process.env.MANAGEMENT_ACTION;

    const bridgeManagement = await createBridgeManagementFromEnvironment();

    switch (action) {
        case 'transfer-ownership': {
            const newOwner = process.env.NEW_OWNER;
            if (!newOwner) return console.error('Missing NEW_OWNER');
            console.log('Transferring ownership to:', newOwner);
            const tx = await bridgeManagement.transferOwnership(newOwner as `0x${string}`);
            console.log('Transfer ownership transaction:', tx);
            console.log('Note: The new owner must call accept-ownership to complete the transfer');
            break;
        }
        case 'accept-ownership': {
            console.log('Accepting ownership transfer...');
            const tx = await bridgeManagement.acceptOwnership();
            console.log('Accept ownership transaction:', tx);
            break;
        }
        case 'set-relayer': {
            const newRelayer = process.env.NEW_RELAYER;
            if (!newRelayer) return console.error('Missing NEW_RELAYER');
            console.log('Setting new relayer to:', newRelayer);
            const tx = await bridgeManagement.setRelayer(newRelayer as `0x${string}`);
            console.log('Set relayer transaction:', tx);
            break;
        }
        case 'set-governor': {
            const newGovernor = process.env.NEW_GOVERNOR;
            if (!newGovernor) return console.error('Missing NEW_GOVERNOR');
            console.log('Setting new governor to:', newGovernor);
            const tx = await bridgeManagement.setGovernor(newGovernor as `0x${string}`);
            console.log('Set governor transaction:', tx);
            break;
        }
        case 'set-security-guard': {
            const newSecurityGuard = process.env.NEW_SECURITY_GUARD;
            if (!newSecurityGuard) return console.error('Missing NEW_SECURITY_GUARD');
            console.log('Setting new security guard to:', newSecurityGuard);
            const tx = await bridgeManagement.setSecurityGuard(newSecurityGuard as `0x${string}`);
            console.log('Set security guard transaction:', tx);
            break;
        }
        default:
            console.error('Unknown action:', action);
            console.log('Available actions: transfer-ownership, accept-ownership, set-relayer, set-governor, set-security-guard');
    }
}

(async () => {
    try {
        ensureEnv();
        await main();
    } catch (error) {
        console.error('Error executing owner/relayer/governor management script:', error);
        process.exit(1);
    }
})();
