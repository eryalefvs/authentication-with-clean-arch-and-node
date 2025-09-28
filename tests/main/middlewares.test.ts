import request from "supertest"
import { Express } from "express"
import { setupApp } from "../../src/main/config/app"
import { noCache } from "../../src/main/middlewares"

let app: Express

describe("Middlewares", () => {
    beforeAll(async () => {
        app = await setupApp()
    })
    
    describe("Body Parser Middleware", () => {
        test("Should parse body as json", async () => {
            app.post("/test_body_parser", (req, res) => {
                res.send(req.body)
            })
            
            await request(app)
            .post("/test_body_parser")
            .send({ name: "eryálef" })
            .expect({ name: "eryálef" })
        })
    })

    describe("Content Type Middleware", () => {
        test("Should return default content type as json", async () => {
            app.get("/test_content_type", (req, res) => {
                res.send("")
            })
            await request(app)
            .get("/test_content_type")
            .expect("content-type", /json/)
        })

        test("Should return xml content type when forced", async () => {
            app.get("/test_content_type_xml", (req, res) => {
                res.type("xml")
                res.send("")
            })
            await request(app)
            .get("/test_content_type_xml")
            .expect("content-type", /xml/)
        })
    })
    describe("CORS Middleware", () => {
        test("Should enavle CORS", async () => {
            app.get("/test_cors", (req, res) => {
                res.send("")
            })
            await request(app)
            .get("/test_cors")
            .expect("access-control-allow-origin", "*")
            .expect("access-control-allow-methods", "*")
            .expect("access-control-allow-headers", "*")
        })
    })

    describe("NoCache Middleware", () => {
        test("Should disable cache", async () => {
            app.get("/test_no_cache", noCache, (req, res) => {
                res.send()
            })
            await request(app)
            .get("/test_no_cache")
            .expect("cache-control", "no-store, no-cache, must-revalidate, proxy-revalidate")
            .expect("pragma", "no-cache")
            .expect("expires", "0")
            .expect("surrogate-control", "no-store")
        })
    })
})