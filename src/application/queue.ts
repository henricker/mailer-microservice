import queues from "./jobs/queue";

(async () => {
  console.log('Running server to proccessing queues!')
  await queues.process()
})()