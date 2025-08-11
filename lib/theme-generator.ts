export interface ClientTheme {
  primary: string
  secondary: string
  accent: string
  primaryRgb: string
  secondaryRgb: string
  accentRgb: string
  primaryHsl: string
  secondaryHsl: string
  accentHsl: string
}

export function generateClientTheme(brandColors: {
  primary?: string
  secondary?: string
  accent?: string
}): ClientTheme {
  const defaultColors = {
    primary: '#2d1b69',
    secondary: '#1c033c',
    accent: '#7c3aed'
  }

  const colors = {
    primary: brandColors.primary || defaultColors.primary,
    secondary: brandColors.secondary || defaultColors.secondary,
    accent: brandColors.accent || defaultColors.accent
  }

  return {
    ...colors,
    primaryRgb: hexToRgb(colors.primary),
    secondaryRgb: hexToRgb(colors.secondary),
    accentRgb: hexToRgb(colors.accent),
    primaryHsl: hexToHsl(colors.primary),
    secondaryHsl: hexToHsl(colors.secondary),
    accentHsl: hexToHsl(colors.accent)
  }
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '45, 27, 105' // fallback
}

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '255, 100%, 60%' // fallback
  
  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
}