import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import {
  NAVIGATION_POSITION_FOOTER,
  NAVIGATION_POSITION_MAIN,
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

/** 全部合法页面 ID 的联合类型。 */
export type PageId =
  | typeof PAGE_ID_OVERVIEW
  | typeof PAGE_ID_MARKDOWN
  | typeof PAGE_ID_CONTROLS
  | typeof PAGE_ID_NAVIGATION
  | typeof PAGE_ID_FEEDBACK
  | typeof PAGE_ID_MOTION
  | typeof PAGE_ID_SETTINGS;

/** 全部一级路由分组 ID 的联合类型。 */
export type RouteGroupId =
  typeof ROUTE_GROUP_ID_TOOLBOX | typeof ROUTE_GROUP_ID_PLAYGROUND | typeof ROUTE_GROUP_ID_SYSTEM;

/** 页面可扩展元信息。 */
export interface PageMeta {
  title: string;
  description: string;
  category: string;
  keywords: readonly string[];
}

/** 页面注册表中的完整页面信息。 */
export interface PageDefinition {
  id: PageId;
  name: string;
  path: string;
  routeSegment: string;
  icon: LucideIcon;
  component: ComponentType;
  meta: PageMeta;
}

/** 一级路由以及其包含的二级页面。 */
export interface RouteGroupDefinition {
  id: RouteGroupId;
  pathSegment: string;
  indexPageId: PageId;
  pageIds: readonly PageId[];
}

/** 导航位置类型。 */
export type NavigationPosition = typeof NAVIGATION_POSITION_MAIN | typeof NAVIGATION_POSITION_FOOTER;

/** 可自由组合的一级导航菜单。 */
export interface NavigationGroupDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
  position: NavigationPosition;
  defaultExpanded: boolean;
  pageIds: readonly PageId[];
}
