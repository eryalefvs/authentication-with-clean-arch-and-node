import request from "supertest"
import { setupApp } from "../../../src/main/config/app"
import { Express } from "express"

let app: Express
    
describe("SignUp Routes", () => {
    test("Should return an account on success", async () => {
        app = await setupApp()
        await request(app)
        .post("/api/signup")
        .send({ name: "eryálef" })
        .expect(200)
    })
})