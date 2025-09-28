import { BcryptAdapter } from "../../../src/infra/criptography/bcrypt-adapter";
import { throwError } from "../../domain/mocks/test-helpers";

import bcrypt from "bcrypt"

jest.mock("bcrypt", () => ({
    async hash (): Promise<string> {
        return "hash"
    },

    async compare (): Promise<boolean> {
        return true
    }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt)
}

describe("Bcrypt Adapter", () => {
    describe("hash", () => {
        test("Should call hash with correct values", async () => {
            const sut = makeSut()
            const hashSpy = jest.spyOn(bcrypt, "hash")
            await sut.hash("any_value")
            expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
        })

        test("Should return a valid hash on hash success", async () => {
            const sut = makeSut()
            const hash = await sut.hash("any_value")
            expect(hash).toBe("hash")
        })

        test("Should throw if hash throws", async () => {
            const sut = makeSut()
            jest.spyOn(bcrypt, "hash").mockImplementationOnce(throwError)
            const promise = sut.hash("any_value")
            await expect(promise).rejects.toThrow()
        })
    })

    describe("compare", () => {
        test("Should call compare with correct values", async () => {
            const sut = makeSut()
            const compareSpy = jest.spyOn(bcrypt, "compare")
            await sut.compare("any_value1", "any_value2")
            expect(compareSpy).toHaveBeenCalledWith("any_value1", "any_value2")
        })

        test("Should return true when compare succeeds", async () => {
            const sut = makeSut()
            const compare = await sut.compare("any_value1", "any_value2")
            expect(compare).toBe(true)
        })

        test("Shold return false when compare fails", async () => {
            const sut = makeSut()
            jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => false)
            const compare = await sut.compare("any_value1", "any_value2")
            expect(compare).toBe(false)
        })

        test("Should throw if compare throws", async () => {
            const sut = makeSut()
            jest.spyOn(bcrypt, "compare").mockImplementationOnce(throwError)
            const promise = sut.compare("any_value1", "any_value2")
            await expect(promise).rejects.toThrow()
        })
    })
})