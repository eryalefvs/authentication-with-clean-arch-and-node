import { EmailValidatorAdapter } from "../../infra/validators/email-validator-adapter"
import { Validation } from "../../presentation/protocols/validation"
import { ValidationComposite, RequireFieldValidation, CompareFieldsValidation } from "../../validation/validators"
import { EmailValidation } from "../../validation/validators/email-validation"

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for(const field of ["name", "email", "password", "passwordConfirmation"]) {
        validations.push(new RequireFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation("password", "passwordConfirmation"))
    validations.push(new EmailValidation("email", new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}