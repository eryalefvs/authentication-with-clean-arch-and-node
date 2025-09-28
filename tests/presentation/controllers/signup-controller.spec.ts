import { SignUpController } from "../../../src/presentation/controllers/signup-controller";
import { AddAccountSpy, AuthenticationSpy } from "../mocks/mock-account";
import { ValidationSpy } from "../mocks/mock-validation";
import { badRequest, forbidden, ok, serverError } from "../../../src/presentation/helpers/http-helper";
import { MissingParamError } from "../../../src/presentation/errors/missing-param-error";
import { ServerError } from "../../../src/presentation/errors/server-error";
import { EmailInUseError } from "../../../src/presentation/errors/email-in-use-error";
import { throwError } from "@/tests/domain/mocks/test-helpers";

import { faker } from "@faker-js/faker";

const mockRequest = (): SignUpController.Request => {
    const password = faker.internet.password()
    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password
    }
}

type SutTypes = {
    sut: SignUpController
    addAccountSpy: AddAccountSpy
    validationSpy: ValidationSpy
    authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
    const authenticationSpy = new AuthenticationSpy()
    const addAccountSpy = new AddAccountSpy()
    const validationSpy = new ValidationSpy()
    const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)
    return {
        sut,
        addAccountSpy,
        validationSpy,
        authenticationSpy
    }
}

describe("SignUp Controller", () => {
    test("Should return 500 if AddAccount throws", async () => {
        const { sut, addAccountSpy } = makeSut()
        jest.spyOn(addAccountSpy, "add").mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test("Should call adadAccount with correct values", async () => {
        const { sut, addAccountSpy } = makeSut()
        const request = mockRequest()
        await sut.handle(request)
        expect(addAccountSpy.params).toEqual({
            name: request.name,
            email: request.email,
            password: request.password
        })
    })

    test("Should return 403 if addAccount returns false", async () => {
        const { sut, addAccountSpy } = makeSut()
        addAccountSpy.result = false
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(forbidden(new EmailInUseError))
    })

    test("Should return 200 if valid data is provided", async () => {
        const { sut, authenticationSpy } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok(authenticationSpy.result))
    })

    test("Should call Validation with correct value", async () => {
        const { sut, validationSpy } = makeSut()
        const request = mockRequest()
        await sut.handle(request)
        expect(validationSpy.input).toEqual(request)
    })

    test("Should return 400 if Valiation returns an error", async () => {
        const { sut, validationSpy } = makeSut()
        validationSpy.error = new MissingParamError(faker.internet.domainWord())
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badRequest(validationSpy.error))
    })

    test("Should call Authentication with correct values", async () => {
        const { sut, authenticationSpy } = makeSut()
        const request = mockRequest()
        await sut.handle(request)
        expect(authenticationSpy.params).toEqual({
            email: request.email,
            password: request.password
        })
    })

    test("Should return 500 if Authentication throws", async () => {
        const { sut, authenticationSpy } = makeSut()
        jest.spyOn(authenticationSpy, "auth").mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})