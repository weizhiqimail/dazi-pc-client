import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from '@/components/ToastProvider';
import { ROUTER } from '@/router';
import '@/styles/global.less';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');

createRoot(root).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={ROUTER} />
    </ToastProvider>
  </StrictMode>,
);
