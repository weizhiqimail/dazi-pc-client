import type { ContentWidth, DensityPreference, FontScale, ThemePreference } from '@/types/preferences';
export interface SettingsPageProps {
  theme: ThemePreference;
  setTheme: (value: ThemePreference) => void;
  density: DensityPreference;
  setDensity: (value: DensityPreference) => void;
  contentWidth: ContentWidth;
  setContentWidth: (value: ContentWidth) => void;
  navFontScale: FontScale;
  setNavFontScale: (value: FontScale) => void;
  contentFontScale: FontScale;
  setContentFontScale: (value: FontScale) => void;
}
