import * as dotenv from 'dotenv';

dotenv.config()

export default {
    PORT: process.env.PORT || 8080,
    MONGO_URI: process.env.MONGO_URI,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    PERSISTENCE: process.env.PERSISTENCE
}
