import type {
  AppearancePreferences,
  ContentWidth,
  DensityPreference,
  FontScale,
  ThemePreference,
} from '@/types/preferences';

/** 没有持久化偏好设置时使用的默认值。 */
export const DEFAULT_PREFERENCES: AppearancePreferences = {
  theme: 'system',
  density: 'compact',
  contentWidth: 'full',
  navFontScale: 'standard',
  contentFontScale: 'standard',
};

export const THEME_VALUES = { system: 'system', light: 'light', dark: 'dark' } as const;

export const THEME_OPTIONS: ReadonlyArray<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: '跟随系统' },
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
];

export const DENSITY_OPTIONS: ReadonlyArray<{ value: DensityPreference; label: string }> = [
  { value: 'compact', label: '紧凑' },
  { value: 'comfortable', label: '舒适' },
];

export const CONTENT_WIDTH_OPTIONS: ReadonlyArray<{ value: ContentWidth; label: string }> = [
  { value: 'focused', label: '专注' },
  { value: 'standard', label: '标准' },
  { value: 'full', label: '全宽' },
];

export const FONT_SCALE_OPTIONS: ReadonlyArray<{ value: FontScale; label: string }> = [
  { value: 'smallest', label: '较小' },
  { value: 'small', label: '小' },
  { value: 'standard', label: '标准' },
  { value: 'large', label: '大' },
  { value: 'largest', label: '特大' },
];
