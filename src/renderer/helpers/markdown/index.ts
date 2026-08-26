import MarkdownIt from 'markdown-it';
import { MARKDOWN_CONFIG } from '@/config/markdown.config';

const markdownParser = new MarkdownIt(MARKDOWN_CONFIG.parser);

/** 防止用户 CSS 提前结束生成的 style 元素。 */
function escapeStyleClosingTag(css: string): string {
  return css.replace(/<\/style/gi, '<\\/style');
}

/** 将 Markdown 转换成 HTML 片段或完整 HTML 文档。 */
export function buildHtmlOutput(markdown: string, css: string, completeDocument: boolean): string {
  const body = markdownParser.render(markdown);
  if (!completeDocument) return body;
  const { charset, language, title, viewport } = MARKDOWN_CONFIG.document;
  return `<!doctype html>\n<html lang="${language}">\n<head>\n  <meta charset="${charset}">\n  <meta name="viewport" content="${viewport}">\n  <title>${title}</title>\n  <style>\n${escapeStyleClosingTag(css)}\n  </style>\n</head>\n<body>\n${body}</body>\n</html>`;
}

/** 为 HTML 片段添加隔离预览外壳，但不改变复制和保存的输出。 */
export function buildPreviewDocument(html: string, css: string, completeDocument: boolean): string {
  if (completeDocument) return html;
  const { charset, language } = MARKDOWN_CONFIG.document;
  return `<!doctype html><html lang="${language}"><head><meta charset="${charset}"><style>${escapeStyleClosingTag(css)}</style></head><body>${html}</body></html>`;
}
