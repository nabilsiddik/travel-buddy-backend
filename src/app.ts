import express, { type Request, type Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { router } from './app/routes/index.js'
import { envVars } from './app/config/env.config.js'
import { notFound } from './app/middlewares/notFound.js'
import globalErrorHandler from './app/middlewares/globalErrorHandler.js'

export const app = express()

app.use(express.json())
app.use(cors({
    origin: [],
    credentials: true
}))
app.use(cookieParser())

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: `Server is running on port ${envVars.PORT}`
    })
})

app.use(notFound)
app.use(globalErrorHandler)