import type { ReactElement } from 'react';
import type { SwitchProps } from './types';
import './styles.less';

/** 可附带说明文字的二元偏好开关。 */
export function Switch({ checked, onChange, label, description }: SwitchProps): ReactElement {
  return (
    <label className="switch-row">
      <span className="switch-row__copy">
        <span className="switch-row__label">{label}</span>
        {description && <span className="switch-row__description">{description}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="switch-track" aria-hidden="true">
        <span />
      </span>
    </label>
  );
}
