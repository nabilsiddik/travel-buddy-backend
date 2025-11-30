import dotenv from 'dotenv'
dotenv.config()

interface EnvConfig {
    PORT: string,
    NODE_ENV: string,
    DATABASE_URL: string,
    SALT_ROUND: string,
    CLIENT_URL: string,
    JWT: {
        JWT_ACCESS_SECRET: string,
        JWT_REFRESH_SECRET: string
    }
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string,
        CLOUDINARY_API_KEY: string,
        CLOUDINARY_API_SECRET: string
    },
    OPEN_ROUTER_API_KEY: string,
    STRIPE: {
        STRIPE_SECRET_KEY: string
    }
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVars: string[] = ['PORT', 'DATABASE_URL', 'JWT_ACCESS_SECRET', 'NODE_ENV', 'SALT_ROUND', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'OPEN_ROUTER_API_KEY', 'STRIPE_SECRET_KEY', 'CLIENT_URL']

    requiredEnvVars.forEach((key: string) => {
        if (!process.env[key]) {
            throw new Error(`Env Variable ${key} is missing on .env file.`)
        }
    })

    return {
        PORT: process.env.port as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        NODE_ENV: process.env.NODE_ENV as string,
        SALT_ROUND: process.env.SALT_ROUND as string,
        CLIENT_URL: process.env.SALT_ROUND as string,
        JWT: {
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        },
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        },
        OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY as string,
        STRIPE: {
            STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string
        }
    }
}

export const envVars = loadEnvVariables()