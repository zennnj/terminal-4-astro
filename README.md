# Terminal 4

一个基于 Astro 7 与 [Astro Yi](https://github.com/cirry/astro-yi) 改造的个人博客。

## 内容目录

- `src/content/blog/`：从旧 Hexo 博客迁移的文章
- `src/content/memos/`：短动态与自言自语
- `src/content/gallery/`：OC / 同人画廊条目
- `src/content/reviews/`：作品 notes 与最终 review
- `src/content/pages/`：About 与 About this site 的 Markdown 正文
- `src/image/blog/`：供 Typora 使用的新文章图片目录
- `src/image/gallery/`：由 Gallery 创建命令导入并交给 Astro 优化的图片
- `public/images/`：旧站文章图片

Gallery 和 Review 目录内各有一份草稿模板。复制模板、填写内容并将 `draft` 改为 `false` 即可发布。Review 的 `type` 使用 `game`、`anime`、`movie`、`video` 或 `book`。

## 创建内容

创建博客文章：

```bash
pnpm new:post "文章名称"
```

这会生成 `src/content/blog/文章名称.md`。Typora 图片目录建议配置为 `src/image/blog/文章名称/`；文章中的相对路径从 `../../image/blog/文章名称/` 开始。

创建 Review（默认类型为 `game`）：

```bash
pnpm new:review "作品名称"
pnpm new:review "作品名称" --type anime
```

两个命令都不会覆盖同名文件，并可附加 `--dry-run` 仅检查目标路径。

创建 Gallery 条目并复制图片（`kind` 可使用 `oc` 或 `fanart`）：

```bash
pnpm new:gallery "作品名称" --image "D:/Pictures/artwork.png" --kind oc
pnpm new:gallery "作品名称" --image "D:/Pictures/artwork.png" --kind fanart --tags "Celeste, fanart" --alt "图片替代文本" --description "作品说明"
```

命令会把图片复制到 `src/image/gallery/`，并在 `src/content/gallery/` 创建默认已发布（`draft: false`）的同名 Markdown。`--tag` 可重复指定单个标签，`--tags` 接受逗号分隔的多个标签并自动去重。`--alt` 用作图片替代文本，`--description` 写入弹窗显示的 Markdown 正文；省略 `--description` 时会沿用 `--alt`。两个目标中的任意一个已经存在时都会拒绝覆盖；可附加 `--dry-run` 预演。

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
