import cors from 'cors'
import express, { Express } from 'express'
import { routes } from './routes/routes'
import { authenticatedRoutes } from './routes/authenticated-routes'

export class App {
  application: Express

  constructor() {
    this.application = express()

    this.application.use(cors())
    this.application.use(routes)
    this.application.use(authenticatedRoutes)
  }
}
