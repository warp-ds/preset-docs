import rules from './rules.js'
import * as theme from './theme.js'
import * as variants from './variants.js'

export const presetDocs = () => ({
  name: '@warp-ds/preset-docs',
  rules,
  theme,
  variants: [
    ...variants.variantColorsMediaOrClass({ dark: 'class' })
  ]
})
