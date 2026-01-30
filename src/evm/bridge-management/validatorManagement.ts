import { createBridgeManagementFromEnvironment, ensureEnv } from "../utils";

async function main() {
    const action = process.env.VALIDATOR_ACTION;

    const bridgeManagement = await createBridgeManagementFromEnvironment();

    switch (action) {
        case 'add': {
            const validator = process.env.VALIDATOR_ADDRESS;
            if (!validator) return console.error('Missing VALIDATOR_ADDRESS');
            const incrementThreshold = process.env.INCREMENT_THRESHOLD === 'true';
            console.log('Adding validator:', validator, 'increment threshold:', incrementThreshold);
            const tx = await bridgeManagement.addValidator(validator as `0x${string}`, incrementThreshold);
            console.log('Add validator transaction:', tx);
            break;
        }
        case 'remove': {
            const validator = process.env.VALIDATOR_ADDRESS;
            if (!validator) return console.error('Missing VALIDATOR_ADDRESS');
            const decrementThreshold = process.env.DECREMENT_THRESHOLD === 'true';
            console.log('Removing validator:', validator, 'decrement threshold:', decrementThreshold);
            const tx = await bridgeManagement.removeValidator(validator as `0x${string}`, decrementThreshold);
            console.log('Remove validator transaction:', tx);
            break;
        }
        case 'replace': {
            const oldValidator = process.env.OLD_VALIDATOR_ADDRESS;
            const newValidator = process.env.NEW_VALIDATOR_ADDRESS;
            if (!oldValidator || !newValidator) {
                return console.error('Missing OLD_VALIDATOR_ADDRESS or NEW_VALIDATOR_ADDRESS');
            }
            console.log('Replacing validator from:', oldValidator, 'to:', newValidator);
            const tx = await bridgeManagement.replaceValidator(oldValidator as `0x${string}`, newValidator as `0x${string}`);
            console.log('Replace validator transaction:', tx);
            break;
        }
        case 'set-threshold': {
            const threshold = Number(process.env.VALIDATOR_THRESHOLD);
            if (isNaN(threshold) || threshold < 1) {
                return console.error('Missing or invalid VALIDATOR_THRESHOLD (must be a positive number)');
            }
            console.log('Setting validator threshold to:', threshold);
            const tx = await bridgeManagement.setValidatorThreshold(BigInt(threshold));
            console.log('Set validator threshold transaction:', tx);
            break;
        }
        default:
            console.error('Unknown action:', action);
            console.log('Available actions: add, remove, replace, set-threshold');
    }
}

(async () => {
    try {
        ensureEnv();
        await main();
    } catch (error) {
        console.error('Error executing validator management:', error);
        process.exit(1);
    }
})();
