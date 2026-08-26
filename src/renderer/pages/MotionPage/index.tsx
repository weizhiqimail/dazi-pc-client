import { CheckCircle2, Plus, X } from 'lucide-react';
import { useEffect, useState, type ReactElement } from 'react';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Section } from '@/components/Section';
import { UI_TIMINGS } from '@/config/app.config';
import { INITIAL_TASK_STEPS, TASK_PROGRESS } from './config';
import './styles.less';

/** 展示可取消的任务进度和克制的列表过渡效果。 */
export function MotionPage(): ReactElement {
  const [progress, setProgress] = useState<number>(TASK_PROGRESS.minimum);
  const [running, setRunning] = useState(false);
  const [items, setItems] = useState<string[]>([...INITIAL_TASK_STEPS]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () =>
        setProgress((value) => {
          if (value >= TASK_PROGRESS.maximum) {
            setRunning(false);
            window.clearInterval(timer);
            return TASK_PROGRESS.maximum;
          }
          return Math.min(TASK_PROGRESS.maximum, value + TASK_PROGRESS.increment);
        }),
      UI_TIMINGS.taskTickMs,
    );
    return () => window.clearInterval(timer);
  }, [running]);
  const completed = progress === TASK_PROGRESS.maximum;
  return (
    <>
      <Section title="后台任务" description="切换页面不会制造夸张动画；长任务反馈进度，并且随时可取消。">
        <div className="task-card">
          <div className="task-card__top">
            <div>
              <strong>示例处理任务</strong>
              <span>{completed ? '已完成' : running ? '正在处理示例数据…' : '等待开始'}</span>
            </div>
            <span>{progress}%</span>
          </div>
          <div className="progress-track" aria-label="任务进度" role="progressbar" aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="control-row">
            <Button
              variant="primary"
              disabled={running}
              onClick={() => {
                if (completed) setProgress(TASK_PROGRESS.minimum);
                setRunning(true);
              }}
            >
              {completed ? '重新运行' : '开始任务'}
            </Button>
            <Button disabled={!running} onClick={() => setRunning(false)}>
              暂停
            </Button>
            <Button
              variant="subtle"
              disabled={!running && progress === TASK_PROGRESS.minimum}
              onClick={() => {
                setRunning(false);
                setProgress(TASK_PROGRESS.minimum);
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </Section>
      <Section title="列表动态" description="新增与删除使用很短的状态过渡，避免内容突然跳变。">
        <div className="animated-list">
          {items.map((item) => (
            <div key={item}>
              <CheckCircle2 size={15} />
              <span>{item}</span>
              <IconButton
                label={`删除 ${item}`}
                onClick={() => setItems((values) => values.filter((value) => value !== item))}
              >
                <X size={14} />
              </IconButton>
            </div>
          ))}
        </div>
        <Button
          variant="subtle"
          leading={<Plus size={14} />}
          onClick={() => setItems((values) => [...values, `新步骤 ${values.length + 1}`])}
        >
          添加步骤
        </Button>
      </Section>
    </>
  );
}
