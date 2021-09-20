const supertest = require('supertest')
import app from "../../../../src/application/api/app"
import HandlebarsCompilerService from "../../../../src/infra/handlebars/handlebars"
import nodemailer, {createTestAccount, createTransport, TestAccount, Transporter} from 'nodemailer'
import Bull from "bull"
import queues from "../../../../src/application/jobs/queue"
describe('#Api', () => {
  let accountTesting: TestAccount
  let transporter: Transporter<any>
  
  beforeAll(async () => {
    accountTesting = await createTestAccount()
    transporter = createTransport({
      auth: {
        user: accountTesting.user,
        pass: accountTesting.pass,
      }
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
  test('should return error when not provide payload', async () => {
    const response = await supertest(app).post('/send-mail')
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toEqual([{ message: 'invalid payload' }])
  })
  test('should return error when template not found', async () => {
    const response = await supertest(app).post('/send-mail').send({
      payload: {
        template: 'anything-template'
      }
    })
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toEqual([{ message: 'template not found' }])
  })
  test('should return error when contact not found', async () => {
    const response = await supertest(app).post('/send-mail').send({
      payload: {
        template: 'welcome-user'
      }
    })
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toEqual([{ message: 'invalid contact' }])
  })
  test('should send mailer when all is fine', async () => {
    jest.spyOn(HandlebarsCompilerService.prototype as any, 'compile').mockImplementation()
    jest.spyOn(Bull.prototype as any, 'add').mockImplementation()
    jest.spyOn(Bull.prototype as any, 'process').mockImplementation(async (handle) => {
      if(typeof handle === 'function')
        await handle({ data: { payload: { contact: { name: 'henricker', email: 'mailer@email.com' }, template: 'welcome-user' } } })
    })
    jest.spyOn(transporter, 'sendMail').mockImplementation(jest.fn())
    jest.spyOn(nodemailer, 'createTransport').mockImplementation().mockReturnValue(transporter)

    const response = await supertest(app).post('/send-mail').send({
      payload: {
        template: 'welcome-user',
        contact: {
          name: 'henricker',
          email: 'henricker@email.com'
        }
      }
    })

    await queues.process()

    expect(response.status).toBe(200)
    expect(transporter.sendMail).toBeCalledWith({from: "TGL BETS 🍀 <tgl@suport.com>", html: undefined, subject: "Welcome to TGL BETS!", to: "mailer@email.com"})
  })
})