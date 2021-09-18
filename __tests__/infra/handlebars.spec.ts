import { Dirent } from 'fs'
import fs from 'fs/promises'
import HandlebarsCompilerService from "../../src/infra/handlebars/handlebars"

describe('#HandlebarsCompilerService', () => {
  describe('#getPartialsFilename', () => {
    
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should be return partial when has parsed templateSource', async () => {
      const templateTesting = `
        <div>
          {{> text }}
        <div>
        {{> button }}
      `
      const hbs = new HandlebarsCompilerService('templateTesting')
      const partials = await hbs['getPartialsFilename'](templateTesting)
      expect(partials).toEqual(['text', 'button'])
    })
    test('should be return undefined when templateSource not had partials', async () => {
      const templatetesting = `
        <div>
          <p>Hello world babe</p>
        <div>
      `
      const hbs = new HandlebarsCompilerService('templateTesting')
      const partials = await hbs['getPartialsFilename'](templatetesting)
      expect(partials).toEqual(undefined)
    })
  })
  describe('#getPartial', () => {
    
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('Should be return a array of partial containing one partial when parsed a partial name', async () => {
  
      const textPartial = `
        <p>{{value}}</p>
      `

      const hbs = new HandlebarsCompilerService('templateTesting')
      jest.spyOn(HandlebarsCompilerService.prototype as any, 'existsTemplate').mockReturnValue(true)
      jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from(textPartial))
      
      const partials: { name: string; template: HandlebarsTemplateDelegate<any> }[] = []

      await hbs['getPartial']('textPartial', partials)
      expect(partials).toHaveLength(1)
      expect(partials[0]).toHaveProperty('name')
      expect(partials[0]).toHaveProperty('template')
      expect(partials[0].name).toEqual('textPartial')
    })
    test('An array of partials must be returned when a first partial has subpartials.', async () => {
  
      const FirstPartial = `
        <div class="container">
          {{> secondPartial }}
        </div>
      `
      const secondPartial = `
        <a>
          {{> thirdPartial }}
        </a>
      `
      const thirdPartial = `
        <p>Hellow my babe!</p>
      `
    
      const hbs = new HandlebarsCompilerService('templateTesting')

      jest.spyOn(HandlebarsCompilerService.prototype as any, 'existsTemplate').mockReturnValue(true)
      jest.spyOn(fs, 'readFile')
        .mockResolvedValueOnce(Buffer.from(FirstPartial))
        .mockResolvedValueOnce(Buffer.from(secondPartial))
        .mockResolvedValueOnce(Buffer.from(thirdPartial))
    

      const partials: { name: string; template: HandlebarsTemplateDelegate<any> }[] = []

      await (hbs['getPartial']('firstPartial', partials))

      expect(partials).toHaveLength(3)
      expect(partials[0].name).toEqual('firstPartial')
      expect(partials[1].name).toEqual('secondPartial')
      expect(partials[2].name).toEqual('thirdPartial')
      expect(typeof partials[0].template).toBe('function')
      expect(typeof partials[1].template).toBe('function')
      expect(typeof partials[2].template).toBe('function') 
    })
    test('Should be return a error when partial not found', async () => {
  
      const textPartial = `
        <p>{{value}}</p>
      `

      try {
        const hbs = new HandlebarsCompilerService('templateTesting')
        const partials: { name: string; template: HandlebarsTemplateDelegate<any> }[] = []
        jest.spyOn(HandlebarsCompilerService.prototype as any, 'getPartial')
        await hbs['getPartial']('textPartial', partials)
      } catch(err) {
        const message = err instanceof Error ? err.message : ''
        expect(message).toBe('Partial textPartial not found')
      }
    })
  })
  describe('#existsTemplate', () => { 
    
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should return true when template exists', async () => {
      const dirent = new Dirent()
      dirent.name = 'partial.hbs'

      jest.spyOn(fs, 'readdir').mockImplementation().mockResolvedValue([dirent])
      jest.spyOn(HandlebarsCompilerService.prototype as any, 'existsTemplate')

      const hbs = new HandlebarsCompilerService('template.hbs')
      const solve = await hbs['existsTemplate']('partial', '')
      expect(solve).toBe(true)
    })
    test('should return false when template not found', async () => {
      jest.spyOn(fs, 'readdir').mockImplementation().mockResolvedValue([])
      jest.spyOn(HandlebarsCompilerService.prototype as any, 'existsTemplate')

      const hbs = new HandlebarsCompilerService('template.hbs')
      const solve = await hbs['existsTemplate']('partial', '')
      expect(solve).toBe(false)
    })
  })
  describe('#compileTemplate', () => {
    
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test.todo('should be return a template compiled by handlebars and partials name')
    test.todo('should be return a template compiled without partials')
    test.todo('should be return undefined to template and partials case template not exists')
  })
})