import JSZip from 'jszip'
import { EpubBook } from './EpubBook'
import { EpubBuildOptions } from './types'
import { OpfGenerator } from './opf-generator'
import { NcxGenerator } from './ncx-generator'
import { ContainerGenerator } from './container-generator'
import { convertHtmlToXhtml } from './html-converter'

/**
 * EPUB 构建器
 * 负责将 EpubBook 实例打包成标准的 EPUB 文件（Blob）
 */
export class EpubBuilder {
  private book: EpubBook
  private options: Required<EpubBuildOptions>
  private zip: JSZip

  private opfGenerator: OpfGenerator
  private ncxGenerator: NcxGenerator
  private containerGenerator: ContainerGenerator

  constructor(book: EpubBook, options: EpubBuildOptions = {}) {
    this.book = book
    this.options = {
      css: options.css || this.getDefaultCss(),
      includeNavPage: options.includeNavPage ?? true,
    }

    this.zip = new JSZip()

    this.opfGenerator = new OpfGenerator()
    this.ncxGenerator = new NcxGenerator()
    this.containerGenerator = new ContainerGenerator()
  }

  /**
   * 构建 EPUB 文件
   * @returns Promise<Blob> EPUB 文件的 Blob 对象
   */
  async build(): Promise<Blob> {
    // 1. 添加 mimetype（必须是第一个文件，且不压缩）
    this.addMimetype()

    // 2. 添加 container.xml
    this.addContainer()

    // 3. 添加 CSS 样式表
    this.addStylesheet()

    // 4. 添加章节文件
    await this.addChapters()

    // 5. 添加 NCX 导航文件
    this.addNcx()

    // 6. 添加 OPF 包文件
    this.addOpf()

    // 7. 生成 ZIP（EPUB 本质是 ZIP）
    return this.generateZip()
  }

  /**
   * 添加 mimetype 文件
   * 必须是第一个文件，且不使用压缩
   */
  private addMimetype(): void {
    this.zip.file('mimetype', 'application/epub+zip', {
      compression: 'STORE', // 不压缩
    })
  }

  /**
   * 添加 container.xml 文件
   */
  private addContainer(): void {
    const containerXml = this.containerGenerator.generate('OEBPS/content.opf')
    this.zip.file('META-INF/container.xml', containerXml)
  }

  /**
   * 添加 CSS 样式表
   */
  private addStylesheet(): void {
    if (this.options.css) {
      this.zip.file('OEBPS/style.css', this.options.css)
    }
  }

  /**
   * 添加所有章节文件
   */
  private async addChapters(): Promise<void> {
    const chapters = this.book.getChapters()

    for (const chapter of chapters) {
      // 转换 HTML 为 XHTML
      const xhtmlContent = convertHtmlToXhtml(chapter.content)

      // 生成完整的 XHTML 文档
      const fullXhtml = chapter.toXHTML(this.options.css ? 'style.css' : undefined)

      // 添加到 ZIP
      this.zip.file(`OEBPS/${chapter.filename}`, fullXhtml)
    }
  }

  /**
   * 添加 NCX 导航文件
   */
  private addNcx(): void {
    const chapters = this.book.getChapters()
    const ncxContent = this.ncxGenerator.generate(
      this.book.metadata.title,
      this.book.metadata.identifier,
      chapters
    )

    this.zip.file('OEBPS/toc.ncx', ncxContent)
  }

  /**
   * 添加 OPF 包文件
   */
  private addOpf(): void {
    const chapters = this.book.getChapters()
    const hasCss = !!this.options.css
    const hasNavPage = this.options.includeNavPage

    const opfContent = this.opfGenerator.generate(this.book.metadata, chapters, hasCss, hasNavPage)

    this.zip.file('OEBPS/content.opf', opfContent)
  }

  /**
   * 生成 ZIP 文件
   */
  private async generateZip(): Promise<Blob> {
    return await this.zip.generateAsync({
      type: 'blob',
      mimeType: 'application/epub+zip',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9, // 最高压缩级别
      },
    })
  }

  /**
   * 获取默认 CSS 样式
   */
  private getDefaultCss(): string {
    return `@charset "utf-8";
body {
  font-family: "Georgia", "SimSun", serif;
  line-height: 1.6;
  margin: 1em;
  padding: 0;
  text-align: justify;
  widows: 1;
  orphans: 1;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Georgia", "SimHei", sans-serif;
  line-height: 1.3;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  page-break-after: avoid;
  break-after: avoid;
}

h1 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 2em;
  margin-bottom: 1em;
}

h2 {
  font-size: 1.5em;
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
}

p {
  margin: 0.5em 0;
  text-indent: 2em;
}

p:first-of-type,
h1 + p,
h2 + p,
h3 + p {
  text-indent: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
}

blockquote {
  margin: 1em 2em;
  padding-left: 1em;
  border-left: 3px solid #ccc;
}

ul, ol {
  margin: 0.5em 1em 0.5em 2em;
  padding: 0;
}

li {
  margin: 0.3em 0;
}

hr {
  width: 50%;
  margin: 2em auto;
  border: none;
  border-top: 1px solid #ccc;
}

/* 中文排版优化 */
@media (max-width: 480px) {
  body {
    font-size: 14px;
    margin: 0.8em;
  }
  
  h1 {
    font-size: 1.5em;
  }
  
  h2 {
    font-size: 1.3em;
  }
}

/* 打印样式 */
@media print {
  body {
    font-size: 12pt;
  }
  
  h1, h2, h3 {
    page-break-before: always;
    break-before: always;
  }
}
`
  }
}
