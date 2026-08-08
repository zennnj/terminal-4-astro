# Terminal 4

一个基于 Astro 7 与 [Astro Yi](https://github.com/cirry/astro-yi) 改造的个人博客。

## 内容目录

- `src/content/blog/`：从旧 Hexo 博客迁移的文章
- `src/content/memos/`：短动态与自言自语
- `src/content/gallery/`：OC / 同人画廊条目
- `src/content/reviews/`：作品 notes 与最终 review
- `public/images/`：旧站文章图片

Gallery 和 Review 目录内各有一份草稿模板。复制模板、填写内容并将 `draft` 改为 `false` 即可发布。

## 本地开发

需要 Node.js 22.12+ 与 pnpm 11+。

```bash
pnpm install
pnpm astro dev --background
pnpm build
```

后台服务可通过 `pnpm astro dev status`、`pnpm astro dev logs` 和 `pnpm astro dev stop` 管理。

## 迁移脚本

`scripts/migrate-hexo.mjs` 会从 `D:/blog/source/_posts` 重新导入文章和图片。带 `hidden` 或 frontmatter `password` 的旧文章会自动标为草稿，避免意外公开。
