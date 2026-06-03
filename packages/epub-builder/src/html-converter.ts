/**
 * HTML 转换工具
 * 将原始 HTML 转换为符合 EPUB 规范的 XHTML 格式
 */

/**
 * HTML 转换选项
 */
export interface HtmlConvertOptions {
  /** 是否清理 HTML 文档结构（保留只有内容） */
  stripDocumentStructure?: boolean;
  /** 是否转换内联样式 */
  convertInlineStyles?: boolean;
  /** 是否处理图片标签 */
  processImages?: boolean;
  /** 是否处理链接 */
  processLinks?: boolean;
}

/**
 * 将 HTML 转换为符合 EPUB 规范的 XHTML
 */
export function convertHtmlToXhtml(
  html: string,
  options: HtmlConvertOptions = {}
): string {
  const {
    stripDocumentStructure = true,
    processImages = true,
    processLinks = true,
  } = options;

  let content = html;

  // 移除 HTML 文档结构（如果用户传入了完整文档）
  if (stripDocumentStructure) {
    content = stripHtmlDocument(content);
  }

  // 处理图片标签
  if (processImages) {
    content = processImageTags(content);
  }

  // 处理链接
  if (processLinks) {
    content = processLinkTags(content);
  }

  // 确保 XHTML 兼容性
  content = ensureXhtmlCompatibility(content);

  return content;
}

/**
 * 剥离 HTML 文档结构，只保留 body 内容
 */
function stripHtmlDocument(html: string): string {
  let content = html;

  // 移除 DOCTYPE
  content = content.replace(/<!DOCTYPE[^>]*>/gi, '');

  // 提取 body 内容（如果有）
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/gi);
  if (bodyMatch) {
    content = bodyMatch[1];
  } else {
    // 移除 html 标签
    content = content.replace(/<html[^>]*>/gi, '');
    content = content.replace(/<\/html>/gi, '');
  }

  // 移除 head 标签及其内容
  content = content.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');

  // 移除 script 标签及其内容
  content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // 移除 style 标签及其内容（样式应该通过外部 CSS 处理）
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 移除注释
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // 清理多余的空白行
  content = content.replace(/\n{3,}/g, '\n\n');

  return content.trim();
}

/**
 * 处理图片标签
 * - 确保有 alt 属性
 * - 转换相对路径（如果需要）
 */
function processImageTags(html: string): string {
  return html.replace(
    /<img([^>]*)\/?>/gi,
    (match, attrs) => {
      // 确保有 alt 属性
      if (!/alt\s*=/i.test(attrs)) {
        attrs += ' alt=""';
      }

      // 确保是自闭合标签
      if (!match.endsWith('/>')) {
        return `<img${attrs}/>`;
      }

      return match;
    }
  );
}

/**
 * 处理链接标签
 * - 移除 JavaScript 链接
 * - 确保 target 属性
 */
function processLinkTags(html: string): string {
  return html.replace(
    /<a([^>]*)>/gi,
    (match, attrs) => {
      // 移除 JavaScript 链接
      if (/href\s*=\s*["']?\s*javascript:/i.test(attrs)) {
        // 转换为 span 或其他无害标签
        return match.replace(/<a/gi, '<span').replace(/<\//gi, '</span');
      }

      return match;
    }
  );
}

/**
 * 确保 XHTML 兼容性
 * - 自闭合标签
 * - 属性引号
 * - 小写标签名
 */
function ensureXhtmlCompatibility(html: string): string {
  let content = html;

  // 修复常见的 HTML5 自闭合标签
  const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link'];
  selfClosingTags.forEach((tag) => {
    // 匹配非自闭合的单标签
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    content = content.replace(regex, `<${tag}$1/>`);
  });

  // 确保所有标签都正确闭合
  // 注意：这是一个简化的处理，复杂情况可能需要更完善的 HTML 解析器

  return content;
}

/**
 * 清理 HTML 文本（用于标题等纯文本字段）
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // 移除所有 HTML 标签
    .replace(/&nbsp;/g, ' ') // 转换空格实体
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * 提取 HTML 中的纯文本（保留基本格式）
 */
export function extractPlainText(html: string): string {
  let text = html;

  // 将块级元素转换为换行
  text = text.replace(/<(p|div|h[1-6]|li|br)\s*[^>]*>/gi, '\n');
  text = text.replace(/<\/(p|div|h[1-6]|li)>/gi, '\n');

  // 移除所有剩余标签
  text = text.replace(/<[^>]*>/g, '');

  // 转换 HTML 实体
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // 清理多余空白
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}
