/** 页面 ID 是跨路由、导航和命令系统使用的稳定标识，禁止使用可变配置代替。 */
export const PAGE_ID_OVERVIEW = 'overview' as const;
export const PAGE_ID_MARKDOWN = 'markdown' as const;
export const PAGE_ID_CONTROLS = 'controls' as const;
export const PAGE_ID_NAVIGATION = 'navigation' as const;
export const PAGE_ID_FEEDBACK = 'feedback' as const;
export const PAGE_ID_MOTION = 'motion' as const;
export const PAGE_ID_SETTINGS = 'settings' as const;

/** 一级路由分组 ID。 */
export const ROUTE_GROUP_ID_TOOLBOX = 'toolbox' as const;
export const ROUTE_GROUP_ID_PLAYGROUND = 'playground' as const;
export const ROUTE_GROUP_ID_SYSTEM = 'system' as const;

/** 导航分组 ID 与路由分组相互独立，允许导航自由组合页面。 */
export const NAVIGATION_GROUP_ID_TOOLBOX = 'navigation-toolbox' as const;
export const NAVIGATION_GROUP_ID_PLAYGROUND = 'navigation-playground' as const;
export const NAVIGATION_GROUP_ID_SYSTEM = 'navigation-system' as const;

/** 导航显示位置。 */
export const NAVIGATION_POSITION_MAIN = 'main' as const;
export const NAVIGATION_POSITION_FOOTER = 'footer' as const;

/** 路由系统固定路径。 */
export const ROUTE_PATH_ROOT = '/' as const;
export const ROUTE_PATH_FALLBACK = '*' as const;
