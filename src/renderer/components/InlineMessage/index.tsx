import type { ReactElement } from 'react';
import type { InlineMessageProps } from './types';
import './styles.less';

/** 保留在当前工作区中的上下文反馈信息。 */
export function InlineMessage({ tone = 'info', title, children }: InlineMessageProps): ReactElement {
  return (
    <div className={`inline-message inline-message--${tone}`}>
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}
