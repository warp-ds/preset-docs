import { colorResolver, handler as h, numberWithUnitRE } from '@warp-ds/uno/utils';

export default [
  [/^(?:color|c)-(.+)$/, colorResolver('color', 'text'), { autocomplete: '(text|color|c)-$colors' }],
  // auto detection and fallback to font-size if the content looks like a size
  [/^text-(.+)$/, colorResolver('color', 'text', css => !css.color?.toString().match(numberWithUnitRE)), { autocomplete: '(text|color|c)-$colors' }],
  [/^(?:text|color|c)-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ '--un-text-opacity': h.bracket.percent(opacity) }), { autocomplete: '(text|color|c)-(op|opacity)-<percent>' }],
  [/^bg-(.+)$/, colorResolver('background-color', 'bg'), { autocomplete: 'bg-$colors' }],
  [/^bg-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ '--un-bg-opacity': h.bracket.percent(opacity) }), { autocomplete: 'bg-(op|opacity)-<percent>' }],
];
