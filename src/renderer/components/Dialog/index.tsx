import { useEffect, useRef, type ReactElement } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import type { DialogProps } from './types';
import './styles.less';

/** 支持 Escape、遮罩关闭、关闭按钮和焦点恢复的模态窗口。 */
export function Dialog({
  open,
  title,
  description,
  onClose,
  children,
  footer,
}: DialogProps): ReactElement | null {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="dialog-layer"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog__header">
          <div>
            <h2 id="dialog-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <IconButton ref={closeRef} label="关闭" onClick={onClose}>
            <X size={16} />
          </IconButton>
        </div>
        {children && <div className="dialog__body">{children}</div>}
        {footer && <div className="dialog__footer">{footer}</div>}
      </div>
    </div>
  );
}
