import env from "./config/env"
import { MongoHelper } from "../infra/db/mongodb/mongo-helper"

MongoHelper.connect(env.mongoUrl)
.then(async () => {
    const { setupApp } = await import("./config/app")
    const app = await setupApp()
    app.listen(5050, () => console.log("Server running at http://localhost:5050"))
})
.catch(console.log)