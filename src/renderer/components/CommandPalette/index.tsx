import { ChevronRight, Search } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { PAGE_LIST } from '@/router/page-registry';
import { Dialog } from '@/components/Dialog';
import type { CommandPaletteProps } from './types';
import './styles.less';

/** 以键盘操作为主、支持搜索的页面导航器。 */
export function CommandPalette({ open, onClose, navigate }: CommandPaletteProps): ReactElement {
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);
  const results = useMemo(
    () =>
      PAGE_LIST.filter(
        (page) =>
          page.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
          page.meta.category.includes(query) ||
          page.meta.keywords.some((keyword) =>
            keyword.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
          ),
      ),
    [query],
  );
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="快速跳转"
      description="输入页面名称，也可以直接使用键盘选择。"
    >
      <div className="command-search">
        <Search size={16} />
        <input
          autoFocus
          placeholder="搜索页面…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="command-results">
        {results.map((page) => {
          const ItemIcon = page.icon;
          return (
            <button key={page.id} onClick={() => navigate(page.path)}>
              <ItemIcon size={16} />
              <span>
                {page.name}
                <small>{page.meta.category}</small>
              </span>
              <ChevronRight size={14} />
            </button>
          );
        })}
        {results.length === 0 && <div className="empty-state">没有匹配页面</div>}
      </div>
    </Dialog>
  );
}
