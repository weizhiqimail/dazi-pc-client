import { describe, expect, it } from 'vitest';
import { NAVIGATION_GROUP_LIST } from './navigation-config';
import { PAGE_LIST, PAGE_REGISTRY } from './page-registry';
import { ROUTE_GROUP_LIST } from './route-config';

describe('页面注册与组合配置', () => {
  it('页面 ID 和页面路径保持唯一', () => {
    expect(new Set(PAGE_LIST.map((page) => page.id)).size).toBe(PAGE_LIST.length);
    expect(new Set(PAGE_LIST.map((page) => page.path)).size).toBe(PAGE_LIST.length);
  });

  it('路由配置引用的页面全部存在', () => {
    for (const group of ROUTE_GROUP_LIST) {
      expect(PAGE_REGISTRY.has(group.indexPageId)).toBe(true);
      for (const pageId of group.pageIds) expect(PAGE_REGISTRY.has(pageId)).toBe(true);
    }
  });

  it('导航配置引用的页面全部存在', () => {
    for (const group of NAVIGATION_GROUP_LIST) {
      for (const pageId of group.pageIds) expect(PAGE_REGISTRY.has(pageId)).toBe(true);
    }
  });
});
