import { ControlsPage } from '@/pages/ControlsPage';
import { FeedbackPage } from '@/pages/FeedbackPage';
import { MarkdownPage } from '@/pages/MarkdownPage';
import { MotionPage } from '@/pages/MotionPage';
import { NavigationPage } from '@/pages/NavigationPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Bell, Component, FileText, Gauge, Home, LayoutPanelLeft, Settings } from 'lucide-react';
import {
  PAGE_ID_CONTROLS,
  PAGE_ID_FEEDBACK,
  PAGE_ID_MARKDOWN,
  PAGE_ID_MOTION,
  PAGE_ID_NAVIGATION,
  PAGE_ID_OVERVIEW,
  PAGE_ID_SETTINGS,
  ROUTE_GROUP_ID_PLAYGROUND,
  ROUTE_GROUP_ID_SYSTEM,
  ROUTE_GROUP_ID_TOOLBOX,
} from './constants';
import type { PageDefinition, PageId, RouteGroupId } from './types';

/** 根据一级路由和页面片段生成完整页面路径。 */
function createPagePath(routeGroupId: RouteGroupId, routeSegment: string): string {
  return `/${routeGroupId}/${routeSegment}`;
}

/**
 * 页面信息唯一来源。新增页面时先在这里登记，再按需加入路由表和导航菜单。
 * Map 允许调用方通过固定页面 ID 直接获得完整页面信息。
 */
export const PAGE_REGISTRY: ReadonlyMap<PageId, PageDefinition> = new Map([
  [
    PAGE_ID_OVERVIEW,
    {
      id: PAGE_ID_OVERVIEW,
      name: '概览',
      path: createPagePath(ROUTE_GROUP_ID_TOOLBOX, PAGE_ID_OVERVIEW),
      routeSegment: PAGE_ID_OVERVIEW,
      icon: Home,
      component: OverviewPage,
      meta: {
        title: '工具箱概览',
        description: '查看交互基础能力和工具入口。',
        category: '工具箱',
        keywords: ['首页', '概览', '工具箱'],
      },
    },
  ],
  [
    PAGE_ID_MARKDOWN,
    {
      id: PAGE_ID_MARKDOWN,
      name: 'Markdown 转 HTML',
      path: createPagePath(ROUTE_GROUP_ID_TOOLBOX, PAGE_ID_MARKDOWN),
      routeSegment: PAGE_ID_MARKDOWN,
      icon: FileText,
      component: MarkdownPage,
      meta: {
        title: 'Markdown 转 HTML',
        description: '将 Markdown 和 CSS 转换为 HTML。',
        category: '文本工具',
        keywords: ['Markdown', 'HTML', 'CSS', '转换'],
      },
    },
  ],
  [
    PAGE_ID_CONTROLS,
    {
      id: PAGE_ID_CONTROLS,
      name: '基础控件',
      path: createPagePath(ROUTE_GROUP_ID_PLAYGROUND, PAGE_ID_CONTROLS),
      routeSegment: PAGE_ID_CONTROLS,
      icon: Component,
      component: ControlsPage,
      meta: {
        title: '基础控件',
        description: '测试按钮、表单、菜单和对话框。',
        category: '交互实验场',
        keywords: ['组件', '按钮', '表单', '菜单'],
      },
    },
  ],
  [
    PAGE_ID_NAVIGATION,
    {
      id: PAGE_ID_NAVIGATION,
      name: '导航与选择',
      path: createPagePath(ROUTE_GROUP_ID_PLAYGROUND, PAGE_ID_NAVIGATION),
      routeSegment: PAGE_ID_NAVIGATION,
      icon: LayoutPanelLeft,
      component: NavigationPage,
      meta: {
        title: '导航与选择',
        description: '测试标签、列表选择和键盘导航。',
        category: '交互实验场',
        keywords: ['导航', '列表', '标签', '选择'],
      },
    },
  ],
  [
    PAGE_ID_FEEDBACK,
    {
      id: PAGE_ID_FEEDBACK,
      name: '反馈与状态',
      path: createPagePath(ROUTE_GROUP_ID_PLAYGROUND, PAGE_ID_FEEDBACK),
      routeSegment: PAGE_ID_FEEDBACK,
      icon: Bell,
      component: FeedbackPage,
      meta: {
        title: '反馈与状态',
        description: '测试通知、提示、错误和加载状态。',
        category: '交互实验场',
        keywords: ['通知', '状态', '错误', '加载'],
      },
    },
  ],
  [
    PAGE_ID_MOTION,
    {
      id: PAGE_ID_MOTION,
      name: '动态与任务',
      path: createPagePath(ROUTE_GROUP_ID_PLAYGROUND, PAGE_ID_MOTION),
      routeSegment: PAGE_ID_MOTION,
      icon: Gauge,
      component: MotionPage,
      meta: {
        title: '动态与任务',
        description: '测试任务进度、暂停、取消和列表动态。',
        category: '交互实验场',
        keywords: ['任务', '进度', '动态', '取消'],
      },
    },
  ],
  [
    PAGE_ID_SETTINGS,
    {
      id: PAGE_ID_SETTINGS,
      name: '设置',
      path: createPagePath(ROUTE_GROUP_ID_SYSTEM, PAGE_ID_SETTINGS),
      routeSegment: PAGE_ID_SETTINGS,
      icon: Settings,
      component: SettingsPage,
      meta: {
        title: '系统设置',
        description: '配置外观、字号、缓存目录和交互偏好。',
        category: '系统',
        keywords: ['设置', '主题', '字号', '缓存'],
      },
    },
  ],
]);

/** 页面列表用于搜索和遍历，顺序与 Map 注册顺序保持一致。 */
export const PAGE_LIST: readonly PageDefinition[] = Array.from(PAGE_REGISTRY.values());

/** 按固定 ID 获取页面；缺少页面属于配置错误，应立即失败。 */
export function getPageById(pageId: PageId): PageDefinition {
  const page = PAGE_REGISTRY.get(pageId);
  if (!page) throw new Error(`没有找到页面配置：${pageId}`);
  return page;
}
