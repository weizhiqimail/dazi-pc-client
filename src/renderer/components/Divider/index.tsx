import type { HTMLAttributes, ReactElement } from 'react';
import './styles.less';

/** 用于命令区和设置区的视觉分隔线。 */
export function Divider(props: HTMLAttributes<HTMLHRElement>): ReactElement {
  return <hr className="divider" {...props} />;
}
