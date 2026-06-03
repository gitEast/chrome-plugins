import { EpubChapter } from './EpubChapter';

/**
 * NCX 导航文件生成器
 * 生成 toc.ncx 文件，提供 EPUB 2.0 兼容的导航结构
 */
export class NcxGenerator {
  /**
   * 生成 toc.ncx 内容
   */
  generate(
    title: string,
    identifier: string,
    chapters: EpubChapter[]
  ): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
${this.generateHead(identifier)}
${this.generateDocTitle(title)}
${this.generateNavMap(chapters)}
</ncx>`;
  }

  /**
   * 生成 head 部分
   */
  private generateHead(identifier: string): string {
    return `  <head>
    <meta name="dtb:uid" content="urn:uuid:${identifier}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>`;
  }

  /**
   * 生成文档标题
   */
  private generateDocTitle(title: string): string {
    return `  <docTitle>
    <text>${this.escapeXml(title)}</text>
  </docTitle>`;
  }

  /**
   * 生成导航地图
   */
  private generateNavMap(chapters: EpubChapter[]): string {
    let xml = `  <navMap>`;

    chapters.forEach((chapter, index) => {
      xml += `\n${this.generateNavPoint(chapter, index + 1)}`;
    });

    xml += `\n  </navMap>`;

    return xml;
  }

  /**
   * 生成单个导航点
   */
  private generateNavPoint(chapter: EpubChapter, playOrder: number): string {
    return `    <navPoint id="${chapter.id}" playOrder="${playOrder}">
      <navLabel>
        <text>${this.escapeXml(chapter.title)}</text>
      </navLabel>
      <content src="${chapter.filename}"/>
    </navPoint>`;
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
      .replace(/'/g, '&apos;');
  }
}
