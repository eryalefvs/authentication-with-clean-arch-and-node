import request from "supertest"
import { setupApp } from "../../../src/main/config/app"
import { Express } from "express"
import { MongoHelper } from "@/infra/db/mongodb/mongo-helper"
import { Collection } from "mongodb"

let app: Express
let accountCollection: Collection
    
describe("Login Routes", () => {
    beforeAll(async () => {
        app = await setupApp()
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    describe("POST /signup", () => {
        test("Should return 200 on signup", async () => {
            await request(app)
            .post("/api/signup")
            .send({
                name: "eryálef",
                email: "ery@gmail.com",
                password: "123",
                passwordConfirmation: "123"
            })
            .expect(200)

            await request(app)
            .post("/api/signup")
            .send({
                name: "eryálef",
                email: "ery@gmail.com",
                password: "123",
                passwordConfirmation: "123"
            })
            .expect(403)
        })
    })
})