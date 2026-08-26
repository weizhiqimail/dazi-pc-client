import { ChevronDown, Menu, Search } from 'lucide-react';
import type { ReactElement } from 'react';
import { NAVIGATION_POSITION_FOOTER, NAVIGATION_POSITION_MAIN } from '@/router/constants';
import { NAVIGATION_GROUP_LIST } from '@/router/navigation-config';
import { getPageById } from '@/router/page-registry';
import { IconButton } from '@/components/IconButton';
import { Kbd } from '@/components/Kbd';
import type { SidebarProps } from './types';
import './styles.less';

/** 支持两级折叠的桌面导航，系统分组固定在底部。 */
export function Sidebar({
  activePath,
  open,
  expandedGroups,
  onToggleSidebar,
  onToggleGroup,
  onNavigate,
  onOpenCommandPalette,
}: SidebarProps): ReactElement {
  const renderGroup = (group: (typeof NAVIGATION_GROUP_LIST)[number]) => {
    const GroupIcon = group.icon;
    const expanded = expandedGroups.has(group.id);
    const pages = group.pageIds.map(getPageById);
    return (
      <div className="nav-group" key={group.id}>
        <button
          className="nav-parent"
          aria-expanded={expanded}
          title={!open ? group.label : undefined}
          onClick={() => (open ? onToggleGroup(group.id) : onToggleSidebar())}
        >
          <GroupIcon size={16} />
          <span>{group.label}</span>
          <ChevronDown size={13} className={expanded ? 'is-expanded' : ''} />
        </button>
        {expanded && open && (
          <div className="nav-children">
            {pages.map((page) => {
              const PageIcon = page.icon;
              return (
                <button
                  key={page.id}
                  className={`nav-item ${activePath === page.path ? 'is-active' : ''}`}
                  aria-current={activePath === page.path ? 'page' : undefined}
                  onClick={() => onNavigate(page.path)}
                >
                  <PageIcon size={16} />
                  <span>{page.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  const mainGroups = NAVIGATION_GROUP_LIST.filter((group) => group.position === NAVIGATION_POSITION_MAIN);
  const footerGroups = NAVIGATION_GROUP_LIST.filter((group) => group.position === NAVIGATION_POSITION_FOOTER);
  return (
    <aside className="sidebar" aria-label="主导航">
      <div className="sidebar__top">
        <IconButton label={open ? '收起导航' : '展开导航'} onClick={onToggleSidebar}>
          <Menu size={16} />
        </IconButton>
        {open && (
          <button className="search-trigger" onClick={onOpenCommandPalette}>
            <Search size={15} />
            <span>搜索页面</span>
            <Kbd>Ctrl K</Kbd>
          </button>
        )}
      </div>
      <nav className="nav-list">{mainGroups.map(renderGroup)}</nav>
      <div className="sidebar-system">{footerGroups.map(renderGroup)}</div>
      {open && <div className="sidebar__footer">交互原型 · v0.1</div>}
    </aside>
  );
}
