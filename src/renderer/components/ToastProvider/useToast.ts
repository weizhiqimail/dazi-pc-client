import { useContext } from 'react';
import { ToastContext } from './context';

/** 获取最近一层的 Toast 消息分发器。 */
export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used in ToastProvider');
  return value;
}
