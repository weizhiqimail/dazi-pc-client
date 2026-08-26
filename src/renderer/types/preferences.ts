/** 应用颜色主题偏好。 */
export type ThemePreference = 'system' | 'light' | 'dark';

/** 控件间距偏好。 */
export type DensityPreference = 'compact' | 'comfortable';

/** 页面工作区最大宽度预设。 */
export type ContentWidth = 'focused' | 'standard' | 'full';

/** 导航和页面正文共用的五档字号。 */
export type FontScale = 'smallest' | 'small' | 'standard' | 'large' | 'largest';

/** 由渲染层设置页面管理的外观偏好。 */
export interface AppearancePreferences {
  theme: ThemePreference;
  density: DensityPreference;
  contentWidth: ContentWidth;
  navFontScale: FontScale;
  contentFontScale: FontScale;
}
