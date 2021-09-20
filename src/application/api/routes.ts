import { Router } from 'express'
import MailerController from './controllers/mailers-controller'

const routes = Router()

routes.get('/mailer-templates', new MailerController().showMailerTemplates)
routes.post('/send-mail', new MailerController().sendMail)
export default routes