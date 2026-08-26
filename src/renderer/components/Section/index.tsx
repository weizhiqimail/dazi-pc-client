import type { ReactElement } from 'react';
import type { SectionProps } from './types';
import './styles.less';

/** 带边框和稳定标题层级的工作区分组。 */
export function Section({ title, description, children, className = '' }: SectionProps): ReactElement {
  return (
    <section className={`section ${className}`}>
      <header className="section__header">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </header>
      <div className="section__body">{children}</div>
    </section>
  );
}
