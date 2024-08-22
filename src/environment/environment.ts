import { DevEnvironment } from "./environment.dev";
import { ProductEnvironment } from "./environment.prod";

export interface Environment {
    db_uri: string,
    jwt_secret_key: string,
    gmail_auth: {
        user: string,
        pass: string
    }
}

export function getEnvironmentVariable() {
    if (process.env.NODE_ENV == "production") {
        return ProductEnvironment;
    }
    return DevEnvironment;
}