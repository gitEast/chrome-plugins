# epub-builder

从 HTML 内容生成符合 EPUB 3.0 规范的电子书文件。

## 📖 概述

`epub-builder` 是一个轻量级的 EPUB 生成库，专为浏览器环境和 Node.js 设计。它可以从 HTML 字符串生成标准的 EPUB 电子书，支持自定义样式、多章节、元数据等。

## ✨ 特性

- ✅ 符合 EPUB 3.0 规范（兼容 EPUB 2.0）
- ✅ 支持浏览器和 Node.js 环境
- ✅ 自动 HTML 到 XHTML 转换
- ✅ 自定义 CSS 样式
- ✅ 完整的元数据支持
- ✅ TypeScript 类型安全
- ✅ 无外部依赖（仅依赖 JSZip）

## 🚀 快速开始

### 安装

```bash
npm install epub-builder
# 或
pnpm add epub-builder
```

### 基本使用

```typescript
import { EpubBook, EpubBuilder } from 'epub-builder';

// 1. 创建书籍
const book = new EpubBook({
  title: '我的小说',
  author: '作者名',
  language: 'zh'
});

// 2. 添加章节
book.addChapter({
  title: '第一章',
  content: '<p>这是第一章的内容...</p>'
});

book.addChapter({
  title: '第二章',
  content: '<p>这是第二章的内容...</p>'
});

// 3. 构建 EPUB
const builder = new EpubBuilder(book);
const blob = await builder.build();

// 4. 下载文件
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = '我的小说.epub';
a.click();
```

## 📚 API 文档

### EpubBook

书籍管理类。

```typescript
const book = new EpubBook({
  title: string;           // 必填：书籍标题
  author: string | string[]; // 必填：作者
  language?: string;       // 可选：语言，默认 'zh'
  publisher?: string;      // 可选：出版社
  date?: string;          // 可选：出版日期
  identifier?: string;    // 可选：唯一标识符
  description?: string;   // 可选：描述
  subjects?: string[];    // 可选：主题标签
  rights?: string;        // 可选：版权信息
});

// 添加章节
book.addChapter({
  title: string;    // 章节标题
  content: string;  // HTML 内容
  id?: string;      // 可选：自定义 ID
});

// 批量添加
book.addChapters(chapters: ChapterOptions[]);

// 获取章节
book.getChapters();
book.getChapterCount();
book.getChapterById(id: string);

// 移除章节
book.removeChapter(id: string);
book.clearChapters();
```

### EpubBuilder

EPUB 构建器。

```typescript
const builder = new EpubBuilder(book, {
  css?: string;           // 可选：自定义 CSS
  includeNavPage?: boolean; // 可选：是否包含导航页，默认 true
});

// 构建 EPUB
const blob = await builder.build();
```

## 🎨 自定义样式

```typescript
const customCss = `
@charset "utf-8";
body {
  font-family: "Microsoft YaHei", sans-serif;
  line-height: 1.8;
  color: #333;
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
`;

const builder = new EpubBuilder(book, {
  css: customCss
});
```

## 📝 HTML 内容处理

库会自动处理 HTML 内容，确保符合 EPUB 规范：

- 自动剥离完整的 HTML 文档结构
- 移除 `<script>` 和 `<style>` 标签
- 转换标签为 XHTML 兼容格式
- 确保图片标签有 `alt` 属性
- 清理 HTML 注释

## 🔧 高级用法

### 批量添加章节

```typescript
const chapters = [
  { title: '第1章', content: '<p>内容...</p>' },
  { title: '第2章', content: '<p>内容...</p>' },
  { title: '第3章', content: '<p>内容...</p>' },
];

book.addChapters(chapters);
```

### 在 Chrome 扩展中使用

```typescript
// 从网页抓取内容
const novelTitle = document.querySelector('h1')?.textContent || '未知标题';
const authorName = document.querySelector('.author')?.textContent || '未知作者';
const chapterElements = document.querySelectorAll('.chapter');

const chapters = Array.from(chapterElements).map((el, index) => ({
  title: el.querySelector('h2')?.textContent || `第${index + 1}章`,
  content: el.querySelector('.content')?.innerHTML || '',
}));

const book = new EpubBook({
  title: novelTitle,
  author: authorName,
  language: 'zh',
});

book.addChapters(chapters);

const builder = new EpubBuilder(book);
const blob = await builder.build();

// 下载
chrome.downloads.download({
  url: URL.createObjectURL(blob),
  filename: `${novelTitle}.epub`,
});
```

## 📦 依赖

- `jszip@^3.10.1` - ZIP 文件生成

## ✅ 兼容性

- 符合 EPUB 3.0 规范
- 兼容 EPUB 2.0 阅读器
- 支持主流 EPUB 阅读器：
  - Apple Books
  - Google Play Books
  - Calibre
  - 微信读书
  - 多看阅读

## 📚 参考

- [EPUB 3.0 规范](https://www.w3.org/publishing/epub32/)
- [OPF 规范](http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm)
- [NCX 规范](http://www.niso.org/schemas/z3986/2005/ncx-2005-1.html)

## 📄 许可证

MIT
