import { z } from "zod";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Usá un color hex de 6 dígitos, por ejemplo #2F4A6D");

/**
 * Tokens de marca que un cliente puede cambiar sin tocar código.
 * Cubre todos los tokens de color y tipografía que usa el Design System
 * (docs/05-design-system.md); si se agrega un token allá, se agrega acá.
 */
export const BrandingSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  logoText: z.string().min(1),
  colors: z.object({
    background: hex,
    surface: hex,
    surfaceSunken: hex,
    text: hex,
    textMuted: hex,
    border: hex,
    accent: hex,
    accentHover: hex,
    accentContrast: hex,
    accentSoft: hex,
    sale: hex,
    success: hex,
    focus: hex,
  }),
  fonts: z.object({
    display: z.string().min(1),
    body: z.string().min(1),
    /** URL de Google Fonts (u otra hoja de estilo) con las familias de arriba. */
    stylesheetUrl: z.url().optional(),
  }),
  radius: z.object({
    control: z.number().int().min(0).max(24),
    surface: z.number().int().min(0).max(32),
  }),
});

export type Branding = z.infer<typeof BrandingSchema>;

/** Convierte el branding a custom properties CSS para inyectar en :root. */
export function brandingToCssVars(branding: Branding): Record<string, string> {
  const { colors, fonts, radius } = branding;
  const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    vars[`--color-${kebab(key)}`] = value;
  }
  vars["--font-display"] = fonts.display;
  vars["--font-body"] = fonts.body;
  vars["--radius-control"] = `${radius.control}px`;
  vars["--radius-surface"] = `${radius.surface}px`;
  return vars;
}

export function cssVarsToString(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}
