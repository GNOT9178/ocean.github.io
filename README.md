# Ocean · 网络安全学习笔记

一个纯静态的个人博客：手写 HTML + CSS，没有任何框架、构建步骤和外部依赖，托管在 GitHub Pages 上。

线上地址：<https://gnot9178.github.io/ocean.github.io/>

## 目录结构

```
ocean.github.io/
├── index.html              首页：Hero + 文章列表 + 正在做的事
├── about.html              关于页
├── 404.html                自定义错误页
├── posts/
│   ├── hello-ocean.html            随笔 · 第 0 篇
│   ├── github-pages-deploy.html    建站部署
│   ├── security-roadmap.html       12 个月学习路线
│   └── web-login-lab.html          SQL 注入靶场笔记
├── assets/
│   ├── css/style.css       全部样式（含深色模式）
│   ├── js/main.js          主题切换、阅读进度、目录高亮、代码复制
│   └── img/favicon.svg     站点图标
├── .nojekyll               告诉 Pages 不要走 Jekyll 处理
├── robots.txt
└── sitemap.xml
```

## 本地预览

不要直接双击 HTML 文件，用本地服务器：

```bash
# 任选一个
python -m http.server 8000
npx serve .
```

然后打开 <http://localhost:8000/>。

## 如何新增一篇文章

1. 复制 `posts/hello-ocean.html`，重命名为 `posts/你的文件名.html`（建议全小写、用连字符）；
2. 改 `<title>`、`<meta name="description">`、`.kicker`、`.article-title`、`.article-deck`、`.article-meta` 里的日期与时长；
3. 正文写在 `<div class="prose">` 里，每个 `<h2>` 记得带 `id`；
4. **同步更新右侧目录** `<aside class="toc">`，否则锚点会指向不存在的标题；
5. 在 `index.html` 的 `.post-grid` 里加一张卡片，指向新文章；
6. 顺手更新 `posts/` 里相邻文章的"上一篇 / 下一篇"导航和 `sitemap.xml`。

## 写文章时可用的样式组件

| 用途 | 写法 |
| --- | --- |
| 提示框 | `<div class="callout"><p class="callout-label">标题</p><p>内容</p></div>` |
| 警告框 | 同上，class 换成 `callout warn` |
| 小技巧框 | 同上，class 换成 `callout tip` |
| 勾选清单 | `<ul class="checklist"><li>…</li></ul>` |
| 代码块 | `<pre><span class="lang">bash</span><code>…</code></pre>` |
| 行内代码 | `<code>…</code>` |
| 标签 | `<span class="tag">Web 安全</span>` |

> 代码块里的 `<` 和 `&` 必须转义成 `&lt;` 和 `&amp;`，否则页面结构会被破坏。

## 部署

仓库已开启 GitHub Pages（Settings → Pages → Deploy from a branch → `main` / `/ (root)`）。推送即自动构建。

```bash
git add .
git commit -m "add: 新文章标题"
git push origin main
```

## 注意

- 仓库是 **Public**，站点的所有提交历史也是公开的，**不要**提交密钥、内网地址、真实目标的扫描结果；
- 本仓库是**项目站点**，访问路径带 `/ocean.github.io/` 前缀，页面内所有链接必须用相对路径（`assets/…`、`../assets/…`），不要写 `/assets/…`；
- 所有安全测试内容仅限自建靶场或明确授权的环境。
