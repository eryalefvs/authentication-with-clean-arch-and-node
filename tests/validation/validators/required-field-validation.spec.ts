import { MissingParamError } from "@/presentation/errors/missing-param-error"
import { RequireFieldValidation } from "../../../src/validation/validators"

const field = ""

describe("RequiredField Validation", () => {
    test("Should return MissingParamError if validation fails", () => {
        const sut = new RequireFieldValidation(field)
        const error = sut.validate({ invalidField: "wrong_field" })
        expect(error).toEqual(new MissingParamError(field))
    })

    test("Should not return if validation success", () => {
        const sut = new RequireFieldValidation(field)
        const validation = sut.validate({ [field]: "field" })
        expect(validation).toBeFalsy()
    })
})