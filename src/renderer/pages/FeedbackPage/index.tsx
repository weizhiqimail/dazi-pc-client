import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { Button } from '@/components/Button';
import { InlineMessage } from '@/components/InlineMessage';
import { Section } from '@/components/Section';
import { useToast } from '@/components/ToastProvider/useToast';
import { UI_TIMINGS } from '@/config/app.config';
import './styles.less';

/** 展示临时通知、常驻提示、校验和加载反馈。 */
export function FeedbackPage(): ReactElement {
  const { push } = useToast();
  const [loading, setLoading] = useState(false);
  const simulateSave = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), UI_TIMINGS.simulatedSaveDurationMs);
  };
  return (
    <>
      <Section title="轻量通知" description="操作完成后不打断用户，通知数秒后自动消失。">
        <div className="control-row">
          <Button onClick={() => push('保存成功', '设置已写入本地。')}>成功通知</Button>
          <Button onClick={() => push('已加入队列', '前面还有 2 个任务。')}>队列通知</Button>
          <Button onClick={() => push('已复制到剪贴板')}>简短通知</Button>
        </div>
      </Section>
      <Section title="页面内消息" description="与当前工作内容相关的信息应保留在工作区内。">
        <div className="message-stack">
          <InlineMessage tone="info" title="提示">
            <Info size={14} /> 可以拖入文件，也可以使用“打开文件”。
          </InlineMessage>
          <InlineMessage tone="success" title="处理完成">
            <CheckCircle2 size={14} /> 已生成 3 个输出文件。
          </InlineMessage>
          <InlineMessage tone="warning" title="空间不足">
            <CircleAlert size={14} /> 建议保留至少 2 GB 可用空间。
          </InlineMessage>
          <InlineMessage tone="danger" title="无法访问">
            <X size={14} /> 当前目录没有写入权限。
          </InlineMessage>
        </div>
      </Section>
      <Section title="加载状态" description="只有真实等待时才使用加载状态，按钮宽度不会跳动。">
        <Button variant="primary" disabled={loading} onClick={simulateSave}>
          {loading ? (
            <>
              <span className="spinner" /> 正在保存…
            </>
          ) : (
            '模拟保存'
          )}
        </Button>
      </Section>
    </>
  );
}
