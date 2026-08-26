import type { MarkdownInputTab, MarkdownOutputTab } from './types';
export const MARKDOWN_PAGE_DEFAULTS = {
  inputTab: 'markdown' as MarkdownInputTab,
  outputTab: 'preview' as MarkdownOutputTab,
  completeDocument: false,
} as const;
export const MARKDOWN_INPUT_TABS = { markdown: 'markdown', css: 'css' } as const;
export const MARKDOWN_OUTPUT_TABS = { preview: 'preview', source: 'source' } as const;
