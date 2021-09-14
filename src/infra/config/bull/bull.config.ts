import { QueueOptions} from 'bull'

export const queueOptions: QueueOptions = {
  redis: {
    host: 'localhost',
    port: 6379,
    password: ''
  }
}