/** Markdown 渲染默认值和生成文档的元数据。 */
export const MARKDOWN_CONFIG = {
  parser: { html: false, linkify: true, typographer: true, breaks: false },
  document: {
    language: 'zh-CN',
    charset: 'UTF-8',
    viewport: 'width=device-width, initial-scale=1.0',
    title: 'Markdown Document',
  },
  maximumSaveLength: 20_000_000,
} as const;
