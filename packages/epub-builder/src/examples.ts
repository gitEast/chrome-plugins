/**
 * EPUB 生成使用示例
 * 展示如何使用 EPUB 工具生成电子书
 */

import { EpubBook, EpubBuilder, EpubMetadata } from './index';

/**
 * 示例 1: 基本使用
 */
async function example1_basicUsage() {
  // 1. 创建书籍元数据
  const metadata: EpubMetadata = {
    title: '示例小说',
    author: '张三',
    language: 'zh',
    description: '这是一个示例小说的 EPUB 文件',
    subjects: ['小说', '示例']
  };

  // 2. 创建书籍实例
  const book = new EpubBook(metadata);

  // 3. 添加章节
  book.addChapter({
    title: '第一章 开始',
    content: `
      <p>这是第一章的内容。这是一个示例段落。</p>
      <p>这是第二个段落，展示了如何使用 HTML 格式的内容。</p>
      <blockquote>这是一个引用示例</blockquote>
    `
  });

  book.addChapter({
    title: '第二章 发展',
    content: `
      <h2>第二章的标题</h2>
      <p>这是第二章的内容。</p>
      <ul>
        <li>列表项 1</li>
        <li>列表项 2</li>
        <li>列表项 3</li>
      </ul>
    `
  });

  book.addChapter({
    title: '第三章 结局',
    content: '<p>这是第三章，也是最后一章。</p>'
  });

  // 4. 构建 EPUB
  const builder = new EpubBuilder(book);
  const blob = await builder.build();

  // 5. 下载文件
  downloadEpub(blob, '示例小说.epub');
}

/**
 * 示例 2: 批量添加章节（适合从网页抓取的内容）
 */
async function example2_batchChapters() {
  const book = new EpubBook({
    title: '网页小说合集',
    author: '多个作者',
    language: 'zh'
  });

  // 模拟从网页抓取的小说章节
  const chaptersData = [
    { title: '第1章', content: '<p>第一章内容...</p>' },
    { title: '第2章', content: '<p>第二章内容...</p>' },
    { title: '第3章', content: '<p>第三章内容...</p>' },
    { title: '第4章', content: '<p>第四章内容...</p>' },
    { title: '第5章', content: '<p>第五章内容...</p>' }
  ];

  // 批量添加
  book.addChapters(chaptersData);

  // 构建并下载
  const builder = new EpubBuilder(book);
  const blob = await builder.build();
  downloadEpub(blob, '网页小说合集.epub');
}

/**
 * 示例 3: 自定义 CSS 样式
 */
async function example3_customCss() {
  const book = new EpubBook({
    title: '自定义样式小说',
    author: '李四',
    language: 'zh'
  });

  book.addChapter({
    title: '第一章',
    content: '<p>这是一段带有自定义样式的文本。</p>'
  });

  // 自定义 CSS
  const customCss = `
@charset "utf-8";
body {
  font-family: "Microsoft YaHei", sans-serif;
  line-height: 1.8;
  color: #333;
  background-color: #f5f5f5;
  padding: 20px;
}

h1 {
  color: #d32f2f;
  border-bottom: 2px solid #d32f2f;
  padding-bottom: 10px;
}

p {
  text-indent: 2em;
  margin: 1em 0;
}

a {
  color: #1976d2;
}
`;

  const builder = new EpubBuilder(book, {
    css: customCss
  });

  const blob = await builder.build();
  downloadEpub(blob, '自定义样式小说.epub');
}

/**
 * 示例 4: 在 Chrome 扩展中使用（从 content script 抓取内容）
 */
async function example4_chromeExtension() {
  // 假设这是从网页抓取的小说内容
  const novelTitle = document.querySelector('h1')?.textContent || '未知标题';
  const authorName =
    document.querySelector('.author')?.textContent || '未知作者';

  // 抓取所有章节
  const chapterElements = document.querySelectorAll('.chapter');
  const chapters = Array.from(chapterElements).map((el, index) => ({
    title: el.querySelector('h2')?.textContent || `第${index + 1}章`,
    content: el.querySelector('.content')?.innerHTML || ''
  }));

  // 创建书籍
  const book = new EpubBook({
    title: novelTitle,
    author: authorName,
    language: 'zh'
  });

  book.addChapters(chapters);

  // 构建 EPUB
  const builder = new EpubBuilder(book);
  const blob = await builder.build();

  // 使用 Chrome 下载 API
  // @ts-ignore - Chrome 扩展 API
  chrome.downloads.download({
    url: URL.createObjectURL(blob),
    filename: `${novelTitle}.epub`
  });
}

/**
 * 示例 5: 处理完整 HTML 文档
 */
async function example5_fullHtmlDocument() {
  // 模拟一个完整的 HTML 文档（包含 html、head、body 标签）
  const fullHtmlDocument = `
<!DOCTYPE html>
<html>
<head>
  <title>完整文档</title>
  <style>
    body { font-size: 16px; }
  </style>
</head>
<body>
  <h1>第一章</h1>
  <p>这是第一章的内容，HTML 转换器会自动清理文档结构。</p>
  <p>只保留 body 中的内容。</p>
</body>
</html>
`;

  const book = new EpubBook({
    title: '从完整文档生成',
    author: '王五',
    language: 'zh'
  });

  book.addChapter({
    title: '第一章',
    content: fullHtmlDocument // 即使传入完整文档，转换器也会正确处理
  });

  const builder = new EpubBuilder(book);
  const blob = await builder.build();
  downloadEpub(blob, '完整文档.epub');
}

/**
 * 辅助函数：下载 EPUB 文件
 */
function downloadEpub(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 导出示例函数（可根据需要调用）
export {
  example1_basicUsage,
  example2_batchChapters,
  example3_customCss,
  example4_chromeExtension,
  example5_fullHtmlDocument
};
