import { useCallback, useState, type ReactElement, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { UI_TIMINGS } from '@/config/app.config';
import { IconButton } from '@/components/IconButton';
import { ToastContext } from './context';
import type { ToastMessage } from './types';
import './styles.less';

/** 应用级临时通知容器。 */
export function ToastProvider({ children }: { children: ReactNode }): ReactElement {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const push = useCallback((title: string, detail?: string) => {
    const id = Date.now();
    setMessages((items) => [...items, { id, title, detail }]);
    window.setTimeout(
      () => setMessages((items) => items.filter((item) => item.id !== id)),
      UI_TIMINGS.toastDurationMs,
    );
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {messages.map((message) => (
          <div className="toast" key={message.id}>
            <Check size={16} />
            <div>
              <strong>{message.title}</strong>
              {message.detail && <span>{message.detail}</span>}
            </div>
            <IconButton
              label="关闭通知"
              onClick={() => setMessages((items) => items.filter((item) => item.id !== message.id))}
            >
              <X size={14} />
            </IconButton>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
