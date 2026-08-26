/** 集中管理渲染层时间参数，保证交互节奏一致。 */
export const UI_TIMINGS = {
  toastDurationMs: 3600,
  simulatedSaveDurationMs: 1800,
  taskTickMs: 120,
  focusDelayFrames: 1,
} as const;

/** 应用外壳支持的键盘命令。 */
export const KEYBOARD_COMMANDS = {
  commandPaletteKey: 'k',
  settingsKey: ',',
} as const;
