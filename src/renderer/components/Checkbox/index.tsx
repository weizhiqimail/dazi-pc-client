import type { ReactElement } from 'react';
import { Check } from 'lucide-react';
import type { CheckboxProps } from './types';
import './styles.less';

/** 支持键盘操作且保持紧凑点击区域的复选框。 */
export function Checkbox({ checked, onChange, children }: CheckboxProps): ReactElement {
  return (
    <label className="check-control">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="checkbox-box" aria-hidden="true">
        <Check size={12} />
      </span>
      <span>{children}</span>
    </label>
  );
}
