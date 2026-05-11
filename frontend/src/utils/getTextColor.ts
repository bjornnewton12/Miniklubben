const LIGHT_TEXT_COLORS = new Set(['#4100F4', '#9C27B0'])

export function getTextColor(hex: string): string {
    return LIGHT_TEXT_COLORS.has(hex) ? '#FAF4F4' : '#121212'
}
