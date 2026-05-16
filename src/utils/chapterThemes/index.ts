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
  const soft = toRgba(accent, 0.08);
  const softer = toRgba(accent, 0.04);
  const border = toRgba(accent, 0.2);
  const shadow = toRgba(accent, 0.15);

  return {
    accent,
    accentTextColor: accent,
    secondaryTextColor: "rgba(71, 85, 105, 0.9)", // slate-600
    metaColor: "rgba(100, 116, 139, 0.9)", // slate-500
    heroGradient: `linear-gradient(135deg, ${toRgba(accent, 0.15)} 0%, rgba(248, 250, 252, 0.92) 55%, rgba(255, 255, 255, 1) 100%)`,
    heroOverlay: `linear-gradient(180deg, ${toRgba(accent, 0.1)} 0%, rgba(255, 255, 255, 0) 70%)`,
    heroMetaColor: "rgba(51, 65, 85, 0.9)", // slate-700
    accentGradient: `linear-gradient(90deg, ${toRgba(accent, 0.9)} 0%, ${toRgba(accent, 0.7)} 100%)`,
    accentButtonText: "#ffffff",
    cardBackground: `linear-gradient(135deg, ${softer} 0%, rgba(255, 255, 255, 1) 100%)`,
    cardBorder: border,
    cardShadow: `0 4px 12px -2px ${shadow}`,
    pillBackground: "rgba(255, 255, 255, 1)",
    pillBorder: border,
    buttonBorder: border,
    buttonBackground: "rgba(255, 255, 255, 1)",
    buttonTextColor: accent,
    panelBackground: `linear-gradient(135deg, ${soft} 0%, rgba(255, 255, 255, 1) 100%)`,
    panelBorder: border,
    panelShadow: `0 8px 24px -4px ${shadow}`,
    navText: "rgba(51, 65, 85, 0.9)",
    navSelectedBackground: toRgba(accent, 0.1),
    navSelectedText: accent
  };
};

const themes: ThemeMap = {
  "ieee-computer-society-student-branch-chapter": createTheme("#eb7734"),
  "ieee-robotics-and-automation-society-student-branch-chapter": createTheme("#b8074e"),
  "ieee-photonics-society-student-branch-chapter": createTheme("#eddc1f"),
  "ieee-power-and-energy-society-student-branch-chapter": createTheme("#71eb34"),
  "ieee-systems-council-student-branch-chapter": createTheme("#0ceef2"),
  "ieee-power-electronics-society-student-branch-chapter": createTheme("#d40606"),
  "ieee-bubt-women-in-engineering-student-branch-affinity-group": createTheme("#8907b8")
};

const defaultTheme = createTheme("#93c5fd");

export const getChapterTheme = (slug?: string): ChapterTheme => {
  if (!slug) {
    return defaultTheme;
  }

  return themes[slug] ?? defaultTheme;
};
