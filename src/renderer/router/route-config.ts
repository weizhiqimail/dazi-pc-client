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
import type { RouteGroupDefinition } from './types';

/**
 * 两级路由配置只引用固定页面 ID，不重复保存页面名称、路径、图标或组件。
 * 修改页面所属路由时只需要调整这个列表。
 */
export const ROUTE_GROUP_LIST: readonly RouteGroupDefinition[] = [
  {
    id: ROUTE_GROUP_ID_TOOLBOX,
    pathSegment: ROUTE_GROUP_ID_TOOLBOX,
    indexPageId: PAGE_ID_OVERVIEW,
    pageIds: [PAGE_ID_OVERVIEW, PAGE_ID_MARKDOWN],
  },
  {
    id: ROUTE_GROUP_ID_PLAYGROUND,
    pathSegment: ROUTE_GROUP_ID_PLAYGROUND,
    indexPageId: PAGE_ID_CONTROLS,
    pageIds: [PAGE_ID_CONTROLS, PAGE_ID_NAVIGATION, PAGE_ID_FEEDBACK, PAGE_ID_MOTION],
  },
  {
    id: ROUTE_GROUP_ID_SYSTEM,
    pathSegment: ROUTE_GROUP_ID_SYSTEM,
    indexPageId: PAGE_ID_SETTINGS,
    pageIds: [PAGE_ID_SETTINGS],
  },
];
