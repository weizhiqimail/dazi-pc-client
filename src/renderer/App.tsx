import { CommandPalette } from '@/components/CommandPalette';
import { Sidebar } from '@/components/Sidebar';
import { TitleBar } from '@/components/TitleBar';
import { KEYBOARD_COMMANDS } from '@/config/app.config';
import {
  CONTENT_WIDTH_OPTIONS,
  DEFAULT_PREFERENCES,
  DENSITY_OPTIONS,
  FONT_SCALE_OPTIONS,
  THEME_OPTIONS,
  THEME_VALUES,
} from '@/config/preferences.config';
import { STORAGE_KEYS } from '@/config/storage.config';
import { readStorageValue, writeStorageValue } from '@/helpers/storage';
import type { SettingsPageProps } from '@/pages/SettingsPage/types';
import type { ContentWidth, FontScale } from '@/types/preferences';
import { PAGE_ID_SETTINGS } from '@/router/constants';
import { DEFAULT_EXPANDED_NAVIGATION_GROUP_IDS } from '@/router/navigation-config';
import { getPageById, PAGE_LIST } from '@/router/page-registry';
import { ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './app.less';

/** 渲染层根组件，只负责全局状态和路由页面外壳。 */
export function App(): ReactElement {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(DEFAULT_EXPANDED_NAVIGATION_GROUP_IDS),
  );
  const [theme, setTheme] = useState(() =>
    readStorageValue(
      STORAGE_KEYS.theme,
      DEFAULT_PREFERENCES.theme,
      THEME_OPTIONS.map((item) => item.value),
    ),
  );
  const [density, setDensity] = useState(() =>
    readStorageValue(
      STORAGE_KEYS.density,
      DEFAULT_PREFERENCES.density,
      DENSITY_OPTIONS.map((item) => item.value),
    ),
  );
  const [contentWidth, setContentWidth] = useState<ContentWidth>(() =>
    readStorageValue(
      STORAGE_KEYS.contentWidth,
      DEFAULT_PREFERENCES.contentWidth,
      CONTENT_WIDTH_OPTIONS.map((item) => item.value),
    ),
  );
  const [navFontScale, setNavFontScale] = useState<FontScale>(() =>
    readStorageValue(
      STORAGE_KEYS.navFontScale,
      DEFAULT_PREFERENCES.navFontScale,
      FONT_SCALE_OPTIONS.map((item) => item.value),
    ),
  );
  const [contentFontScale, setContentFontScale] = useState<FontScale>(() =>
    readStorageValue(
      STORAGE_KEYS.contentFontScale,
      DEFAULT_PREFERENCES.contentFontScale,
      FONT_SCALE_OPTIONS.map((item) => item.value),
    ),
  );

  const navigate = useCallback(
    (path: string) => {
      void routerNavigate(path);
      setCommandOpen(false);
    },
    [routerNavigate],
  );
  const toggleGroup = useCallback(
    (id: string) =>
      setExpandedGroups((groups) => {
        const next = new Set(groups);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    [],
  );

  // 响应系统主题变化，并同步 Electron 原生标题栏按钮。
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const resolved =
        theme === THEME_VALUES.system ? (media.matches ? THEME_VALUES.dark : THEME_VALUES.light) : theme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    };
    applyTheme();
    media.addEventListener('change', applyTheme);
    void window.desktop.setTheme(theme);
    writeStorageValue(STORAGE_KEYS.theme, theme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  // 将全局显示偏好写入 data 属性，供 Less 主题规则读取。
  useEffect(() => {
    document.documentElement.dataset.density = density;
    writeStorageValue(STORAGE_KEYS.density, density);
  }, [density]);
  useEffect(() => {
    document.documentElement.dataset.contentWidth = contentWidth;
    document.documentElement.dataset.navFont = navFontScale;
    document.documentElement.dataset.contentFont = contentFontScale;
    writeStorageValue(STORAGE_KEYS.contentWidth, contentWidth);
    writeStorageValue(STORAGE_KEYS.navFontScale, navFontScale);
    writeStorageValue(STORAGE_KEYS.contentFontScale, contentFontScale);
  }, [contentWidth, navFontScale, contentFontScale]);

  // 在渲染层生命周期内注册一次应用级导航快捷键。
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLocaleLowerCase() === KEYBOARD_COMMANDS.commandPaletteKey
      ) {
        event.preventDefault();
        setCommandOpen(true);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === KEYBOARD_COMMANDS.settingsKey) {
        event.preventDefault();
        navigate(getPageById(PAGE_ID_SETTINGS).path);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  const current = PAGE_LIST.find((item) => item.path === location.pathname) ?? PAGE_LIST[0]!;
  const outletContext: SettingsPageProps = {
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
  };

  return (
    <div className="app-shell">
      <TitleBar />
      <div className={`workspace ${sidebarOpen ? '' : 'is-sidebar-collapsed'}`}>
        <Sidebar
          activePath={location.pathname}
          open={sidebarOpen}
          expandedGroups={expandedGroups}
          onToggleSidebar={() => setSidebarOpen((value) => !value)}
          onToggleGroup={toggleGroup}
          onNavigate={navigate}
          onOpenCommandPalette={() => setCommandOpen(true)}
        />
        <main className="main-content" tabIndex={-1}>
          <div className="page-heading">
            <div className="breadcrumb">
              <span>{current.meta.category}</span>
              <ChevronRight size={13} />
              <span>{current.name}</span>
            </div>
            <h1>{current.name}</h1>
          </div>
          <div className="page-transition" key={location.pathname}>
            <Outlet context={outletContext} />
          </div>
        </main>
      </div>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} navigate={navigate} />
    </div>
  );
}
