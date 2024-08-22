import { Environment } from "./environment";
import * as env from 'dotenv';

env.config();

export const DevEnvironment: Environment = {
    gmail_auth: {
        user: process.env.GMAIL_AUTH_USER_DEV,
        pass: process.env.GMAIL_AUTH_PASS_DEV
    },
    db_uri: process.env.DB_URI_DEV,
    jwt_secret_key: process.env.JWT_SECRET_KEY_DEV
}