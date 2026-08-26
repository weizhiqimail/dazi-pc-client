import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SegmentedControl } from '.';

describe('SegmentedControl', () => {
  it('marks the selected option', () => {
    render(
      <SegmentedControl
        label="密度"
        value="compact"
        onChange={() => undefined}
        options={[
          { value: 'compact', label: '紧凑' },
          { value: 'roomy', label: '舒适' },
        ]}
      />,
    );
    expect(screen.getByRole('radio', { name: '紧凑' })).toHaveAttribute('aria-checked', 'true');
  });
});
