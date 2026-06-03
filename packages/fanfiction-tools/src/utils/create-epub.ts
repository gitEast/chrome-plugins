import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface IBookMetadata {
  title: string
  author: string
}
interface IChapter {
  title: string
  content: string
}
interface IBook {
  metadata: IBookMetadata
  chapters: IChapter[]
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const createEpub = async (book: IBook) => {
  const zip = new JSZip()

  // 1. mimetype must be first entry, uncompressed
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })

  // 2. META-INF/container.xml
  const metaInf = zip.folder('META-INF')
  if (!metaInf) {
    throw new Error('Failed to create META-INF folder')
  }
  metaInf.file(
    'container.xml',
    `
      <?xml version="1.0" encoding="UTF-8"?>
      <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles>
          <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
        </rootfiles>
      </container>
    `
  )

  // 3. OEBPS folder
  const oebps = zip.folder('OEBPS')
  if (!oebps) {
    throw new Error('Failed to create OEBPS folder')
  }

  // 4. Chapter XHTML files
  book.chapters.forEach((ch, index) => {
    oebps.file(
      `chapter_${index}.xhtml`,
      `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>${escapeXml(ch.title)}</title>
      </head>
      <body>
        <h1>${escapeXml(ch.title)}</h1>
        ${ch.content}
      </body>
      </html>`
    )
  })

  // 5. content.opf (package document)
  const manifestItems = book.chapters
    .map(
      (_, i) =>
        `    <item id="chapter_${i}" href="chapter_${i}.xhtml" media-type="application/xhtml+xml"/>`
    )
    .join('\n')
  const spineItems = book.chapters.map((_, i) => `    <itemref idref="chapter_${i}"/>`).join('\n')

  oebps.file(
    'content.opf',
    `<?xml version="1.0" encoding="UTF-8"?>
    <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
      <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:title>${escapeXml(book.metadata.title)}</dc:title>
        <dc:creator>${escapeXml(book.metadata.author)}</dc:creator>
        <dc:identifier id="bookid">urn:uuid:${crypto.randomUUID()}</dc:identifier>
        <dc:language>en</dc:language>
      </metadata>
      <manifest>
        ${manifestItems}
        <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
      </manifest>
      <spine toc="ncx">${spineItems}</spine>
    </package>`
  )

  // 6. toc.ncx (table of contents)
  const navPoints = book.chapters
    .map(
      (ch, i) =>
        `    <navPoint id="navpoint_${i}" playOrder="${i + 1}">
      <navLabel><text>${escapeXml(ch.title)}</text></navLabel>
      <content src="chapter_${i}.xhtml"/>
    </navPoint>`
    )
    .join('\n')

  oebps.file(
    'toc.ncx',
    `
      <?xml version="1.0" encoding="UTF-8"?>
      <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
        <head>
          <meta name="dtb:uid" content="urn:uuid:00000000-0000-0000-0000-000000000000"/>
        </head>
        <docTitle><text>${escapeXml(book.metadata.title)}</text></docTitle>
        <navMap>
      ${navPoints}
        </navMap>
      </ncx>
    `
  )

  // 7. Generate and download
  const content = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
  })
  saveAs(content, `${book.metadata.title}.epub`)
}
