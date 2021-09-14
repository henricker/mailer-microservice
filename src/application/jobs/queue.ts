import QueuesBull from "../../infra/bull/queue";
import * as jobs from './index'

const queues = new QueuesBull(Object.values(jobs).map(job => new job()))
export default queues