/**
 * EPUB 相关类型定义
 */

/**
 * 书籍元数据
 */
export interface EpubMetadata {
  /** 书籍标题 */
  title: string;
  /** 作者（单个或多个） */
  author: string | string[];
  /** 语言代码，默认 'zh' */
  language?: string;
  /** 出版社 */
  publisher?: string;
  /** 出版日期 */
  date?: string;
  /** 唯一标识符（ISBN 或 UUID） */
  identifier?: string;
  /** 书籍描述 */
  description?: string;
  /** 主题标签 */
  subjects?: string[];
  /** 版权信息 */
  rights?: string;
  /** 封面图片路径（相对于 OEBPS 目录） */
  coverImage?: string;
}

/**
 * 章节选项
 */
export interface ChapterOptions {
  /** 章节标题 */
  title: string;
  /** HTML 内容 */
  content: string;
  /** 自定义 ID，默认自动生成 */
  id?: string;
}

/**
 * 章节实例（内部使用）
 */
export interface Chapter extends ChapterOptions {
  /** 章节 ID */
  id: string;
  /** 文件名 */
  filename: string;
  /** 序号 */
  index: number;
}

/**
 * EPUB 构建选项
 */
export interface EpubBuildOptions {
  /** 自定义 CSS 样式 */
  css?: string;
  /** 是否包含导航页 */
  includeNavPage?: boolean;
}

/**
 * OPF 元数据（内部使用）
 */
export interface OpfMetadata {
  title: string;
  authors: string[];
  language: string;
  identifier: string;
  publisher?: string;
  date?: string;
  description?: string;
  subjects?: string[];
  rights?: string;
  coverImage?: string;
}
