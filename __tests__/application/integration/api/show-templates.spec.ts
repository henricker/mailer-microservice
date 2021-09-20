const supertest = require('supertest')
import app from "../../../../src/application/api/app"
describe('#Api', () => {
  test('should return all names of mail templates from application', async () => {
    const response = await supertest(app).get('/mailer-templates')
    expect(response.body).toHaveProperty('templates')
    expect(Array.isArray(response.body.templates)).toBe(true)
  })
})