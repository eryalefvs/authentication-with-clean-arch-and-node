import express, { Express } from "express"
import setupMiddlewares from "./middlewares-config"
import setupRoutes from "./routes-config"

export const setupApp = async (): Promise<Express> => {
    const app = express()
    setupMiddlewares(app)
    setupRoutes(app)
    return app   
}