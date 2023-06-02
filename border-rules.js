import { colorOpacityToString, colorToString, cornerMap, directionMap, globalKeywords, handler as h, hasParseableColor, parseColor } from '@warp-ds/uno/utils';

export const borderStyles = ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none', 'groove', 'ridge', 'inset', 'outset', ...globalKeywords];
export const borders = [
    // compound
    [/^pd-(?:border|b)()(?:-(.+))?$/, handlerBorder, { autocomplete: '(border|b)-<directions>' }],
    [/^pd-(?:border|b)-([xy])(?:-(.+))?$/, handlerBorder],
    [/^pd-(?:border|b)-([rltbse])(?:-(.+))?$/, handlerBorder],
    [/^pd-(?:border|b)-(block|inline)(?:-(.+))?$/, handlerBorder],
    [/^pd-(?:border|b)-([bi][se])(?:-(.+))?$/, handlerBorder],
    // size
    [/^pd-(?:border|b)-()(?:width|size)-(.+)$/, handlerBorderSize, { autocomplete: ['(border|b)-<num>', '(border|b)-<directions>-<num>'] }],
    [/^pd-(?:border|b)-([xy])-(?:width|size)-(.+)$/, handlerBorderSize],
    [/^pd-(?:border|b)-([rltbse])-(?:width|size)-(.+)$/, handlerBorderSize],
    [/^pd-(?:border|b)-(block|inline)-(?:width|size)-(.+)$/, handlerBorderSize],
    [/^pd-(?:border|b)-([bi][se])-(?:width|size)-(.+)$/, handlerBorderSize],
    // colors
    [/^pd-(?:border|b)-()(?:color-)?(.+)$/, handlerBorderColor, { autocomplete: ['(border|b)-$colors', '(border|b)-<directions>-$colors'] }],
    [/^pd-(?:border|b)-([xy])-(?:color-)?(.+)$/, handlerBorderColor],
    [/^pd-(?:border|b)-([rltbse])-(?:color-)?(.+)$/, handlerBorderColor],
    [/^pd-(?:border|b)-(block|inline)-(?:color-)?(.+)$/, handlerBorderColor],
    [/^pd-(?:border|b)-([bi][se])-(?:color-)?(.+)$/, handlerBorderColor],
    // opacity
    [/^pd-(?:border|b)-()op(?:acity)?-?(.+)$/, handlerBorderOpacity, { autocomplete: '(border|b)-(op|opacity)-<percent>' }],
    [/^pd-(?:border|b)-([xy])-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
    [/^pd-(?:border|b)-([rltbse])-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
    [/^pd-(?:border|b)-(block|inline)-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
    [/^pd-(?:border|b)-([bi][se])-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
    // radius
    [/^pd-(?:border-|b-)?(?:rounded|rd)()(?:-(.+))?$/, handlerRounded, { autocomplete: ['(border|b)-(rounded|rd)', '(border|b)-(rounded|rd)-<num>', '(rounded|rd)', '(rounded|rd)-<num>'] }],
    [/^pd-(?:border-|b-)?(?:rounded|rd)-([rltb])(?:-(.+))?$/, handlerRounded],
    [/^pd-(?:border-|b-)?(?:rounded|rd)-([rltb]{2})(?:-(.+))?$/, handlerRounded],
    [/^pd-(?:border-|b-)?(?:rounded|rd)-([bi][se])(?:-(.+))?$/, handlerRounded],
    [/^pd-(?:border-|b-)?(?:rounded|rd)-([bi][se]-[bi][se])(?:-(.+))?$/, handlerRounded],
    // style
    [/^pd-(?:border|b)-(?:style-)?()(.+)$/, handlerBorderStyle, { autocomplete: ['(border|b)-style', `(border|b)-(${borderStyles.join('|')})`, '(border|b)-<directions>-style', `(border|b)-<directions>-(${borderStyles.join('|')})`, `(border|b)-<directions>-style-(${borderStyles.join('|')})`, `(border|b)-style-(${borderStyles.join('|')})`] }],
    [/^pd-(?:border|b)-([xy])-(?:style-)?(.+)$/, handlerBorderStyle],
    [/^pd-(?:border|b)-([rltbse])-(?:style-)?(.+)$/, handlerBorderStyle],
    [/^pd-(?:border|b)-(block|inline)-(?:style-)?(.+)$/, handlerBorderStyle],
    [/^pd-(?:border|b)-([bi][se])-(?:style-)?(.+)$/, handlerBorderStyle],
];
const borderColorResolver = (direction) => ([, body], theme) => {
    const data = parseColor(body, theme);
    if (!data)
        return;
    const { alpha, color, cssColor } = data;
    if (cssColor) {
        if (alpha != null) {
            return {
                [`border${direction}-color`]: colorToString(cssColor, alpha),
            };
        }
        if (direction === '') {
            return {
                '--un-border-opacity': colorOpacityToString(cssColor),
                'border-color': colorToString(cssColor, 'var(--un-border-opacity)'),
            };
        }
        else {
            return {
                // Separate this return since if `direction` is an empty string, the first key will be overwritten by the second.
                '--un-border-opacity': colorOpacityToString(cssColor),
                [`--un-border${direction}-opacity`]: 'var(--un-border-opacity)',
                [`border${direction}-color`]: colorToString(cssColor, `var(--un-border${direction}-opacity)`),
            };
        }
    }
    else if (color) {
        return {
            [`border${direction}-color`]: colorToString(color, alpha),
        };
    }
};
function handlerBorder(m, ctx) {
    const borderSizes = handlerBorderSize(m, ctx);
    const borderStyle = handlerBorderStyle(['', m[1], 'solid']);
    if (borderSizes && borderStyle) {
        return [
            ...borderSizes,
            ...borderStyle,
        ];
    }
}
function handlerBorderSize([, a = '', b], { theme }) {
    const v = theme.lineWidth?.[b || 'DEFAULT'] ?? h.bracket.cssvar.global.px(b || '1');
    if (a in directionMap && v != null)
        return directionMap[a].map(i => [`border${i}-width`, v]);
}
function handlerBorderColor([, a = '', c], { theme }) {
    if (a in directionMap && hasParseableColor(c, theme)) {
        return Object.assign({}, ...directionMap[a].map(i => borderColorResolver(i)(['', c], theme)));
    }
}
function handlerBorderOpacity([, a = '', opacity]) {
    const v = h.bracket.percent(opacity);
    if (a in directionMap && v != null)
        return directionMap[a].map(i => [`--un-border${i}-opacity`, v]);
}
function handlerRounded([, a = '', s], { theme }) {
    const v = theme.borderRadius?.[s || 'DEFAULT'] || h.bracket.cssvar.global.fraction.rem(s || '1');
    if (a in cornerMap && v != null)
        return cornerMap[a].map(i => [`border${i}-radius`, v]);
}
export function handlerBorderStyle([, a = '', s]) {
    if (borderStyles.includes(s) && a in directionMap)
        return directionMap[a].map(i => [`border${i}-style`, s]);
}
