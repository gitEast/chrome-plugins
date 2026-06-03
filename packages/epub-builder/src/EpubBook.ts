import { EpubMetadata, Chapter, ChapterOptions } from './types'
import { EpubChapter } from './EpubChapter'

/**
 * EPUB 书籍类
 * 管理书籍的元数据和所有章节
 */
export class EpubBook {
  metadata: {
    title: string
    authors: string[]
    language: string
    identifier: string
    publisher?: string
    date?: string
    description?: string
    subjects?: string[]
    rights?: string
    coverImage?: string
  }

  private chapters: EpubChapter[] = []

  constructor(metadata: EpubMetadata) {
    this.metadata = {
      title: metadata.title,
      authors: Array.isArray(metadata.author) ? metadata.author : [metadata.author],
      language: metadata.language || 'zh',
      identifier: metadata.identifier || this.generateUUID(),
      publisher: metadata.publisher,
      date: metadata.date || new Date().toISOString().split('T')[0],
      description: metadata.description,
      subjects: metadata.subjects,
      rights: metadata.rights,
      coverImage: metadata.coverImage,
    }
  }

  /**
   * 添加章节
   */
  addChapter(options: ChapterOptions): void {
    const index = this.chapters.length + 1
    const chapter = new EpubChapter(options, index)
    this.chapters.push(chapter)
  }

  /**
   * 批量添加章节
   */
  addChapters(chapters: ChapterOptions[]): void {
    chapters.forEach((chapter) => this.addChapter(chapter))
  }

  /**
   * 获取所有章节
   */
  getChapters(): EpubChapter[] {
    return [...this.chapters]
  }

  /**
   * 获取章节数量
   */
  getChapterCount(): number {
    return this.chapters.length
  }

  /**
   * 根据 ID 获取章节
   */
  getChapterById(id: string): EpubChapter | undefined {
    return this.chapters.find((ch) => ch.id === id)
  }

  /**
   * 移除章节
   */
  removeChapter(id: string): boolean {
    const index = this.chapters.findIndex((ch) => ch.id === id)
    if (index !== -1) {
      this.chapters.splice(index, 1)
      // 重新编号
      this.chapters.forEach((chapter, idx) => {
        Object.defineProperty(chapter, 'index', { value: idx + 1 })
      })
      return true
    }
    return false
  }

  /**
   * 清空所有章节
   */
  clearChapters(): void {
    this.chapters = []
  }

  /**
   * 生成 UUID（用于书籍唯一标识）
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
