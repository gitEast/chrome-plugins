import { EpubBook, EpubBuilder, EpubMetadata } from 'epub-builder'
import { defineContentScript } from 'wxt/utils/define-content-script'

export default defineContentScript({
  matches: ['https://www.fanfiction.net/*', 'file:///F:/Rizzoli%20&%20Isles/*'],
  async main() {
    const container = document.querySelector('#inner #main')
    console.log(container)
    const metaContainer = container?.querySelector('.work.meta.group') as HTMLDListElement
    const metaList = []
    if (metaContainer) {
    }
    console.log(metaContainer)
    const workContainer = container?.querySelector('#workskin') as HTMLDivElement
    const metaData: EpubMetadata = {
      title: '',
      author: '',
      language: '',
      description: '',
    }
    if (workContainer) {
      metaData.title = workContainer.querySelector('.title.heading')?.textContent ?? '未知'
      metaData.author = workContainer.querySelector('.author')?.textContent ?? '未知'
      metaData.language = metaContainer.querySelector('dd.language')?.textContent ?? '未知'
      metaData.description = workContainer.querySelector('.summary ')?.textContent ?? ''
    }
    const book = new EpubBook(metaData)
    const chaptersContainer = container?.querySelector('#chapters') as HTMLDivElement | undefined
    if (chaptersContainer) {
      ;[...chaptersContainer.children].forEach((chapter, index) => {
        book.addChapter({
          title: `Chapter ${index + 1}`,
          content: chapter.innerHTML,
        })
      })
    }
    // 构建并下载
    const builder = new EpubBuilder(book)
    const blob = await builder.build()

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${metaData.title} by ${metaData.author}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },
})
