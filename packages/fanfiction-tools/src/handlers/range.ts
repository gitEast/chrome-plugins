/**
 * 选中文本高亮并复制到剪贴板
 */
export const handleRange = (event: MouseEvent): void => {
  const selection = window.getSelection();
  if (
    selection &&
    selection.rangeCount > 0 &&
    selection.toString().length > 0
  ) {
    let range = selection.getRangeAt(0);
    if (!range) return;
    const { commonAncestorContainer } = range;
    const el = (
      commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? commonAncestorContainer
        : commonAncestorContainer.parentElement
    ) as Element | null;
    if (!el) return;
    if (!el.closest('#storytext')) return;
    if (range.toString().length === 0) return;

    try {
      // 提取选区内容
      const fragment = range.extractContents();

      // 移除 fragment 内已有的 .ff-tools_highlight span（保留其子节点）
      fragment.querySelectorAll('.ff-tools_highlight').forEach((existing) => {
        const parent = existing.parentNode!;
        while (existing.firstChild) {
          parent.insertBefore(existing.firstChild, existing);
        }
        parent.removeChild(existing);
      });

      // 用新的 highlight span 包裹整个 fragment
      const span = document.createElement('span');
      span.classList.add('ff-tools_highlight');
      span.appendChild(fragment);
      range.insertNode(span);

      selection.removeAllRanges();
      const textContent = span.textContent;
      navigator.clipboard.writeText(textContent);
    } catch (error) {
      console.log('range 处理失败：', error);
    }
  }
};
