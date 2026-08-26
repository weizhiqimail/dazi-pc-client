import { Blocks, Component, Settings } from 'lucide-react';
import {
  NAVIGATION_GROUP_ID_PLAYGROUND,
  NAVIGATION_GROUP_ID_SYSTEM,
  NAVIGATION_GROUP_ID_TOOLBOX,
  NAVIGATION_POSITION_FOOTER,
  NAVIGATION_POSITION_MAIN,
  PAGE_ID_CONTROLS,
  PAGE_ID_FEEDBACK,
  PAGE_ID_MARKDOWN,
  PAGE_ID_MOTION,
  PAGE_ID_NAVIGATION,
  PAGE_ID_OVERVIEW,
  PAGE_ID_SETTINGS,
} from './constants';
import type { NavigationGroupDefinition } from './types';

/**
 * 导航菜单只负责组合页面。页面是否出现在导航、出现顺序以及显示位置，
 * 都可以在这里修改，不需要改动页面注册表或路由配置。
 */
export const NAVIGATION_GROUP_LIST: readonly NavigationGroupDefinition[] = [
  {
    id: NAVIGATION_GROUP_ID_TOOLBOX,
    label: '工具箱',
    icon: Blocks,
    position: NAVIGATION_POSITION_MAIN,
    defaultExpanded: true,
    pageIds: [PAGE_ID_OVERVIEW, PAGE_ID_MARKDOWN],
  },
  {
    id: NAVIGATION_GROUP_ID_PLAYGROUND,
    label: '交互实验场',
    icon: Component,
    position: NAVIGATION_POSITION_MAIN,
    defaultExpanded: true,
    pageIds: [PAGE_ID_CONTROLS, PAGE_ID_NAVIGATION, PAGE_ID_FEEDBACK, PAGE_ID_MOTION],
  },
  {
    id: NAVIGATION_GROUP_ID_SYSTEM,
    label: '系统',
    icon: Settings,
    position: NAVIGATION_POSITION_FOOTER,
    defaultExpanded: true,
    pageIds: [PAGE_ID_SETTINGS],
  },
];

/** 默认展开项直接从导航配置计算，避免维护第二份列表。 */
export const DEFAULT_EXPANDED_NAVIGATION_GROUP_IDS: readonly string[] = NAVIGATION_GROUP_LIST.filter(
  (group) => group.defaultExpanded,
).map((group) => group.id);
