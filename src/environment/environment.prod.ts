import { Environment } from "./environment";

export const ProductEnvironment: Environment = {
    gmail_auth: {
        user: process.env.GMAIL_AUTH_USER_PROD,
        pass: process.env.GMAIL_AUTH_PASS_PROD
    },
    db_uri: process.env.DB_URI_PROD,
    jwt_secret_key: process.env.JWT_SECRET_KEY_PROD
}