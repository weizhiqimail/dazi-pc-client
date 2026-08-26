import { CheckCircle2, FolderOpen, Keyboard, Moon, Palette, SlidersHorizontal, Sun } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Kbd } from '@/components/Kbd';
import { Section } from '@/components/Section';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Switch } from '@/components/Switch';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/ToastProvider/useToast';
import {
  CONTENT_WIDTH_OPTIONS,
  DENSITY_OPTIONS,
  FONT_SCALE_OPTIONS,
  THEME_OPTIONS,
} from '@/config/preferences.config';
import { STORAGE_KEYS } from '@/config/storage.config';
import { writeStorageValue } from '@/helpers/storage';
import type { ThemePreference } from '@/types/preferences';
import type { SettingsPageProps } from './types';
import './styles.less';

const THEME_ICONS = { system: Palette, light: Sun, dark: Moon } satisfies Record<
  ThemePreference,
  typeof Palette
>;

/** 全局外观、存储和交互偏好设置页面。 */
export function SettingsPage(): ReactElement {
  const {
    theme,
    setTheme,
    density,
    setDensity,
    contentWidth,
    setContentWidth,
    navFontScale,
    setNavFontScale,
    contentFontScale,
    setContentFontScale,
  } = useOutletContext<SettingsPageProps>();
  const [animations, setAnimations] = useState(true);
  const [cacheDirectory, setCacheDirectory] = useState(
    () => localStorage.getItem(STORAGE_KEYS.cacheDirectory) ?? '',
  );
  const { push } = useToast();
  const chooseCacheDirectory = async () => {
    const selected = await window.desktop.chooseDirectory();
    if (!selected) return;
    setCacheDirectory(selected);
    writeStorageValue(STORAGE_KEYS.cacheDirectory, selected);
    push('缓存目录已更新', selected);
  };
  return (
    <div className="settings-stack">
      <Section title="本地缓存目录" description="模型、临时文件和工具缓存将统一保存在这里。">
        <div className="directory-setting">
          <TextField label="目录位置" value={cacheDirectory} readOnly placeholder="尚未设置" />
          <Button leading={<FolderOpen size={14} />} onClick={() => void chooseCacheDirectory()}>
            选择目录
          </Button>
        </div>
        <p className="setting-note">当前只保存目录设置，不会自动创建或写入任何缓存文件。</p>
      </Section>
      <Section title="主题" description="跟随系统，也可以为应用单独指定。">
        <div className="theme-options">
          {THEME_OPTIONS.map(({ value, label }) => {
            const ThemeIcon = THEME_ICONS[value];
            return (
              <button
                key={value}
                className={theme === value ? 'is-selected' : ''}
                onClick={() => setTheme(value)}
              >
                <ThemeIcon size={17} />
                <span>{label}</span>
                {theme === value && <CheckCircle2 size={15} />}
              </button>
            );
          })}
        </div>
      </Section>
      <Section title="界面密度" description="紧凑适合鼠标键盘，舒适模式提供更大的点击区域。">
        <SegmentedControl label="界面密度" value={density} onChange={setDensity} options={DENSITY_OPTIONS} />
      </Section>
      <Section title="功能区宽度" description="调整右侧页面内容的最大宽度；左右始终至少保留 36px。">
        <SegmentedControl
          label="功能区宽度"
          value={contentWidth}
          onChange={setContentWidth}
          options={CONTENT_WIDTH_OPTIONS}
        />
      </Section>
      <Section title="文字大小" description="菜单与功能区正文可以分别调整，页面标题不受影响。">
        <div className="font-settings">
          <div>
            <span>左侧菜单</span>
            <SegmentedControl
              label="左侧菜单字号"
              value={navFontScale}
              onChange={setNavFontScale}
              options={FONT_SCALE_OPTIONS}
            />
          </div>
          <div>
            <span>功能区正文</span>
            <SegmentedControl
              label="功能区正文字号"
              value={contentFontScale}
              onChange={setContentFontScale}
              options={FONT_SCALE_OPTIONS}
            />
          </div>
        </div>
      </Section>
      <Section title="交互偏好">
        <Switch
          checked={animations}
          onChange={setAnimations}
          label="界面动态"
          description="减少突兀切换；系统要求减少动画时会自动禁用。"
        />
        <Divider />
        <div className="shortcut-row">
          <span>
            <Keyboard size={16} />
            快速搜索
          </span>
          <Kbd>Ctrl K</Kbd>
        </div>
        <div className="shortcut-row">
          <span>
            <SlidersHorizontal size={16} />
            打开设置
          </span>
          <Kbd>Ctrl ,</Kbd>
        </div>
      </Section>
    </div>
  );
}
