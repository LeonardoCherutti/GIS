// null means "use CSS palette.css defaults (teal)"
export const DEFAULT_THEME_COLOR: string | null = null

export const PALETTE_KEYS = [
  '--palette-primary',
  '--palette-primary-hover',
  '--palette-primary-subtle',
  '--palette-accent',
  '--palette-accent-hover',
  '--palette-background',
  '--palette-surface',
  '--palette-surface-raised',
  '--palette-border',
  '--palette-foreground',
  '--palette-muted-fg',
  '--palette-disabled-fg',
] as const

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  return [h, Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100
  const a = sNorm * Math.min(lNorm, 1 - lNorm)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function adjustLightness(hex: string, amount: number): string {
  const [h, s, l] = hexToHsl(hex)
  return hslToHex(h, s, clamp(l + amount, 0, 100))
}

export function generatePalette(hex: string): {
  light: Record<string, string>
  dark: Record<string, string>
} {
  const [h, s] = hexToHsl(hex)

  const primaryHover = adjustLightness(hex, -10)
  const lightSubtle = hslToHex(h, 30, 95)

  const darkPrimary = adjustLightness(hex, 20)
  const darkPrimaryHover = adjustLightness(hex, 30)
  const darkPrimarySubtle = hslToHex(h, 20, 15)

  const darkBg = hslToHex(h, 30, 12)
  const darkSurface = hslToHex(h, 28, 15)
  const darkSurfaceRaised = hslToHex(h, 26, 18)
  const darkBorder = hslToHex(h, clamp(s * 0.5, 10, 40), 25)
  const darkMutedFg = hslToHex(h, 20, 60)
  const darkDisabledFg = hslToHex(h, 15, 35)

  return {
    light: {
      '--palette-primary': hex,
      '--palette-primary-hover': primaryHover,
      '--palette-primary-subtle': lightSubtle,
      '--palette-accent': hex,
      '--palette-accent-hover': primaryHover,
      '--palette-background': '#ffffff',
      '--palette-surface': '#f8fafb',
      '--palette-surface-raised': '#ffffff',
      '--palette-border': '#e2e8ea',
      '--palette-foreground': '#0a1628',
      '--palette-muted-fg': '#6b7280',
      '--palette-disabled-fg': '#9ca3af',
    },
    dark: {
      '--palette-primary': darkPrimary,
      '--palette-primary-hover': darkPrimaryHover,
      '--palette-primary-subtle': darkPrimarySubtle,
      '--palette-accent': darkPrimary,
      '--palette-accent-hover': darkPrimaryHover,
      '--palette-background': darkBg,
      '--palette-surface': darkSurface,
      '--palette-surface-raised': darkSurfaceRaised,
      '--palette-border': darkBorder,
      '--palette-foreground': '#f0f4f4',
      '--palette-muted-fg': darkMutedFg,
      '--palette-disabled-fg': darkDisabledFg,
    },
  }
}
