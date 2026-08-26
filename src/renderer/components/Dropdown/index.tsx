import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { DropdownProps } from './types';
import './styles.less';

/** 锚定式命令菜单，点击菜单外部时自动关闭。 */
export function Dropdown({ trigger, children }: DropdownProps): ReactElement {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);
  return (
    <div className="dropdown" ref={rootRef}>
      {trigger({ onClick: () => setOpen((value) => !value), expanded: open })}
      {open && (
        <div className="dropdown__menu" role="menu">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
