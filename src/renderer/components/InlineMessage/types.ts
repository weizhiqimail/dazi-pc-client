import type { ReactNode } from 'react';
export type InlineMessageTone = 'info' | 'success' | 'warning' | 'danger';
export interface InlineMessageProps {
  tone?: InlineMessageTone;
  title: string;
  children: ReactNode;
}
