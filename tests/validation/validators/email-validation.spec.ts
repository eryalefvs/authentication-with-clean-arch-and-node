import { EmailValidatorSpy } from "../mocks/mock-email-validator"
import { EmailValidation } from "../../../src/validation/validators/email-validation"
import { InvalidParamError } from "@/presentation/errors/invalid-param-error"

import { faker } from "@faker-js/faker"
import { throwError } from "@/tests/domain/mocks/test-helpers"

const field = faker.word.sample()

type SutTypes = {
    sut: EmailValidation,
    emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
    const emailValidatorSpy = new EmailValidatorSpy()
    const sut = new EmailValidation(field, emailValidatorSpy)
    return { sut, emailValidatorSpy }
}

describe("Email Validation", () => {
    test("Should return an error if EmailValidatior returns false", () => {
        const { sut, emailValidatorSpy } = makeSut()
        emailValidatorSpy.isEmailValid = false
        const email = faker.internet.email()
        const error = sut.validate({ [field]: email })
        expect(error).toEqual(new InvalidParamError(field))
    })

    test("Should call EmailValidator with correct email", () => {
        const { sut, emailValidatorSpy } = makeSut()
        const email = faker.internet.email()
        sut.validate({ [field]: email})
        expect(emailValidatorSpy.email).toBe(email)
    })

    test("Should throw if EmailValidator throws", () => {
        const { sut, emailValidatorSpy } = makeSut()
        jest.spyOn(emailValidatorSpy, "isValid").mockImplementationOnce(throwError)
        expect(sut.validate).toThrow()
    })
})