import { mockAddAccountParams } from "@/tests/domain/mocks/mock-account"
import { DbAddAccount } from "../../../src/data/usecases/db-add-account"
import { HasherSpy } from "../mocks/mock-cryptography"
import { AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy } from "../mocks/mock-db-account"
import { throwError } from "@/tests/domain/mocks/test-helpers"

type SutTypes = {
    sut: DbAddAccount,
    hasherSpy: HasherSpy,
    addAccountRepositorySpy: AddAccountRepositorySpy,
    checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
    const hasherSpy = new HasherSpy()
    const addAccountRepositorySpy = new AddAccountRepositorySpy()
    const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
    const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy)
    return {
        sut,
        hasherSpy,
        addAccountRepositorySpy,
        checkAccountByEmailRepositorySpy
    } 
}

describe("DbAddAccount UseCase", () => {
    test("Should call Hasher with correct plainText", async () => {
        const { sut, hasherSpy } = makeSut()
        const addAccountParams = mockAddAccountParams()
        await sut.add(addAccountParams)
        expect(hasherSpy.plainText).toEqual(addAccountParams.password)
    })
    
    test("Should throw if Hasher throws", async () => {
        const { sut, hasherSpy } = makeSut()
        jest.spyOn(hasherSpy, "hash").mockImplementationOnce(throwError)
        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow()
    })

    test("Should call addAccountRepository with correct values", async () => {
        const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
        const addAccountParams = mockAddAccountParams()
        await sut.add(addAccountParams)
        expect(addAccountRepositorySpy.params).toEqual({
            name: addAccountParams.name,
            email: addAccountParams.email,
            password: hasherSpy.result
        })
    })

    test("Should throw if addAccountRepository throws", async () => {
        const { sut, addAccountRepositorySpy} = makeSut()
        jest.spyOn(addAccountRepositorySpy, "add").mockImplementationOnce(throwError)
        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow()
    })

    test("return true on success", async () => {
        const { sut } = makeSut()
        const isValid = await sut.add(mockAddAccountParams())
        expect(isValid).toBe(true)
    })

    test("Should return false if addAccountRepository return false", async () => {
        const { sut, addAccountRepositorySpy } = makeSut()
        addAccountRepositorySpy.result = false
        const isValid = await sut.add(mockAddAccountParams())
        expect(isValid).toBe(false)
    })

    test("Should return false if CheckAccountbyEmailRepository return true", async () => {
        const { sut, checkAccountByEmailRepositorySpy } = makeSut()
        checkAccountByEmailRepositorySpy.result = true
        const isValid = await sut.add(mockAddAccountParams())
        expect(isValid).toBe(false)
    })

    test("Should call checkAccountByEmailRepository with correct email", async () => {
        const { sut, checkAccountByEmailRepositorySpy } = makeSut()
        const account = mockAddAccountParams()
        await sut.add(account)
        expect(checkAccountByEmailRepositorySpy.email).toBe(account.email)
    })
})