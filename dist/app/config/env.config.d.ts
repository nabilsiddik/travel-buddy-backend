interface EnvConfig {
    PORT: string;
    NODE_ENV: string;
    DATABASE_URL: string;
    SALT_ROUND: string;
    CLIENT_URL: string;
    JWT: {
        JWT_ACCESS_SECRET: string;
        JWT_REFRESH_SECRET: string;
    };
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    };
}
export declare const envVars: EnvConfig;
export {};
//# sourceMappingURL=env.config.d.ts.map