import { colorResolver, handler as h, numberWithUnitRE, splitShorthand } from '@warp-ds/uno/utils';
import { toArray } from '@unocss/core'

function handleLineHeight(s, theme) {
  return theme.lineHeight?.[s] || h.bracket.cssvar.global.rem(s)
}

export default [
  [/^(?:color|c)-(.+)$/, colorResolver('color', 'text')],
  // auto detection and fallback to font-size if the content looks like a size
  [/^text-(.+)$/, colorResolver('color', 'text', css => !css.color?.toString().match(numberWithUnitRE))],
  [/^(?:text|color|c)-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ '--un-text-opacity': h.bracket.percent(opacity) })],
  [/^bg-(.+)$/, colorResolver('background-color', 'bg')],
  [/^bg-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ '--un-bg-opacity': h.bracket.percent(opacity) })],
  [/^font-(.+)$/, ([, d], { theme }) => ({ 'font-family': theme.fontFamily?.[d] || h.bracket.cssvar.global(d) })],
  [/^font-?([^-]+)$/, ([, s], { theme }) => ({ 'font-weight': theme.fontWeight?.[s] || h.global.number(s) })],
  [
    /^text-(.+)$/,
    ([, s = 'base'], { theme }) => {
      const [size, leading] = splitShorthand(s, 'length')
      const sizePairs = toArray(theme.fontSize?.[size])
      const lineHeight = leading ? handleLineHeight(leading, theme) : undefined

      if (sizePairs?.[0]) {
        const [fontSize, height] = sizePairs
        return {
          'font-size': fontSize,
          'line-height': lineHeight ?? height ?? '1',
        }
      }

      const fontSize = h.bracketOfLength.rem(size)
      if (lineHeight && fontSize) {
        return {
          'font-size': fontSize,
          'line-height': lineHeight,
        }
      }

      return { 'font-size': h.bracketOfLength.rem(s) }
    },
  ],
  [/^text-size-(.+)$/, ([, s], { theme }) => {
    const themed = toArray(theme.fontSize?.[s])
    const size = themed?.[0] ?? h.bracket.cssvar.global.rem(s)
    if (size != null) return { 'font-size': size }
  }],

  [/^shadow(?:-(.+))?$/, ([, d], { theme }) => ({
    '--un-shadow-inset': ' ',
    'box-shadow': theme.shadow?.[d || 'DEFAULT']
  })],
  ['shadow-inset', { '--un-shadow-inset': 'inset' }],
];
