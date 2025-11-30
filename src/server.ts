import { app } from "./app.js"
import { envVars } from "./app/config/env.config.js"

const startServer = async () => {
    try {
        app.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log('Error while database connection.', error)
    }
}

(async () => {
    await startServer()
})()