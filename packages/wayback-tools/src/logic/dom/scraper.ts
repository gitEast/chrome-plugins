export const getElementText = (target?: string | Element | null) => {
  if (!target) return ''
  const element = typeof target === 'string' ? document.querySelector(target) : target
  return element?.textContent?.trim() ?? ''
}

export const getElementHtml = (target?: string | Element | null) => {
  if (!target) return ''
  const element = typeof target === 'string' ? document.querySelector(target) : target
  return element?.innerHTML ?? ''
}
