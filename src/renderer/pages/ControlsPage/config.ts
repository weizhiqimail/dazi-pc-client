export const CONTROL_PAGE_DEFAULTS = {
  workspaceName: '示例工作区',
  encoding: 'utf8',
  mode: 'simple',
  autosave: true,
  rememberDirectory: false,
} as const;
export const ENCODING_OPTIONS = [
  { value: 'utf8', label: 'UTF-8' },
  { value: 'gbk', label: 'GBK' },
  { value: 'utf16', label: 'UTF-16 LE' },
] as const;
export const MODE_OPTIONS = [
  { value: 'simple', label: '简单' },
  { value: 'advanced', label: '高级' },
] as const;
export type ControlMode = (typeof MODE_OPTIONS)[number]['value'];
