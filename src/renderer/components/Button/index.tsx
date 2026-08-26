import type { ReactElement } from 'react';
import type { ButtonProps } from './types';
import './styles.less';

/** 标准桌面命令按钮，通过样式区分明确的操作优先级。 */
export function Button({
  variant = 'secondary',
  leading,
  children,
  className = '',
  ...props
}: ButtonProps): ReactElement {
  return (
    <button className={`button button--${variant} ${className}`} {...props}>
      {leading && <span className="button__icon">{leading}</span>}
      <span>{children}</span>
    </button>
  );
}
