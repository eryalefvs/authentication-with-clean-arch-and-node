import { AccountMongoRepository } from "../../../../src/infra/db/mongodb/account-mongo-repository";
import { mockAddAccountParams } from "@/tests/domain/mocks/mock-account";
import { MongoHelper } from "../../../../src/infra/db/mongodb/mongo-helper";
import { Collection } from "mongodb";
import { faker } from "@faker-js/faker";

let accountCollection: Collection

describe("AccountMongoRepository", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })
    
    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    describe("add()", () => {
        test("Should return an account on success", async () => {
            const sut = new AccountMongoRepository()
            const account = mockAddAccountParams()
            const isValid = await sut.add(account)
            expect(isValid).toBe(true)
        })
    })

    describe("loadByEmail()", () => {
        test("Should return an account on success", async () => {
            const sut = new AccountMongoRepository()
            const AddAccountParams = mockAddAccountParams()
            await accountCollection.insertOne(AddAccountParams)
            const account = await sut.loadByEmail(AddAccountParams.email)
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe(AddAccountParams.name)
            expect(account.password).toBe(AddAccountParams.password)
        })

        test("return null if loadByEmail fails",  async () => {
            const sut = new AccountMongoRepository()
            const account = await sut.loadByEmail(faker.internet.email())
            expect(account).toBeFalsy()
        })
    })

    describe("checkByEmail()", () => {
        test("Should return true if email is valid", async () => {
            const sut = new AccountMongoRepository()
            const addAccountParams = mockAddAccountParams()
            await accountCollection.insertOne(addAccountParams)
            const exists = await sut.checkByEmail(addAccountParams.email)
            expect(exists).toBe(true)
        })

        test("Should return false if email is invalid", async () => {
            const sut = new AccountMongoRepository()
            const invalidEmail = await sut.checkByEmail(faker.internet.email())
            expect(invalidEmail).toBe(false)
        })
    })

    describe("updateAccesToken()", () => {
        test("Should update the account accesToken on success", async () => {
            const sut = new AccountMongoRepository()
            const res = await accountCollection.insertOne(mockAddAccountParams())
            const fakeAccount = await accountCollection.findOne({ _id: res.insertedId })
            expect(fakeAccount.accessToken).toBeFalsy()
            const accessToken = faker.string.uuid()
            await sut.updateAccessToken(fakeAccount._id.toHexString(), accessToken)
            const account = await accountCollection.findOne({ _id: fakeAccount._id })
            expect(account).toBeTruthy()
            expect(account.accessToken).toBe(accessToken)
        })
    })

    describe("loadByToken()", () => {
        let accessToken = faker.string.uuid()

        beforeEach(() => {
            accessToken = faker.string.uuid()
    })

        test("Should return an account on loadByToken without role", async () => {
            const sut = new AccountMongoRepository()
            const addAccountParams = mockAddAccountParams()
            await accountCollection.insertOne({addAccountParams, accessToken})
            const account = await sut.loadByToken(accessToken)
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
        })

        test("Should return an account on loadByToken with admin role", async () => {
            const sut = new AccountMongoRepository()
            const addAccountParams = mockAddAccountParams()
            await accountCollection.insertOne({addAccountParams, accessToken, role: "admin"})
            const account = await sut.loadByToken(accessToken, "admin")
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
        })

        test("Should return null on loadBytoken with invalid role", async () => {
            const sut = new AccountMongoRepository()
            const addAccountParams = mockAddAccountParams()
            await accountCollection.insertOne({ addAccountParams, accessToken})
            const account = await sut.loadByToken(accessToken, "admin")
            expect(account).toBeFalsy()
        })

        test("Should return an account on loadByToken with if user is admin", async () => {
            const sut = new AccountMongoRepository()
            const addAccountParams = mockAddAccountParams()
            await accountCollection.insertOne({ addAccountParams, accessToken, role: "admin"})
            const account = await sut.loadByToken(accessToken)
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
        })

        test("Should return null if loadByToken fails", async () => {
            const sut = new AccountMongoRepository()
            const account = await sut.loadByToken(accessToken)
            expect(account).toBe(null)
        })
    })
})