import { useId, type ReactElement } from 'react';
import type { TextFieldProps } from './types';
import './styles.less';

/** 带标签、提示和校验信息的单行输入框。 */
export function TextField({ label, hint, error, className = '', ...props }: TextFieldProps): ReactElement {
  const id = useId();
  const messageId = `${id}-message`;
  return (
    <label className={`field ${className}`} htmlFor={id}>
      <span className="field__label">{label}</span>
      <input
        id={id}
        className="text-input"
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? messageId : undefined}
        {...props}
      />
      {(error || hint) && (
        <span id={messageId} className={error ? 'field__error' : 'field__hint'}>
          {error || hint}
        </span>
      )}
    </label>
  );
}
