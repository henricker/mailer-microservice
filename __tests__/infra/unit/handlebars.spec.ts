import { Dirent } from 'fs'
import fs from 'fs/promises'
import HandlebarsCompilerService from "../../../src/infra/handlebars/handlebars"

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
    test('should be return a template compiled by handlebars and partials name', async () => {
      const template = `
        {{#> container }}
          {{> text description="hello" }}
        {{/container}}
      `

      const hbs = new HandlebarsCompilerService('template')

      jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from(template))

      const { templateCompiled, partialsName } = await hbs['compileTemplate']('', '')
      
      expect(typeof templateCompiled).toBe('function')
      expect(partialsName).toStrictEqual(['container', 'text'])
    })
    test('should be return a template compiled without partials', async () => {
      const template = `
        <div>
          <p>hello baby</p>
        </div>
      `

      const hbs = new HandlebarsCompilerService('template')

      jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from(template))

      const { templateCompiled, partialsName } = await hbs['compileTemplate']('', '')
      
      expect(typeof templateCompiled).toBe('function')
      expect(partialsName).toStrictEqual(undefined)
    })
    test('should be return error when template not found', async () => {
      const hbs = new HandlebarsCompilerService('template')

      try {
        const { templateCompiled, partialsName } = await hbs['compileTemplate']('', '')
      } catch(err) {
        err instanceof Error ? expect(err).toBeInstanceOf(Error) : ''
      }
    })
  })
  describe('#getTemplateCompiled', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test('Must return the template with its partials', async () => {
      const template = `
        {{#> container }}
          {{> header }}
            <main>
              {{> text description="hello ma baby" }}
            </main>
          {{> footer }}
        {{/container}}
      `

      const containerPartial = `
        <div class="container">
          {{> @partial-block }}
        </div>
      `

      const headerPartial = `
        <header>
          <h2>Welcome to my heart</h2>
        </header>
      `

      const footerPartial = `
        <footer>
          <p>by henricker <3</p>
        </footer>
      `

      const textPartial = `
        <p>{{description}}</p>
      `

      const direntTemplate = new Dirent()
      direntTemplate.name = 'template'

      const direntContainerPartial = new Dirent()
      direntContainerPartial.name = 'container'

      const direntHeaderPartial = new Dirent()
      direntHeaderPartial.name = 'header'

      const direntTextPartial = new Dirent()
      direntTextPartial.name = 'text'

      const direntFooterPartial = new Dirent()
      direntFooterPartial.name = 'footer'

      const dirents = [direntTemplate, direntContainerPartial, direntHeaderPartial, direntTextPartial, direntFooterPartial]

      jest.spyOn(fs, 'readdir').mockResolvedValue(dirents)

      jest.spyOn(fs, 'readFile')
        .mockResolvedValueOnce(Buffer.from(template))
        .mockResolvedValueOnce(Buffer.from(containerPartial))
        .mockResolvedValueOnce(Buffer.from(headerPartial))
        .mockResolvedValueOnce(Buffer.from(textPartial))
        .mockResolvedValueOnce(Buffer.from(footerPartial))
 
      const hbs = new HandlebarsCompilerService('template')
      const { templateCompiled, partials } = await hbs['getTemplateCompiled']('template')
      const partialsName = ['container', 'header', 'text', 'footer']
      expect(typeof templateCompiled).toBe('function')
      expect(partials).toHaveLength(4)
      partials?.forEach((partial, index) => {
        expect(partial.name).toBe(partialsName[index])
        expect(typeof partial.template).toBe('function')
      })
    })
    test('Must return the model and undefined partials when the model has no partials', async () => {
      const template = `
        <div>
          <header>
            <p>random title</p>
          </header>  
          <main>
            <p>hello ma baby</p>
          </main>
          <footer>
            <p>ma footer bro</p>
          </footer>
        </div>
      `

      const direntTemplate = new Dirent()
      direntTemplate.name = 'template'

      const dirents = [direntTemplate]

      jest.spyOn(fs, 'readdir').mockResolvedValue(dirents)

      jest.spyOn(fs, 'readFile')
        .mockResolvedValueOnce(Buffer.from(template))

      const hbs = new HandlebarsCompilerService('template')
      const { templateCompiled, partials } = await hbs['getTemplateCompiled']('template')
      expect(typeof templateCompiled).toBe('function')
      expect(partials).toBe(undefined)
    })
    test('Must return error when template not exists', async () => {
      try {
        const hbs = new HandlebarsCompilerService('template')
        await hbs['getTemplateCompiled']('template')
      } catch(err) {
        err instanceof Error ? expect(err.message).toBe('template not found') : ''
      }
    })
  })
  describe('#compile', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test('should return hmtl compiled', async () => {
      const template = `
      {{#> container }}
        {{> header }}
        <main>
          {{> text description="hello ma baby" }}
        </main>
        {{> footer }}
      {{/container}}`

      const containerPartial = `<div class="container">{{> @partial-block }}</div>`

      const headerPartial = `<header><h2>Welcome to my heart</h2></header>`

      const footerPartial = `<footer><p>by henricker <3</p></footer>`

      const textPartial = `<p>{{description}}</p>`

      const direntTemplate = new Dirent()
      direntTemplate.name = 'template'

      const direntContainerPartial = new Dirent()
      direntContainerPartial.name = 'container'

      const direntHeaderPartial = new Dirent()
      direntHeaderPartial.name = 'header'

      const direntTextPartial = new Dirent()
      direntTextPartial.name = 'text'

      const direntFooterPartial = new Dirent()
      direntFooterPartial.name = 'footer'

      const dirents = [direntTemplate, direntContainerPartial, direntHeaderPartial, direntTextPartial, direntFooterPartial]

      jest.spyOn(fs, 'readdir').mockResolvedValue(dirents)

      jest.spyOn(fs, 'readFile')
        .mockResolvedValueOnce(Buffer.from(template))
        .mockResolvedValueOnce(Buffer.from(containerPartial))
        .mockResolvedValueOnce(Buffer.from(headerPartial))
        .mockResolvedValueOnce(Buffer.from(textPartial))
        .mockResolvedValueOnce(Buffer.from(footerPartial))
 
      const hbs = new HandlebarsCompilerService('template')
      const html = await hbs.compile({})

      expect(typeof html).toBe('string')
      expect(html.includes('<div class="container">')).toBe(true)
      expect(html.includes('<header><h2>Welcome to my heart</h2></header>')).toBe(true)
      expect(html.includes('<p>hello ma baby</p>')).toBe(true)
      expect(html.includes('<footer><p>by henricker <3</p></footer')).toBe(true)
    })
    test('should return error when template not exists on path of templates', async () => {
      try {
        const hbs = new HandlebarsCompilerService('template')
        await hbs.compile({})
      } catch(err) {
        err instanceof Error ? expect(err.message).toBe('template not found') : ''
      }
    })
  })
})