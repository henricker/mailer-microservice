import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env') })
export default {
  ENV_REDIS_HOST: process.env.REDIS_HOST,
  ENV_REDIS_PORT: process.env.REDIS_PORT,
  ENV_REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  ENV_KAFKA_CLIEND_ID: process.env.KAFKA_CLIEND_ID,
  ENV_KAFKA_BROKER: process.env.KAFKA_BROKER,
  ENV_MAILER_HOST: process.env.MAILER_HOST,
  ENV_MAILER_SECURE: process.env.MAILER_SECURE,
  ENV_MAILER_PORT: process.env.MAILER_PORT,
  ENV_MAILER_AUTH_USER: process.env.MAILER_AUTH_USER,
  ENV_MAILER_AUTH_PASS: process.env.MAILER_AUTH_PASS,
}