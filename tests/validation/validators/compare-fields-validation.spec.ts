import { CompareFieldsValidation } from "../../../src/validation/validators"
import { InvalidParamError } from "./../../../src//presentation/errors/invalid-param-error"

const field = ""
const fieldToCompare = "field_to_compare"

describe("Compare Fields Validation", () => {
    test("Should return InvalidParamError if validation fails", () => {
        const sut = new CompareFieldsValidation(field, fieldToCompare)
        const error = sut.validate({
            [field]: "any_field",
            [fieldToCompare]: "other_field"
        })
        expect(error).toEqual(new InvalidParamError(fieldToCompare))
    })

    test("Should not return if validation success", () => {
        const sut = new CompareFieldsValidation(field, fieldToCompare)
        const value = "same_word"
        const validation = sut.validate({
            [field]: value,
            [fieldToCompare]: value
        })
        expect(validation).toBeFalsy()
    })
})