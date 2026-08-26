import { ChevronRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_ID_CONTROLS, PAGE_ID_FEEDBACK, PAGE_ID_MOTION, PAGE_ID_NAVIGATION } from '@/router/constants';
import { getPageById } from '@/router/page-registry';
import { InlineMessage } from '@/components/InlineMessage';
import { Section } from '@/components/Section';
import './styles.less';

/** 用于检查基础交互能力的入口页面。 */
export function OverviewPage(): ReactElement {
  const navigate = useNavigate();
  const cards = [PAGE_ID_CONTROLS, PAGE_ID_NAVIGATION, PAGE_ID_FEEDBACK, PAGE_ID_MOTION].map(getPageById);
  const principles = [
    '边界明确，减少无意义卡片',
    '鼠标、键盘和右键都是一等交互',
    '高频操作直接出现，低频操作收纳',
    '状态变化可见，长任务始终可取消',
  ];
  return (
    <>
      <InlineMessage title="这是交互实验场">
        所有控件都可以实际操作。建议同时使用鼠标和键盘测试，而不是只看静态外观。
      </InlineMessage>
      <div className="overview-grid">
        {cards.map((page) => {
          const CardIcon = page.icon;
          return (
            <button className="overview-card" onClick={() => navigate(page.path)} key={page.id}>
              <span className="overview-card__icon">
                <CardIcon size={19} />
              </span>
              <span>
                <strong>{page.name}</strong>
                <small>{page.meta.description}</small>
              </span>
              <ChevronRight size={15} />
            </button>
          );
        })}
      </div>
      <Section title="设计基线" description="不是 Windows 11 复刻，而是偏 Windows 10 密度的现代桌面工作区。">
        <div className="principle-list">
          {principles.map((text, index) => (
            <div key={text}>
              <span>{index + 1}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
