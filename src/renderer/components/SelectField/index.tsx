import { useId, type ReactElement } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SelectFieldProps } from './types';
import './styles.less';

/** 使用统一桌面样式封装的原生选择框。 */
export function SelectField({ label, value, onChange, children }: SelectFieldProps): ReactElement {
  const id = useId();
  return (
    <label className="select-field" htmlFor={id}>
      <span>{label}</span>
      <span className="select-wrap">
        <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
          {children}
        </select>
        <ChevronDown size={14} aria-hidden="true" />
      </span>
    </label>
  );
}
