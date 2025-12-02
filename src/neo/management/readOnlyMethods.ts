import { createManagementFromEnvironment, ensureEnv } from "../utils";

async function main() {
    const management = await createManagementFromEnvironment();

    console.log('Owner:', await management.owner());
    console.log('Relayer:', await management.relayer());
    console.log('Governor:', await management.governor());
    console.log('Security Guard:', await management.securityGuard());
    console.log('Validator Threshold:', await management.validatorThreshold());
    const validators = await management.validators();
    console.log('Validators:', validators);
    for (const validator of validators) {
        console.log(`- Is ${validator} a validator?: `, await management.isValidator(validator));
    }

    // Check if a specific address is a validator (example)
    const validatorToCheck = process.env.VALIDATOR_ADDRESS;
    if (validatorToCheck) {
        console.log(`Is ${validatorToCheck} a validator?`, await management.isValidator(validatorToCheck));
    }
}

(async () => {
    try {
        ensureEnv();
        await main();
    } catch (error) {
        console.error('Error executing validator management script:', error);
    }
})();
