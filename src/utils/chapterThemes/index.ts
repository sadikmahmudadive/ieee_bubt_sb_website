export type ChapterTheme = {
  accent: string;
  accentTextColor: string;
  secondaryTextColor: string;
  metaColor: string;
  heroGradient: string;
  heroOverlay: string;
  heroMetaColor: string;
  accentGradient: string;
  accentButtonText: string;
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  pillBackground: string;
  pillBorder: string;
  buttonBorder: string;
  buttonBackground: string;
  buttonTextColor: string;
  panelBackground: string;
  panelBorder: string;
  panelShadow: string;
  navText: string;
  navSelectedBackground: string;
  navSelectedText: string;
};

type ThemeMap = Record<string, ChapterTheme>;

const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

const toRgba = (hex: string, alpha = 1): string => {
  const normalized = hex.trim();
  const match = hexRegex.exec(normalized);

  if (!match) {
    return `rgba(148, 163, 184, ${alpha})`;
  }

  const [, r, g, b] = match;
  const red = parseInt(r, 16);
  const green = parseInt(g, 16);
  const blue = parseInt(b, 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const createTheme = (accent: string): ChapterTheme => {
  const soft = toRgba(accent, 0.12);
  const softer = toRgba(accent, 0.2);
  const border = toRgba(accent, 0.5);
  const shadow = toRgba(accent, 0.45);

  return {
    accent,
    accentTextColor: toRgba(accent, 0.92),
    secondaryTextColor: "rgba(226, 232, 240, 0.85)",
    metaColor: "rgba(203, 213, 225, 0.8)",
    heroGradient: `linear-gradient(135deg, ${toRgba(accent, 0.38)} 0%, rgba(4, 6, 18, 0.92) 55%, rgba(2, 6, 23, 0.9) 100%)`,
    heroOverlay: `linear-gradient(180deg, ${toRgba(accent, 0.42)} 0%, rgba(8, 11, 25, 0) 70%)`,
    heroMetaColor: "rgba(226, 232, 240, 0.92)",
    accentGradient: `linear-gradient(90deg, ${toRgba(accent, 0.85)} 0%, ${toRgba(accent, 0.65)} 100%)`,
    accentButtonText: "#020617",
    cardBackground: `linear-gradient(135deg, ${soft} 0%, rgba(2, 6, 23, 0.92) 100%)`,
    cardBorder: border,
    cardShadow: `0 28px 60px -38px ${shadow}`,
    pillBackground: softer,
    pillBorder: border,
    buttonBorder: border,
    buttonBackground: soft,
    buttonTextColor: "rgba(248, 250, 252, 0.96)",
    panelBackground: `linear-gradient(135deg, ${toRgba(accent, 0.2)} 0%, rgba(3, 7, 18, 0.92) 100%)`,
    panelBorder: border,
    panelShadow: `0 26px 60px -40px ${shadow}`,
    navText: toRgba(accent, 0.85),
    navSelectedBackground: toRgba(accent, 0.25),
    navSelectedText: "#0f172a"
  };
};

/**
 * Color themes for IEEE BUBT SB chapters and affinity groups
 * 
 * Each chapter/affinity group has a unique color scheme that reflects its identity:
 * - Computer Society: Sky Blue (#38bdf8) - Represents technology and digital innovation
 * - Robotics & Automation: Orange (#fb923c) - Dynamic and energetic, reflects automation
 * - Photonics Society: Fuchsia (#e879f9) - Light and optics theme with vibrant magenta
 * - Power & Energy: Green (#86efac) - Sustainable energy and environmental focus
 * - Systems Council: Teal (#2dd4bf) - Systems thinking and interconnected processes
 * - Power Electronics: Rose Pink (#fda4af) - Electronic circuits and soft technology
 * - Women in Engineering: Purple (#c084fc) - Empowerment and diversity
 */
const themes: ThemeMap = {
  "ieee-computer-society-student-branch-chapter": createTheme("#eb7734"),
  "ieee-robotics-and-automation-society-student-branch-chapter": createTheme("#b8074e"),
  "ieee-photonics-society-student-branch-chapter": createTheme("#eddc1f"),
  "ieee-power-and-energy-society-student-branch-chapter": createTheme("#71eb34"),
  "ieee-systems-council-student-branch-chapter": createTheme("#0ceef2"),
  "ieee-power-electronics-society-student-branch-chapter": createTheme("#d40606"),
  "ieee-bubt-women-in-engineering-student-branch-affinity-group": createTheme("#8907b8")
};

/**
 * Default theme used for chapters without a specific color assignment
 * Uses a light blue color (#93c5fd)
 */
const defaultTheme = createTheme("#93c5fd");

/**
 * Get the theme for a specific chapter or affinity group
 * @param slug - The URL slug of the chapter/affinity group
 * @returns The ChapterTheme object with all color properties
 */
export const getChapterTheme = (slug?: string): ChapterTheme => {
  if (!slug) {
    return defaultTheme;
  }

  return themes[slug] ?? defaultTheme;
};

/**
 * Get all available chapter slugs that have defined themes
 * @returns Array of chapter/affinity group slugs
 */
export const getAvailableChapterSlugs = (): string[] => {
  return Object.keys(themes);
};

/**
 * Check if a specific chapter has a defined theme
 * @param slug - The URL slug of the chapter/affinity group
 * @returns true if a theme is defined, false otherwise
 */
export const hasChapterTheme = (slug?: string): boolean => {
  if (!slug) return false;
  return slug in themes;
};
