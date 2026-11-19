export interface ColorScheme {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  terracotta: string;
  sand: string;
  sage: string;
  mauve: string;
  peach: string;
  accent: string;
  periodRed: string;
  predictedPeriod: string;
  fertileGreen: string;
  ovulationPurple: string;
  success: string;
  warning: string;
  cardShadow: string;
}

export const Colors = {
  light: {
    background: '#FDFBF7', // Warm Sand / Cream
    surface: '#FFFFFF',
    surfaceElevated: '#FAF8F5',
    border: '#E8E4DE',
    textPrimary: '#2D2A26',
    textSecondary: '#66615B',
    textMuted: '#9B958D',
    terracotta: '#E07A5F', // Primary restorative tone
    sand: '#FDFBF7',
    sage: '#81B29A', // Follicular calm
    mauve: '#8D82A2', // Luteal reflection
    peach: '#F4A261', // Ovulatory warmth
    accent: '#E07A5F',
    periodRed: '#D64933', // Refined non-clinical crimson
    predictedPeriod: '#F1A99B', // Soft terracotta tint
    fertileGreen: '#457B9D', // Clean tranquil sea blue/green
    ovulationPurple: '#7B2CBF', // Distinct peak marker
    success: '#52796F',
    warning: '#E76F51',
    cardShadow: 'rgba(45, 42, 38, 0.05)',
  } as ColorScheme,
  dark: {
    background: '#121214', // Soft Obsidian
    surface: '#1E1E22',
    surfaceElevated: '#28282D',
    border: '#323238',
    textPrimary: '#F7F6F3',
    textSecondary: '#B5B1A8',
    textMuted: '#7A766F',
    terracotta: '#E07A5F',
    sand: '#1A1A1E',
    sage: '#81B29A',
    mauve: '#8D82A2',
    peach: '#F4A261',
    accent: '#E07A5F',
    periodRed: '#E65A46',
    predictedPeriod: '#66342C',
    fertileGreen: '#326273',
    ovulationPurple: '#9D4EDD',
    success: '#84A98C',
    warning: '#F4A261',
    cardShadow: 'rgba(0, 0, 0, 0.35)',
  } as ColorScheme,
};

export type ThemeMode = 'light' | 'dark';
