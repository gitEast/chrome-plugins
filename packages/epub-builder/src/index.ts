/**
 * EPUB 生成工具模块
 * 提供从 HTML 内容生成 EPUB 电子书的完整功能
 */

export { EpubBook } from './EpubBook'
export { EpubChapter } from './EpubChapter'
export { EpubBuilder } from './EpubBuilder'
export { OpfGenerator } from './opf-generator'
export { NcxGenerator } from './ncx-generator'
export { ContainerGenerator } from './container-generator'
export { convertHtmlToXhtml, sanitizeText, extractPlainText } from './html-converter'

// 类型导出
export type { EpubMetadata, ChapterOptions, Chapter, EpubBuildOptions } from './types'
