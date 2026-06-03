/**
 * EPUB 生成使用示例
 * 展示如何在 wayback-tools 中使用 epub-builder
 */

import { EpubBook, EpubBuilder, EpubMetadata } from 'epub-builder';

/**
 * 示例 1: 基本使用
 */
export async function example1_basicUsage() {
  // 1. 创建书籍元数据
  const metadata: EpubMetadata = {
    title: '示例小说',
    author: '张三',
    language: 'zh',
    description: '这是一个示例小说的 EPUB 文件',
    subjects: ['小说', '示例'],
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
    `,
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
    `,
  });

  book.addChapter({
    title: '第三章 结局',
    content: '<p>这是第三章，也是最后一章。</p>',
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
export async function example2_batchChapters() {
  const book = new EpubBook({
    title: '网页小说合集',
    author: '多个作者',
    language: 'zh',
  });

  // 模拟从网页抓取的小说章节
  const chaptersData = [
    { title: '第1章', content: '<p>第一章内容...</p>' },
    { title: '第2章', content: '<p>第二章内容...</p>' },
    { title: '第3章', content: '<p>第三章内容...</p>' },
    { title: '第4章', content: '<p>第四章内容...</p>' },
    { title: '第5章', content: '<p>第五章内容...</p>' },
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
export async function example3_customCss() {
  const book = new EpubBook({
    title: '自定义样式小说',
    author: '李四',
    language: 'zh',
  });

  book.addChapter({
    title: '第一章',
    content: '<p>这是一段带有自定义样式的文本。</p>',
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
    css: customCss,
  });

  const blob = await builder.build();
  downloadEpub(blob, '自定义样式小说.epub');
}

/**
 * 示例 4: 从网页内容生成 EPUB（适合 Chrome 扩展）
 */
export async function example4_fromWebPage() {
  // 假设这是从网页抓取的小说内容
  const novelTitle = '抓取的小说标题';
  const authorName = '抓取的作者名';

  // 模拟从网页抓取的章节数据
  const chaptersData = Array.from({ length: 10 }, (_, i) => ({
    title: `第${i + 1}章`,
    content: `
      <p>这是第${i + 1}章的内容。</p>
      <p>在实际使用中，这里会是网页抓取的完整 HTML 内容。</p>
      <p>支持各种 HTML 标签：</p>
      <ul>
        <li>段落</li>
        <li>列表</li>
        <li>引用</li>
      </ul>
    `,
  }));

  // 创建书籍
  const book = new EpubBook({
    title: novelTitle,
    author: authorName,
    language: 'zh',
    description: '从网页抓取的 EPUB 文件',
    subjects: ['小说', '网页抓取'],
  });

  book.addChapters(chaptersData);

  // 构建 EPUB
  const builder = new EpubBuilder(book);
  const blob = await builder.build();

  // 下载文件
  downloadEpub(blob, `${novelTitle}.epub`);
}

/**
 * 示例 5: 处理完整 HTML 文档
 */
export async function example5_fullHtmlDocument() {
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
    language: 'zh',
  });

  book.addChapter({
    title: '第一章',
    content: fullHtmlDocument, // 即使传入完整文档，转换器也会正确处理
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
