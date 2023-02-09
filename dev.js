import { createGenerator } from '@unocss/core'
import { presetDocs } from './index.js'

const uno = createGenerator({ presets: [presetDocs()] })
const cliClasses = process.argv.slice(2)
const result = await uno.generate(cliClasses)
console.log(result.css)
