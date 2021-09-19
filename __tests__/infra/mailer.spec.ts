import nodemailer, { createTestAccount, createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import BaseMailer from "../../src/infra/mailer/base-mailer"

interface IPayloadTesting {
  name: string,
  email: string,
}

class MailerTesting extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadTesting) {
    super(authConfig)
  }
  public async prepare(transporter: nodemailer.Transporter<any>): Promise<void> {
    await transporter.sendMail({
      from: 'Business <business@email.com>',
      to: this.payload.email,
      subject: 'Random mailer',
      html: `Welcome ${this.payload.name}`
    })
  }
}

describe('#Any email that inherits from BaseMailer', () => {

  afterEach(() => {
    jest.restoreAllMocks()
  })

  let accountTesting: nodemailer.TestAccount
  let transporter: nodemailer.Transporter<any>
  
  beforeAll(async () => {
    accountTesting = await createTestAccount()
    transporter = createTransport({
      auth: {
        user: accountTesting.user,
        pass: accountTesting.pass,
      }
    })

    jest.spyOn(nodemailer, 'createTransport').mockImplementation().mockReturnValue(transporter)
  })

  test('should call method sendMail of transport when send method is called', async () => {
    const payload: IPayloadTesting = {
      email: 'mailer@email.com',
      name: 'henricker',
    }

    const mailer = new MailerTesting({}, payload)
    
    jest.spyOn(transporter, 'sendMail').mockImplementation()
    await mailer.send()

    expect(transporter.sendMail).toBeCalledWith({
      from: "Business <business@email.com>", 
      html: "Welcome henricker", 
      subject: "Random mailer", 
      to: "mailer@email.com"
    })
  })
})
