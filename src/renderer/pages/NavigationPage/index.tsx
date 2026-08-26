import { Ellipsis, FileText, Plus } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Section } from '@/components/Section';
import { useToast } from '@/components/ToastProvider/useToast';
import { NAVIGATION_SAMPLE_FILES, NAVIGATION_TABS, type NavigationTabId } from './config';
import './styles.less';

/** 展示桌面标签、列表选择、双击和键盘激活交互。 */
export function NavigationPage(): ReactElement {
  const { push } = useToast();
  const [tab, setTab] = useState<NavigationTabId>(NAVIGATION_TABS[0].id);
  const [selected, setSelected] = useState(1);
  return (
    <>
      <Section title="标签与局部导航" description="标签切换不打开新页面，选中状态始终清楚。">
        <div className="tabs" role="tablist">
          {NAVIGATION_TABS.map(({ id, label }) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="tab-panel" role="tabpanel">
          当前视图：{NAVIGATION_TABS.find((item) => item.id === tab)?.label}
        </div>
      </Section>
      <Section title="桌面列表" description="支持单击选择、双击打开、右侧快捷操作和键盘焦点。">
        <div className="list-toolbar">
          <span>{NAVIGATION_SAMPLE_FILES.length} 个项目</span>
          <Button variant="subtle" leading={<Plus size={14} />}>
            添加
          </Button>
        </div>
        <div className="file-list" role="listbox" aria-label="示例文件">
          {NAVIGATION_SAMPLE_FILES.map((file, index) => (
            <div
              role="option"
              aria-selected={selected === index}
              tabIndex={0}
              className={`file-row ${selected === index ? 'is-selected' : ''}`}
              key={file}
              onClick={() => setSelected(index)}
              onDoubleClick={() => push('打开项目', file)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') push('打开项目', file);
              }}
            >
              <FileText size={16} />
              <span className="file-row__name">{file}</span>
              <span className="file-row__meta">刚刚</span>
              <IconButton
                label={`更多：${file}`}
                onClick={(event) => {
                  event.stopPropagation();
                  push('上下文菜单', file);
                }}
              >
                <Ellipsis size={15} />
              </IconButton>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
