import { Copy, Download, FileText } from 'lucide-react';
import { useRef, useState, type ReactElement } from 'react';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { IconButton } from '@/components/IconButton';
import { useToast } from '@/components/ToastProvider/useToast';
import { buildHtmlOutput, buildPreviewDocument } from '@/helpers/markdown';
import { MARKDOWN_INPUT_TABS, MARKDOWN_OUTPUT_TABS, MARKDOWN_PAGE_DEFAULTS } from './config';
import type { MarkdownInputTab, MarkdownOutputTab } from './types';
import './styles.less';

/** 将 Markdown 和可选 CSS 转换为 HTML 片段或完整文档。 */
export function MarkdownPage(): ReactElement {
  const { push } = useToast();
  const [inputTab, setInputTab] = useState<MarkdownInputTab>(MARKDOWN_PAGE_DEFAULTS.inputTab);
  const [outputTab, setOutputTab] = useState<MarkdownOutputTab>(MARKDOWN_PAGE_DEFAULTS.outputTab);
  const [markdown, setMarkdown] = useState('');
  const [css, setCss] = useState('');
  const [html, setHtml] = useState('');
  const [completeDocument, setCompleteDocument] = useState<boolean>(MARKDOWN_PAGE_DEFAULTS.completeDocument);
  const [convertedAsDocument, setConvertedAsDocument] = useState(false);
  const markdownInputRef = useRef<HTMLTextAreaElement>(null);
  const convert = () => {
    setHtml(buildHtmlOutput(markdown, css, completeDocument));
    setConvertedAsDocument(completeDocument);
    setOutputTab(MARKDOWN_PAGE_DEFAULTS.outputTab);
    push('转换完成', 'HTML 已生成，可以预览、复制或保存。');
  };
  const copyHtml = async () => {
    if (html) {
      await navigator.clipboard.writeText(html);
      push('已复制 HTML');
    }
  };
  const saveHtml = async () => {
    if (!html) return;
    const savedPath = await window.desktop.saveHtml(html);
    if (savedPath) push('HTML 已保存', savedPath);
  };
  const clearEditor = () => {
    setMarkdown('');
    setCss('');
    setHtml('');
    setInputTab(MARKDOWN_PAGE_DEFAULTS.inputTab);
    window.requestAnimationFrame(() => markdownInputRef.current?.focus());
  };
  const markdownSelected = inputTab === MARKDOWN_INPUT_TABS.markdown;
  const previewSelected = outputTab === MARKDOWN_OUTPUT_TABS.preview;
  return (
    <div className="markdown-workbench">
      <div className="workbench-toolbar">
        <div>
          <strong>Markdown 转 HTML</strong>
          <span>Markdown 与自定义 CSS 只在本机处理。</span>
        </div>
        <div className="control-row">
          <span className="document-toggle">
            <Checkbox checked={completeDocument} onChange={setCompleteDocument}>
              完整 HTML 文档
            </Checkbox>
          </span>
          <Button variant="subtle" disabled={!markdown && !css && !html} onClick={clearEditor}>
            清空
          </Button>
          <Button variant="primary" onClick={convert}>
            转换为 HTML
          </Button>
        </div>
      </div>
      <div className="editor-split">
        <section className="editor-pane">
          <div className="editor-tabs" role="tablist" aria-label="输入内容">
            <button
              role="tab"
              aria-selected={markdownSelected}
              onClick={() => setInputTab(MARKDOWN_INPUT_TABS.markdown)}
            >
              Markdown
            </button>
            <button
              role="tab"
              aria-selected={!markdownSelected}
              onClick={() => setInputTab(MARKDOWN_INPUT_TABS.css)}
            >
              CSS
            </button>
          </div>
          <div className="editor-meta">
            <span>{markdownSelected ? '输入 Markdown 内容' : '输入应用于预览的 CSS'}</span>
            <span>{markdownSelected ? markdown.length : css.length} 字符</span>
          </div>
          <textarea
            ref={markdownSelected ? markdownInputRef : undefined}
            className="code-editor"
            spellCheck={false}
            aria-label={markdownSelected ? 'Markdown 输入' : 'CSS 输入'}
            placeholder={markdownSelected ? '在这里输入 Markdown…' : '在这里输入 CSS…'}
            value={markdownSelected ? markdown : css}
            onChange={(event) =>
              markdownSelected ? setMarkdown(event.target.value) : setCss(event.target.value)
            }
          />
        </section>
        <section className="editor-pane output-pane">
          <div className="editor-tabs editor-tabs--actions" role="tablist" aria-label="转换结果">
            <div>
              <button
                role="tab"
                aria-selected={previewSelected}
                onClick={() => setOutputTab(MARKDOWN_OUTPUT_TABS.preview)}
              >
                HTML 预览
              </button>
              <button
                role="tab"
                aria-selected={!previewSelected}
                onClick={() => setOutputTab(MARKDOWN_OUTPUT_TABS.source)}
              >
                HTML 源代码
              </button>
            </div>
            <div className="editor-actions">
              <IconButton label="复制 HTML" disabled={!html} onClick={() => void copyHtml()}>
                <Copy size={15} />
              </IconButton>
              <IconButton label="保存 HTML" disabled={!html} onClick={() => void saveHtml()}>
                <Download size={15} />
              </IconButton>
            </div>
          </div>
          <div className="editor-meta">
            <span>{previewSelected ? '渲染结果' : '完整 HTML 文档'}</span>
            <span>{html.length} 字符</span>
          </div>
          {previewSelected ? (
            html ? (
              <iframe
                className="html-preview"
                title="HTML 预览"
                sandbox=""
                srcDoc={buildPreviewDocument(html, css, convertedAsDocument)}
              />
            ) : (
              <div className="editor-empty">
                <FileText size={26} />
                <span>转换后在这里预览 HTML</span>
              </div>
            )
          ) : (
            <textarea
              className="code-editor"
              aria-label="HTML 源代码"
              readOnly
              placeholder="转换后在这里显示 HTML 源代码…"
              value={html}
            />
          )}
        </section>
      </div>
    </div>
  );
}
