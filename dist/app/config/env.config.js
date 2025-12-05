import dotenv from 'dotenv';
dotenv.config();
const loadEnvVariables = () => {
    const requiredEnvVars = ['PORT', 'DATABASE_URL', 'JWT_ACCESS_SECRET', 'NODE_ENV', 'SALT_ROUND', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL'];
    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Env Variable ${key} is missing on .env file.`);
        }
    });
    return {
        PORT: process.env.port,
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        SALT_ROUND: process.env.SALT_ROUND,
        CLIENT_URL: process.env.SALT_ROUND,
        JWT: {
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        },
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        }
    };
};
export const envVars = loadEnvVariables();
//# sourceMappingURL=env.config.js.map