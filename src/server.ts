import { app } from "./app.js"
import { envVars } from "./app/config/env.config.js"

const startServer = async () => {
    try {
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server is listening to port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log('Error while database connection.', error)
    }
}

(async () => {
    await startServer()
})()