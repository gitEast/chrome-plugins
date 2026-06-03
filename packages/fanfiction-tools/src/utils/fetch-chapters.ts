export interface ChapterData {
  title: string
  content: string
}

interface StoryInfo {
  storyId: string
  storySlug: string
}

/**
 * Parse story ID and slug from the current URL.
 * URL format: https://www.fanfiction.net/s/[story id]/[chapter index]/[story title]
 */
export function parseStoryUrl(url: string): StoryInfo | null {
  const match = url.match(/\/s\/(\d+)\/\d+\/([^/?#]+)/)
  if (!match) return null
  return { storyId: match[1], storySlug: match[2] }
}

/**
 * Get the total chapter count from the #chap_select dropdown on the page.
 * Returns 1 if no dropdown exists (single-chapter story).
 */
export function getChapterCount(): number {
  const select = document.querySelector('#chap_select') as HTMLSelectElement | null
  if (!select) return 1
  return select.options.length
}

/**
 * Get chapter titles from the #chap_select dropdown.
 * Falls back to "Chapter N" if dropdown is unavailable.
 */
export function getChapterTitles(): string[] {
  const select = document.querySelector('#chap_select') as HTMLSelectElement | null
  if (!select) return ['Chapter 1']
  return Array.from(select.options).map((opt) => opt.textContent?.trim() || `Chapter ${opt.value}`)
}

/**
 * Fetch a single chapter's HTML content from the given URL.
 * Uses DOMParser to extract the #storytext element.
 */
async function fetchChapterContent(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  const html = await response.text()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const storytext = doc.querySelector('#storytext')
  if (!storytext) {
    throw new Error(`No #storytext found at ${url}`)
  }
  return storytext.innerHTML
}

/**
 * Fetch all chapters of a story.
 * @param storyId - The numeric story ID
 * @param storySlug - The story title slug from the URL
 * @param chapterCount - Total number of chapters
 * @param chapterTitles - Array of chapter titles from the dropdown
 * @param onProgress - Optional callback for progress updates (chapterIndex, total)
 * @param delayMs - Delay between requests to avoid rate limiting (default 1000ms)
 */
export async function fetchAllChapters(
  storyId: string,
  storySlug: string,
  chapterCount: number,
  chapterTitles: string[],
  onProgress?: (current: number, total: number) => void,
  delayMs = 1000
): Promise<ChapterData[]> {
  const chapters: ChapterData[] = []

  for (let i = 1; i <= chapterCount; i++) {
    if (onProgress) onProgress(i, chapterCount)

    const url = `https://www.fanfiction.net/s/${storyId}/${i}/${storySlug}`
    const content = await fetchChapterContent(url)
    const title = chapterTitles[i - 1] || `Chapter ${i}`
    chapters.push({ title, content })

    // Delay between requests (skip delay after the last chapter)
    if (i < chapterCount) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return chapters
}
