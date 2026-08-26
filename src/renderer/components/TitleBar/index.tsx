import { Blocks } from 'lucide-react';
import type { ReactElement } from 'react';
import './styles.less';

/** 可拖动的应用标题栏，同时保留原生窗口控制按钮。 */
export function TitleBar(): ReactElement {
  return (
    <header className="titlebar">
      <div className="titlebar__drag-region">
        <span className="app-mark">
          <Blocks size={15} />
        </span>
        <span className="titlebar__title">Dazi Toolkit</span>
      </div>
    </header>
  );
}
