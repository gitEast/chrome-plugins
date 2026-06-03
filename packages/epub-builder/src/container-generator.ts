/**
 * container.xml 生成器
 * 生成 META-INF/container.xml 文件，指向主 OPF 文件
 */
export class ContainerGenerator {
  /**
   * 生成 container.xml 内容
   * @param opfPath OPF 文件路径（相对于 EPUB 根目录）
   */
  generate(opfPath: string = 'OEBPS/content.opf'): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="${opfPath}" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  }
}
