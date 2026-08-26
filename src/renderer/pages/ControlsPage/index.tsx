import { ChevronRight, FolderOpen, Play, Plus, Trash2 } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Dialog } from '@/components/Dialog';
import { Divider } from '@/components/Divider';
import { Dropdown } from '@/components/Dropdown';
import { IconButton } from '@/components/IconButton';
import { MenuItem } from '@/components/MenuItem';
import { Section } from '@/components/Section';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SelectField } from '@/components/SelectField';
import { Switch } from '@/components/Switch';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/ToastProvider/useToast';
import { CONTROL_PAGE_DEFAULTS, ENCODING_OPTIONS, MODE_OPTIONS, type ControlMode } from './config';
import './styles.less';

/** 可复用表单和命令组件的交互展示页。 */
export function ControlsPage(): ReactElement {
  const { push } = useToast();
  const [name, setName] = useState<string>(CONTROL_PAGE_DEFAULTS.workspaceName);
  const [format, setFormat] = useState<string>(CONTROL_PAGE_DEFAULTS.encoding);
  const [autosave, setAutosave] = useState<boolean>(CONTROL_PAGE_DEFAULTS.autosave);
  const [remember, setRemember] = useState<boolean>(CONTROL_PAGE_DEFAULTS.rememberDirectory);
  const [mode, setMode] = useState<ControlMode>(CONTROL_PAGE_DEFAULTS.mode);
  const [dialog, setDialog] = useState(false);
  return (
    <div className="two-column">
      <Section title="按钮与命令" description="视觉优先级只表达操作优先级，不用颜色装饰页面。">
        <div className="control-row">
          <Button
            variant="primary"
            leading={<Play size={14} />}
            onClick={() => push('任务已启动', '这是主操作反馈。')}
          >
            开始处理
          </Button>
          <Button
            leading={<FolderOpen size={14} />}
            onClick={() => push('文件选择器', '正式功能会调用系统原生对话框。')}
          >
            打开文件
          </Button>
          <Button variant="subtle" onClick={() => setDialog(true)}>
            打开对话框
          </Button>
          <Button
            variant="danger"
            leading={<Trash2 size={14} />}
            onClick={() => push('未执行删除', '危险操作需要二次确认。')}
          >
            删除
          </Button>
          <Button disabled>不可用</Button>
        </div>
        <Divider />
        <div className="toolbar" role="toolbar" aria-label="示例工具栏">
          <IconButton label="新建">
            <Plus size={15} />
          </IconButton>
          <IconButton label="打开">
            <FolderOpen size={15} />
          </IconButton>
          <IconButton label="删除">
            <Trash2 size={15} />
          </IconButton>
          <span className="toolbar__separator" />
          <Dropdown
            trigger={({ onClick, expanded }) => (
              <Button variant="subtle" onClick={onClick} aria-expanded={expanded}>
                更多 <ChevronRight className="rotate-90" size={13} />
              </Button>
            )}
          >
            {(close) => (
              <>
                <MenuItem
                  onClick={() => {
                    push('已复制');
                    close();
                  }}
                >
                  复制项目
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    push('已导出');
                    close();
                  }}
                >
                  导出配置
                </MenuItem>
                <Divider />
                <MenuItem
                  danger
                  onClick={() => {
                    push('未执行清除');
                    close();
                  }}
                >
                  清除历史
                </MenuItem>
              </>
            )}
          </Dropdown>
        </div>
      </Section>
      <Section title="表单与选择" description="紧凑但不拥挤，错误与说明占用稳定空间。">
        <div className="form-stack">
          <TextField
            label="工作区名称"
            value={name}
            onChange={(event) => setName(event.target.value)}
            hint="名称只用于区分本地配置。"
          />
          <TextField label="路径示例" value="D:\\workspace\\samples" readOnly />
          <TextField label="错误状态" defaultValue="bad/name" error="名称不能包含斜杠。" />
          <SelectField label="文本编码" value={format} onChange={setFormat}>
            {ENCODING_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <SegmentedControl label="操作模式" value={mode} onChange={setMode} options={MODE_OPTIONS} />
          <Checkbox checked={remember} onChange={setRemember}>
            记住上次打开的目录
          </Checkbox>
          <Switch
            checked={autosave}
            onChange={setAutosave}
            label="自动保存"
            description="修改后在本机自动保留草稿。"
          />
        </div>
      </Section>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="确认交互方式"
        description="按 Escape、点击遮罩或右上角都可以关闭。"
        footer={
          <>
            <Button onClick={() => setDialog(false)}>取消</Button>
            <Button
              variant="primary"
              onClick={() => {
                setDialog(false);
                push('设置已保存');
              }}
            >
              保存更改
            </Button>
          </>
        }
      >
        <p>对话框只处理必须中断当前流程的内容。普通反馈应使用页面内状态或轻量通知。</p>
      </Dialog>
    </div>
  );
}
