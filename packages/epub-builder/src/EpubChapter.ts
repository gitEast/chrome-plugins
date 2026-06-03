import { Chapter, ChapterOptions } from './types';

/**
 * EPUB 章节类
 * 表示电子书中的一个章节
 */
export class EpubChapter implements Chapter {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly filename: string;
  readonly index: number;

  constructor(options: ChapterOptions, index: number) {
    this.index = index;
    this.id = options.id || `chapter_${String(index).padStart(3, '0')}`;
    this.title = options.title;
    this.content = options.content;
    this.filename = `${this.id}.xhtml`;
  }

  /**
   * 生成 XHTML 格式的章节内容
   */
  toXHTML(cssFilename?: string): string {
    const cssLink = cssFilename
      ? `  <link rel="stylesheet" type="text/css" href="${cssFilename}"/>`
      : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <meta charset="UTF-8"/>
  <title>${this.escapeXml(this.title)}</title>
${cssLink}
</head>
<body>
  <h1>${this.escapeXml(this.title)}</h1>
${this.processContent()}
</body>
</html>`;
  }

  /**
   * 处理章节内容，确保符合 XHTML 规范
   */
  private processContent(): string {
    // 清理和转换 HTML 内容
    let content = this.content;

    // 移除可能的 HTML 文档结构（如果用户传入了完整文档）
    content = content.replace(/<!DOCTYPE[^>]*>/gi, '');
    content = content.replace(/<html[^>]*>/gi, '');
    content = content.replace(/<\/html>/gi, '');
    content = content.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    content = content.replace(/<body[^>]*>/gi, '');
    content = content.replace(/<\/body>/gi, '');

    // 清理多余的空白行
    content = content.replace(/\n{3,}/g, '\n\n');

    // 转义特殊字符（保留 HTML 标签）
    // 注意：这里只转义文本内容中的特殊字符，不转义标签
    // 由于内容可能是复杂的 HTML，我们不做过度处理
    // 假设用户输入的是合法的 HTML/XHTML

    return `  ${content.trim()}`;
  }

  /**
   * XML 转义（用于标题等纯文本内容）
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
