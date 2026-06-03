import { createEpub } from '../utils/create-epub'
import {
  parseStoryUrl,
  getChapterCount,
  getChapterTitles,
  fetchAllChapters,
} from '../utils/fetch-chapters'

/**
 * 在 #storytextp 元素内追加"下载epub"按钮
 */
export function injectDownloadButton(): void {
  const container = document.querySelector('#storytextp') as HTMLElement | null
  if (!container) return

  const btn = document.createElement('button')
  btn.textContent = 'epub'
  btn.id = 'ff-download-epub-btn'
  btn.classList.add('ff-tools_download_epub_btn')

  btn.addEventListener('click', async () => {
    const profile = document.querySelector('#profile_top')?.cloneNode(true) as HTMLElement | null
    let author = ''
    let title = ''
    if (profile) {
      profile.querySelectorAll('button').forEach((b) => b.remove())
      const profileText = profile.textContent || ''
      const titleEndIdx = profileText.indexOf('\n')
      title = profileText.slice(0, titleEndIdx).trim()
      const authorStartIdx = profileText.indexOf('By: ') + 4
      const authorEndIdx = profileText.indexOf(' ', authorStartIdx)
      author = profileText.slice(authorStartIdx, authorEndIdx).trim()
    }

    const storyInfo = parseStoryUrl(window.location.href)
    if (!storyInfo) {
      console.error('Unable to parse story URL')
      return
    }

    const chapterCount = getChapterCount()
    const chapterTitles = getChapterTitles()

    // Update button to show progress
    btn.disabled = true
    btn.textContent = `0/${chapterCount}`

    try {
      const chapters = await fetchAllChapters(
        storyInfo.storyId,
        storyInfo.storySlug,
        chapterCount,
        chapterTitles,
        (current, total) => {
          btn.textContent = `${current}/${total}`
        },
        Math.random() * 5000 + 1000 // Random delay between 1000ms and 6000ms
      )

      await createEpub({
        metadata: {
          title: title || 'Unknown Title',
          author: author || 'Unknown Author',
        },
        chapters,
      })
    } catch (err) {
      console.error('Failed to download chapters:', err)
      btn.textContent = 'Error'
      setTimeout(() => {
        btn.textContent = 'epub'
      }, 3000)
    } finally {
      btn.disabled = false
      btn.textContent = 'epub'
    }
  })

  container.appendChild(btn)
}
