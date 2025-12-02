import { createManagementFromEnvironment, ensureEnv } from "../utils";

async function main() {
    const action = process.env.VALIDATOR_ACTION;

    const management = await createManagementFromEnvironment();

    switch (action) {
        case 'add': {
            const validator = process.env.VALIDATOR_PUBLIC_KEY;
            const increment = process.env.INCREMENT_THRESHOLD === 'true';
            if (!validator) return console.error('Missing VALIDATOR_PUBLIC_KEY');
            const result = await management.addValidator(validator, increment);
            console.log('Add validator result:', result);
            break;
        }
        case 'remove': {
            const validator = process.env.VALIDATOR_PUBLIC_KEY;
            const decrement = process.env.DECREMENT_THRESHOLD === 'true';
            if (!validator) return console.error('Missing VALIDATOR_PUBLIC_KEY');
            const result = await management.removeValidator(validator, decrement);
            console.log('Remove validator result:', result);
            break;
        }
        case 'replace': {
            const oldValidator = process.env.OLD_VALIDATOR_PUBLIC_KEY;
            const newValidator = process.env.NEW_VALIDATOR_PUBLIC_KEY;
            if (!oldValidator || !newValidator) return console.error('Missing OLD_VALIDATOR_PUBLIC_KEY or NEW_VALIDATOR_PUBLIC_KEY');
            const result = await management.replaceValidator(oldValidator, newValidator);
            console.log('Replace validator result:', result);
            break;
        }
        case 'set-threshold': {
            const threshold = Number(process.env.VALIDATOR_THRESHOLD);
            if (isNaN(threshold)) return console.error('Missing or invalid VALIDATOR_THRESHOLD');
            const result = await management.setValidatorThreshold(threshold);
            console.log('Set validator threshold result:', result);
            break;
        }
        default:
            console.error('Unknown action: ', action);
    }
}

(async () => {
    try {
        ensureEnv();
        await main();
    } catch (error) {
        console.error('Error executing validator management:', error);
    }
})();
