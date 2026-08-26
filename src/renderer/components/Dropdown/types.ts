import type { ReactNode } from 'react';
export interface DropdownProps {
  trigger: (props: { onClick: () => void; expanded: boolean }) => ReactNode;
  children: (close: () => void) => ReactNode;
}
