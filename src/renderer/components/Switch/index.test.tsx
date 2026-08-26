import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Switch } from '.';

describe('Switch', () => {
  it('uses native switch semantics', () => {
    render(<Switch checked onChange={() => undefined} label="自动保存" />);
    expect(screen.getByRole('switch')).toBeChecked();
  });
});
