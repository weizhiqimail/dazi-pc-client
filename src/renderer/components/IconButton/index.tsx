import { forwardRef } from 'react';
import type { IconButtonProps } from './types';
import './styles.less';

/** 带无障碍名称和提示文字的方形纯图标按钮。 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className = '', children, ...props },
  ref,
) {
  return (
    <button ref={ref} className={`icon-button ${className}`} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
});
