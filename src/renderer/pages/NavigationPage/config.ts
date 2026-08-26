export const NAVIGATION_SAMPLE_FILES = [
  '会议记录.txt',
  '配置备份.json',
  '字幕样例.srt',
  '日志归档.zip',
] as const;
export const NAVIGATION_TABS = [
  { id: 'recent', label: '最近使用' },
  { id: 'favorite', label: '收藏' },
  { id: 'history', label: '历史记录' },
] as const;
export type NavigationTabId = (typeof NAVIGATION_TABS)[number]['id'];
