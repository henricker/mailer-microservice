import nodemailer, { createTestAccount, createTransport } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { setTimeout } from "timers/promises"
import BaseMailer from "../../src/infra/mailer/base-mailer"


describe('#BaseMailer', () => {
  let accountTesting: nodemailer.TestAccount
  let transporter: nodemailer.Transporter<any>
  
  class MailerTesting extends BaseMailer {
    constructor(authConfig: SMTPTransport.Options) {
      super(authConfig)
    }
    public async prepare(transporter: nodemailer.Transporter<any>): Promise<void> {
      await setTimeout(300)
    }
  }

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

  describe('#Send', () => {
    test('should call method prepare when send method is called', async () => {
      const mailer = new MailerTesting({})
      jest.spyOn(mailer, 'send')
      jest.spyOn(mailer, 'prepare')
      await mailer.send()
  
      expect(mailer.send).toHaveBeenCalled()
      expect(mailer.prepare).toHaveBeenCalledWith(transporter)
    })
  })
})