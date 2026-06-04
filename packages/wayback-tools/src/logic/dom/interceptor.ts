import { ChapterOptions, EpubBook, EpubBuilder, EpubMetadata } from 'epub-builder'
import { getElementText } from './scraper'

/**
 * 拦截 download 内的标签点击事件
 */
export const downloadInterceptor = () => {
  console.log('download 按钮拦截: 一律改成 epub 下载方式')
  const typeUl = document.querySelector(
    '.navigation.actions .download .secondary'
  ) as HTMLUListElement | null
  console.log('测试')
  typeUl?.addEventListener('click', async (event) => {
    debugger
    if (event.target instanceof HTMLAnchorElement) {
      // 1. 阻止默认方式
      event.preventDefault()
      // 2. 改为前端 epub 下载方式
      const container = document.querySelector('#inner #main')?.cloneNode(true) as
        | HTMLDivElement
        | undefined
      // 2.1 构建 epub metadata
      const metaContainer = container?.querySelector('.preface.group')
      const tagsContainer = container?.querySelector('.work.meta.group')
      const metadata: EpubMetadata = {
        title: getElementText(metaContainer?.querySelector('.title.heading')),
        author: getElementText(metaContainer?.querySelector('.author')),
        language: getElementText(tagsContainer?.querySelector('dd.language')),
        description: getElementText(metaContainer?.querySelector('.summary')),
      }
      // 2.2 构建 tags
      // 2.3 构建章节
      const chaptersData: ChapterOptions[] = []
      const chaptersContainer = container?.querySelector('#chapters') as HTMLDivElement | undefined
      if (chaptersContainer) {
        ;[...chaptersContainer.children].forEach((chapter, index) => {
          chapter.querySelector('.chapter.preface.group')?.remove()
          const chapterContentEl = chapter.querySelector('.userstuff.module')
          chapterContentEl?.querySelector('.landmark.heading')?.remove()
          chaptersData.push({
            title: `Chapter ${index + 1}`,
            content:
              chapterContentEl?.innerHTML
                // 1. 修复 <hr> -> <hr /> (兼容可能带属性或空格的情况)
                .replace(/<hr([^>]*)(?<!\/)>/gi, '<hr$1 />')
                // 2. 修复 <br> -> <br />
                .replace(/<br([^>]*)(?<!\/)>/gi, '<br$1 />')
                // 3. 修复 <img> -> <img />
                .replace(/<img([^>]*)(?<!\/)>/gi, '<img$1 />')
                // 4. 顺便带上上一个问题的 &nbsp; 修复
                .replace(/&nbsp;/g, '&#160;') ?? '',
          })
        })
      }
      // 2.4 构建 EpubBook 与 EpubBuilder，并下载
      const book = new EpubBook(metadata)
      book.addChapters(chaptersData)
      const builder = new EpubBuilder(book)
      const blob = await builder.build()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${metadata.title} by ${metadata.author}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  })
}
