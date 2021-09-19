import handlebars, { partials, partials as partialsType} from 'handlebars'
import fs from 'fs/promises'
import { resolve } from 'path'

type handlebarsPartials = {
  name: string,
  template: HandlebarsTemplateDelegate<any>
}

export default class HandlebarsCompilerService {
  
  private partialsDirPath: string = resolve(__dirname, '..', '..', 'resources', 'views', 'partials')
  private templatesPath: string = resolve(__dirname, '..', '..', 'resources', 'views', 'mails')

  constructor(private templateName: string){}

  private async getTemplateCompiled(templateName: string) {
    const template = await this.existsTemplate(templateName, this.templatesPath)

    if(!template)
      throw new Error('template not found')
    
    const templateFilename = templateName + '.hbs'
    const { templateCompiled, partialsName } = await this.compileTemplate(this.templatesPath, templateFilename)

    const partialsCompiledsArray: handlebarsPartials[] = []
    
    if(partialsName)
      for await (let partial of partialsName)
        await this.getPartial(partial, partialsCompiledsArray)
      
    return {
      templateCompiled,
      partials: partialsName? partialsCompiledsArray : undefined
    }
  }

  private async getPartialsFilename(templateSource: string) {
    const partialsOnTemplate = templateSource.match(new RegExp(/{{#?>.+}}/g))
    const partialsName = partialsOnTemplate?.map(partial => partial.replace(/{{#?>/, '').replace('}}', '').trim())
    const partials = partialsName?.map((partialName) => partialName.split(' ')[0])
    return partials?.filter(partialName => partialName !== '@partial-block')
  }
  
  private async getPartial(partialName: string, partialsArray: handlebarsPartials[]) {
    const template = await this.existsTemplate(partialName, this.partialsDirPath)
 
    if(!template)
      throw new Error(`Partial ${partialName} not found`)

    const templateFilename = partialName + '.hbs'
    const { templateCompiled, partialsName } = await this.compileTemplate(this.partialsDirPath, templateFilename)
    templateCompiled ? partialsArray.push({name: partialName, template: templateCompiled}) : ''

    if(!partialsName)
      return
    
    for await (let partial of partialsName)
      await this.getPartial(partial, partialsArray)
  } 

  private async existsTemplate(templateName: string, templatesPath: string) {
    const templatesDirent = await fs.readdir(templatesPath, { withFileTypes: true })
    const templateDirent = templatesDirent.find((templateDirent) => templateDirent.name.replace('.hbs', '') === templateName)
    return templateDirent ? true : false
  }

  private async compileTemplate(path: string, templateFilename: string) {
    const templateSource = (await fs.readFile(resolve(path, templateFilename))).toString()
    const templateCompiled = handlebars.compile(templateSource)
    const partialsName = await this.getPartialsFilename(templateSource)
    return { 
      templateCompiled,
      partialsName
    }
  }
  
  public async compile(context: {}) {
    const {templateCompiled, partials} = await this.getTemplateCompiled(this.templateName)

    const partialsCompileds: typeof partialsType = {}
    partials?.forEach(partial => {
      partialsCompileds[partial.name] = partial.template
    })

    const html = templateCompiled(context, {
      partials: partials ? partialsCompileds : undefined
    })
    
    return html
  }
}