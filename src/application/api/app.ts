import express from 'express'
import routes from './routes'

class AppService {
  express: express.Express
  constructor() {
    this.express = express()
  }

  public routes() {
    this.express.use(routes)
    return this
  }

  public middlewares() {
    this.express.use(express.json())
    return this
  }
}

export default new AppService().middlewares().routes().express