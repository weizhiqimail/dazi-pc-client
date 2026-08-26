import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '.';

describe('Checkbox', () => {
  it('reports its next checked state', () => {
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} onChange={onChange}>
        保留设置
      </Checkbox>,
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
