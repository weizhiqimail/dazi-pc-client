import type { ReactElement, ReactNode } from 'react';
import './styles.less';

/** 键盘快捷键标记。 */
export function Kbd({ children }: { children: ReactNode }): ReactElement {
  return <kbd>{children}</kbd>;
}
