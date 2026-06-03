import { EpubChapter } from './EpubChapter'

/**
 * OPF 文件生成器
 * 生成 content.opf 文件，包含元数据、清单和阅读顺序
 */
export class OpfGenerator {
  /**
   * 生成 content.opf 内容
   */
  generate(
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
    },
    chapters: EpubChapter[],
    hasCss: boolean,
    hasNavPage: boolean
  ): string {
    const now = new Date().toISOString().replace(/\.\d{3}/, '')

    return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
${this.generateMetadata(metadata, now)}
${this.generateManifest(chapters, hasCss, hasNavPage)}
${this.generateSpine(chapters)}
${this.generateGuide(metadata.coverImage)}
</package>`
  }

  /**
   * 生成 metadata 部分
   */
  private generateMetadata(
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
    },
    modifiedDate: string
  ): string {
    let xml = `  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">urn:uuid:${metadata.identifier}</dc:identifier>
    <dc:title>${this.escapeXml(metadata.title)}</dc:title>`

    // 作者
    metadata.authors.forEach((author, index) => {
      const role = index === 0 ? ' primary' : ''
      xml += `\n    <dc:creator id="creator${index}">${this.escapeXml(author)}</dc:creator>`
    })

    xml += `\n    <dc:language>${metadata.language}</dc:language>`

    // 可选元数据
    if (metadata.publisher) {
      xml += `\n    <dc:publisher>${this.escapeXml(metadata.publisher)}</dc:publisher>`
    }
    if (metadata.date) {
      xml += `\n    <dc:date>${metadata.date}</dc:date>`
    }
    if (metadata.description) {
      xml += `\n    <dc:description>${this.escapeXml(metadata.description)}</dc:description>`
    }
    if (metadata.subjects && metadata.subjects.length > 0) {
      metadata.subjects.forEach((subject) => {
        xml += `\n    <dc:subject>${this.escapeXml(subject)}</dc:subject>`
      })
    }
    if (metadata.rights) {
      xml += `\n    <dc:rights>${this.escapeXml(metadata.rights)}</dc:rights>`
    }

    xml += `\n  </metadata>`

    // EPUB 3.0 修改时间
    xml += `\n  <meta property="dcterms:modified">${modifiedDate}Z</meta>`

    // 封面图片标识
    if (metadata.coverImage) {
      xml += `\n  <meta name="cover" content="cover-image"/>`
    }

    return xml
  }

  /**
   * 生成 manifest 部分
   */
  private generateManifest(chapters: EpubChapter[], hasCss: boolean, hasNavPage: boolean): string {
    let xml = `  <manifest>`

    // 导航文件（EPUB 3.0）
    if (hasNavPage) {
      xml += `\n    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`
    }

    // NCX 导航文件（EPUB 2.0 兼容）
    xml += `\n    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`

    // CSS 样式表
    if (hasCss) {
      xml += `\n    <item id="style" href="style.css" media-type="text/css"/>`
    }

    // 封面图片
    xml += `\n    <item id="cover-image" href="cover.jpg" media-type="image/jpeg" properties="cover-image"/>`

    // 章节
    chapters.forEach((chapter) => {
      xml += `\n    <item id="${chapter.id}" href="${chapter.filename}" media-type="application/xhtml+xml"/>`
    })

    xml += `\n  </manifest>`

    return xml
  }

  /**
   * 生成 spine 部分（阅读顺序）
   */
  private generateSpine(chapters: EpubChapter[]): string {
    let xml = `  <spine toc="ncx">`

    chapters.forEach((chapter) => {
      xml += `\n    <itemref idref="${chapter.id}"/>`
    })

    xml += `\n  </spine>`

    return xml
  }

  /**
   * 生成 guide 部分（可选）
   */
  private generateGuide(coverImage?: string): string {
    if (!coverImage) {
      return ''
    }

    return `  <guide>
    <reference type="cover" title="Cover" href="cover.xhtml"/>
  </guide>`
  }

  /**
   * XML 转义
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
}
