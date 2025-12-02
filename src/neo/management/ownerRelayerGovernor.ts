import { createManagementFromEnv, ensureEnv } from "../utils";

async function main() {
    const action = process.env.MANAGEMENT_ACTION;

    const management = await createManagementFromEnv();

    switch (action) {
        case 'set-owner': {
            const newOwner = process.env.NEW_OWNER;
            if (!newOwner) return console.error('Missing NEW_OWNER');
            const result = await management.setOwner(newOwner);
            console.log('Set owner result:', result);
            break;
        }
        case 'set-relayer': {
            const newRelayer = process.env.NEW_RELAYER;
            if (!newRelayer) return console.error('Missing NEW_RELAYER');
            const result = await management.setRelayer(newRelayer);
            console.log('Set relayer result:', result);
            break;
        }
        case 'set-governor': {
            const newGovernor = process.env.NEW_GOVERNOR;
            if (!newGovernor) return console.error('Missing NEW_GOVERNOR');
            const result = await management.setGovernor(newGovernor);
            console.log('Set governor result:', result);
            break;
        }
        case 'set-security-guard': {
            const newSecurityGuard = process.env.NEW_SECURITY_GUARD;
            if (!newSecurityGuard) return console.error('Missing NEW_SECURITY_GUARD');
            const result = await management.setSecurityGuard(newSecurityGuard);
            console.log('Set security guard result:', result);
            break;
        }
        default:
            console.error('Unknown action:', action);
    }
}

(async () => {
    try {
        ensureEnv();
        await main();
    } catch (error) {
        console.error('Error executing owner/relayer/governor management script:', error);
    }
})();
