import { App } from '@/App';
import { createElement } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { PAGE_ID_OVERVIEW, ROUTE_PATH_FALLBACK, ROUTE_PATH_ROOT } from './constants';
import { getPageById } from './page-registry';
import { ROUTE_GROUP_LIST } from './route-config';

const HOME_PAGE = getPageById(PAGE_ID_OVERVIEW);

/** 根据页面 ID 路由配置生成 React Router 的二级路由。 */
function createRouteGroups(): RouteObject[] {
  return ROUTE_GROUP_LIST.map((group) => {
    const indexPage = getPageById(group.indexPageId);
    return {
      path: group.pathSegment,
      children: [
        { index: true, element: <Navigate to={indexPage.path} replace /> },
        ...group.pageIds.map((pageId) => {
          const page = getPageById(pageId);
          return {
            path: page.routeSegment,
            element: createElement(page.component),
          } satisfies RouteObject;
        }),
      ],
    } satisfies RouteObject;
  });
}

/** 根路由、一级路由、二级页面路由以及统一的首页回退规则。 */
export const ROUTE_LIST: RouteObject[] = [
  {
    path: ROUTE_PATH_ROOT,
    element: <App />,
    children: [
      { index: true, element: <Navigate to={HOME_PAGE.path} replace /> },
      ...createRouteGroups(),
      { path: ROUTE_PATH_FALLBACK, element: <Navigate to={HOME_PAGE.path} replace /> },
    ],
  },
];
