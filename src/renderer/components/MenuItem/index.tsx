import type { ReactElement, ReactNode } from 'react';
import './styles.less';

/** 桌面下拉菜单中的操作项。 */
export function MenuItem({
  children,
  onClick,
  danger = false,
}: {
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
}): ReactElement {
  return (
    <button
      type="button"
      role="menuitem"
      className={danger ? 'menu-item is-danger' : 'menu-item'}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
