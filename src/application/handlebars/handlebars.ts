import handlebars, { partials as partialsType} from 'handlebars'
import fs from 'fs/promises'
import { resolve } from 'path'
import nodemailer from 'nodemailer'

type handlebarsPartials = {
  name: string,
  template: HandlebarsTemplateDelegate<any>
}

export default class HandlebarsCompilerService {
  private partialsDirPath: string = resolve(__dirname, '..', 'resources', 'views', 'partials')
  private templatesPath: string = resolve(__dirname, '..', 'resources', 'views', 'mails')
  constructor(private templateName: string){}

  private async getTemplateCompiled(templateName: string) {
    const template = (await fs.readdir(this.templatesPath)).find(template => template.replace('.hbs', '') === templateName)
    if(!template)
      throw new Error('template not found')
    
    const templateSource = (await fs.readFile(resolve(this.templatesPath, template))).toString()
    const partialsName = await this.getPartialsFilename(templateSource)
    const partialsCompiledsArray: handlebarsPartials[] = []
    if(partialsName)
      for await (let partial of partialsName)
        await this.getPartial(partial, partialsCompiledsArray)
      

    return {
      templateCompiled: handlebars.compile(templateSource),
      partials: partialsName? partialsCompiledsArray : undefined
    }
  }

  
  private async getPartialsFilename(templateSource: string) {
    const partialsOnTemplate = templateSource.match(new RegExp(/{{> [a-z]+ }}/g))
    const partialsName = partialsOnTemplate?.map(partial => partial.replace('{{>', '').replace('}}', '').trim())
    return partialsName
  }
  
  public async getPartial(partialName: string, partialsArray: handlebarsPartials[]) {
    const template = (await fs.readdir(this.partialsDirPath)).find(template => template.replace('.hbs', '') === partialName)
    if(!template)
      throw new Error(`Partial ${partialName} not found`)
    
    const partialSource = (await fs.readFile(resolve(this.partialsDirPath, template))).toString()
    const partialCompiled = handlebars.compile(partialSource)
    partialCompiled ? partialsArray.push({name: partialName, template: partialCompiled}) : ''
    
    const subPartialsTemplate = await this.getPartialsFilename(partialSource)
    
    if(!subPartialsTemplate)
    return
    
    subPartialsTemplate.forEach(async (partialName) => await this.getPartial(partialName, partialsArray))
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