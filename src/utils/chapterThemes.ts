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
};

const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

const hexToRgba = (hex: string, alpha = 1): string => {
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
  const heroGradient = `linear-gradient(135deg, ${hexToRgba(accent, 0.38)} 0%, rgba(4, 6, 18, 0.92) 55%, rgba(2, 6, 23, 0.9) 100%)`;
  const heroOverlay = `linear-gradient(180deg, ${hexToRgba(accent, 0.42)} 0%, rgba(8, 11, 25, 0) 70%)`;
  const accentGradient = `linear-gradient(90deg, ${hexToRgba(accent, 0.85)} 0%, ${hexToRgba(accent, 0.65)} 100%)`;
  const cardBackground = `linear-gradient(135deg, ${hexToRgba(accent, 0.14)} 0%, rgba(2, 6, 23, 0.92) 100%)`;
  const panelBackground = `linear-gradient(135deg, ${hexToRgba(accent, 0.2)} 0%, rgba(3, 7, 18, 0.92) 100%)`;
  const cardBorder = hexToRgba(accent, 0.52);
  const cardShadow = `0 28px 60px -38px ${hexToRgba(accent, 0.48)}`;
  const panelShadow = `0 26px 60px -40px ${hexToRgba(accent, 0.45)}`;
  const pillBackground = hexToRgba(accent, 0.22);
  const pillBorder = hexToRgba(accent, 0.45);
  const buttonBorder = hexToRgba(accent, 0.55);
  const buttonBackground = hexToRgba(accent, 0.12);

  return {
    accent,
    accentTextColor: hexToRgba(accent, 0.92),
    secondaryTextColor: "rgba(226, 232, 240, 0.85)",
    metaColor: "rgba(203, 213, 225, 0.8)",
    heroGradient,
    heroOverlay,
    heroMetaColor: "rgba(226, 232, 240, 0.92)",
    accentGradient,
    accentButtonText: "#020617",
    cardBackground,
    cardBorder,
    cardShadow,
    pillBackground,
    pillBorder,
    buttonBorder,
    buttonBackground,
    buttonTextColor: "rgba(248, 250, 252, 0.96)",
    panelBackground,
    panelBorder: cardBorder,
    panelShadow
  };
};

const themeMap: Record<string, ChapterTheme> = {
  "ieee-computer-society-student-branch-chapter": createTheme("#38bdf8"),
  "ieee-robotics-and-automation-society-student-branch-chapter": createTheme("#fb923c"),
  "ieee-photonics-society-student-branch-chapter": createTheme("#e879f9"),
  "ieee-power-and-energy-society-student-branch-chapter": createTheme("#86efac"),
  "ieee-systems-council-student-branch-chapter": createTheme("#2dd4bf"),
  "ieee-power-electronics-society-student-branch-chapter": createTheme("#fda4af"),
  "ieee-bubt-women-in-engineering-student-branch-affinity-group": createTheme("#c084fc")
};

const defaultTheme = createTheme("#93c5fd");

export const getChapterTheme = (slug?: string): ChapterTheme => {
  if (!slug) {
    return defaultTheme;
  }

  return themeMap[slug] ?? defaultTheme;
};