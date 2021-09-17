import { QueueOptions} from 'bull'
import env from '../../../../env'

export const queueOptions: QueueOptions = {
  redis: {
    host: env.ENV_REDIS_HOST,
    port: Number(env.ENV_REDIS_PORT),
    password: env.ENV_REDIS_PASSWORD,
  }
}