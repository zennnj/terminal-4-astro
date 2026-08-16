# Terminal 4 共同组件配置参考

本文档记录项目中跨页面复用、会影响视觉或交互的共同组件配置。内容以当前代码为准，主要用于查看尺寸、位置、字体、颜色、响应式规则和可配置参数。

本文不描述组件调用链、内部模块依赖关系或页面数据处理流程。

## 1. 阅读约定

- 默认根字号按浏览器标准 `16px` 计算。
- `1rem = 16px`，`.5rem = 8px`，`.75rem = 12px`，`1.5rem = 24px`。
- `ch` 表示当前字体中数字 `0` 的近似宽度，不能严格换算成固定像素。
- `vw`、`svh` 和 `clamp()` 会随视口变化，文中同时保留原公式和可确定的上下限。
- 普通页面断点为 `900px`；部分组件另有 `700px`、`720px` 或 `1050px` 断点。
- Homepage、About Me、About Site 是特殊构图页面，不强制使用普通内容页的全部尺寸规则。

## 2. 全局设计配置

配置位置：[src/styles/index.css](../src/styles/index.css)

### 2.1 颜色

| Token | 数值 | 用途 |
| --- | --- | --- |
| `--p4-orange` | `#f9a620` | 插画、Review Latest 等暖色强调 |
| `--p4-purple` | `#7a5980` | 主文字、侧栏、页脚、主要深色块 |
| `--p4-coral` | `#e86252` | 标签、悬停、强调文字、焦点 |
| `--p4-gray` | `#e1e6e1` | 页面主背景 |
| `--p4-yellow` | `#f4ffc1` | 卡片、输入区域、浅色强调面 |
| `--purple-soft` | `#98789d` | 次级正文和元信息 |

### 2.2 字体

| Token | 字体栈 | 使用位置 |
| --- | --- | --- |
| `--font-title` | PP Neue Montreal → Microsoft YaHei → PingFang SC → Noto Sans CJK SC → system-ui | 大型标题 |
| `--font-index` | Wix Madefor Display → Arial → Microsoft YaHei → PingFang SC → Noto Sans CJK SC → system-ui | 首页 UI、索引标签等装饰性文字 |
| `--font-body` | Microsoft YaHei → PingFang SC → Noto Sans CJK SC → system-ui | 正文和普通控件 |
| `--font-article-title` | Microsoft YaHei → PingFang SC → Noto Sans CJK SC → system-ui | 中文或混合语言标题 |
| `--font-display` | Boba Mono → Courier New → monospace | 引语和展示文字 |
| `--font-about-copy` | Maoken Yanbo Song → Songti SC → Noto Serif SC → serif | About 文案 |

中英文并不是由脚本切换。浏览器会逐字符使用字体栈：Wix 或 PP Neue Montreal 负责其包含的拉丁字符，中文字符继续回退到后面的 CJK 字体。

### 2.3 字号等级

| Token | CSS 值 | 约合像素 |
| --- | --- | --- |
| `--text-xs` | `.78rem` | `12.48px` |
| `--text-sm` | `.875rem` | `14px` |
| `--text-base` | `1rem` | `16px` |
| `--text-md` | `clamp(1rem, .94rem + .22vw, 1.125rem)` | `16–18px` |
| `--text-lg` | `clamp(1.15rem, 1.02rem + .45vw, 1.4rem)` | `18.4–22.4px` |
| `--text-xl` | `clamp(1.45rem, 1.2rem + .8vw, 1.9rem)` | `23.2–30.4px` |
| `--page-title-size` | `clamp(2.55rem, 2.05rem + 2vw, 3.8rem)` | `40.8–60.8px` |
| `--detail-title-size` | `clamp(2.2rem, 1.85rem + 1.45vw, 3.2rem)` | `35.2–51.2px` |
| `--markdown-h2-size` | `clamp(1.55rem, 1.42rem + .4vw, 1.8rem)` | `24.8–28.8px` |

### 2.4 间距、圆角和动效

| Token | 数值 |
| --- | --- |
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `24px` |
| `--space-6` | `32px` |
| `--space-7` | `40px` |
| `--space-8` | `clamp(40px, 5vw, 64px)` |
| `--radius-control` | `12px` |
| `--radius-card` | `20px` |
| `--radius-pill` | `999px`，胶囊形 |
| `--motion-fast` | `160ms` |
| `--motion-base` | `240ms` |
| `--motion-slow` | `380ms` |
| `--ease-standard` | `cubic-bezier(.2, .8, .2, 1)` |

系统开启“减少动态效果”时，所有动画和过渡会缩短到 `.01ms`，平滑滚动被关闭。

### 2.5 页面宽度

| 配置 | 数值 | 说明 |
| --- | --- | --- |
| 普通页面最大内容宽度 | `1180px` | `--page-content-width` |
| 普通页面实际宽度 | `min(1180px, 100%)` | `--article-shell-width`，变量名为兼容旧代码保留 |
| 普通页面横向内边距 | `clamp(17.6px, 3vw, 44px)` | `--article-shell-padding-inline` |
| 阅读内容宽度 | `72ch` | 文章、Memo、Review 长正文 |
| 页面通用外边距 | `clamp(20px, 6vw, 120px)` | `--page-gutter` |
| 内容通用外边距 | `clamp(20px, 4vw, 76px)` | `--content-gutter` |

普通页面在桌面侧栏右侧区域中居中。移动端页面一般使用 `padding: 88px 17.6px 48px`，顶部 `88px` 为菜单按钮预留空间。

## 3. SiteShell：全局页面外壳

组件位置：[src/components/SiteShell.astro](../src/components/SiteShell.astro)

主要样式位置：[src/styles/index.css](../src/styles/index.css)

### 可配置属性

| 属性 | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `title` | `string` | 无 | 页面标题和 SEO 标题 |
| `description` | `string` | 无 | 页面描述 |
| `mathjax` | `boolean` | `false` | 是否加载 MathJax |
| `mermaid` | `boolean` | `false` | 是否加载 Mermaid |
| `ogImage` | `string` | 无 | 社交分享图片 |
| `contentClass` | `string` | 空字符串 | 添加到 `<main>` 的页面类名 |
| `bodyClass` | `string` | 空字符串 | 添加到 `<body>` 的页面类名 |

### 页面区域

- `<main id="app">` 最小高度为 `100vh`。
- 普通页面使用 `rail-centered-layout`，桌面时 `.site-stage` 宽度为 `100% - 72px`，左侧外边距为 `72px`。
- 首页、About Me、About Site 不使用普通页面居中规则。
- 普通页面内容进入动画为 `380ms`：从 `opacity: 0`、向下 `7.2px`，过渡到正常位置。

### Skip link

- 固定定位：顶部 `12px`。
- 左侧：`72px + 12px = 84px`。
- 内边距：上下 `10.4px`、左右 `14.4px`。
- 圆角：`12px`。
- 默认向上移动自身 `160%` 隐藏，键盘聚焦后回到页面内。

## 4. Side Rail：全局侧栏

侧栏属于 `SiteShell`。

### 桌面尺寸和位置

| 项目 | 配置 |
| --- | --- |
| 侧栏宽度 | `72px` |
| 位置 | `position: fixed; inset: 0 auto 0 0` |
| 层级 | `z-index: 90` |
| 背景 | `#7a5980` |
| 展开动画 | `300ms cubic-bezier(.2, .8, .2, 1)` |
| 关闭状态 | `translateX(-100%)` |
| 打开状态 | `translateX(0)` |

### 菜单按钮

- 固定在顶部 `14px`。
- 左侧位置：`(72px - 44px) / 2 = 14px`。
- 尺寸：`44 × 44px`。
- 三条横线宽 `22px`、高 `3px`、间距 `5px`。
- 普通桌面页面中按钮不可点击，只显示固定白色三横线。
- 首页和移动端可开关侧栏；打开时三横线变为 X。

### 导航项

- 导航区域顶部内边距：`70px`。
- 导航项之间间距：`.28rem ≈ 4.48px`。
- 单个导航点击区域：宽 `48px`，最小高 `48px`。
- 图标字号：`1.45rem ≈ 23.2px`。
- 标签提示位于图标右侧 `18px`，字号 `.72rem ≈ 11.52px`。
- 悬停或聚焦时背景为 `18%` 白色，整体旋转 `-3deg`；图标放大到 `1.12`。
- 底部 Site 图标宽 `54px`，底部外边距 `16px`。

### 移动端

- 断点：`900px` 及以下。
- 初始关闭。
- 打开时出现全屏遮罩，背景 `rgba(63, 39, 67, .25)`，模糊 `2px`。
- 按 Escape 或点击遮罩关闭。
- 打开和关闭不能改变正文宽度、边距或位置；预期布局位移为 `0px`。

## 5. Site Loader：首次进入加载层

属于 `SiteShell`。

- `position: fixed; inset: 0`，覆盖整个视口。
- `z-index: 999`。
- 背景为 P4 紫色。
- 图片宽高 `100%`，`object-fit: cover`。
- 最短展示时间：正常模式 `250ms`，减少动态模式 `0ms`。
- 页面加载兜底超时：`1600ms`。
- 退出动画：向上移动 `102%`，时长 `520ms`。
- 动画后约 `560ms` 移除元素；减少动态模式为 `20ms`。
- 同一浏览会话只展示一次，状态保存在 `sessionStorage` 的 `terminal4-loaded`。

## 6. GlobalFooter：全局页脚

组件位置：[src/components/GlobalFooter.astro](../src/components/GlobalFooter.astro)

### 桌面配置

- 背景：P4 紫 `#7a5980`。
- 文字：P4 灰 `#e1e6e1`。
- 内部宽度：与普通页面相同，最大 `1180px`。
- 最小高度：`126px`。
- 上下内边距：`.9rem = 14.4px`。
- 横向内边距：`clamp(17.6px, 3vw, 44px)`。
- 字号：固定 `14.4px`，字重 `400`，行高 `1.25`。
- 三列布局：`minmax(320px, 1fr) minmax(260px, .75fr) auto`。
- 列间距：`clamp(32px, 6vw, 112px)`。
- 导航两列间距：`clamp(48px, 8vw, 128px)`。
- 右侧版权区域右对齐，字距 `.06em`，颜色为 `72%` 灰色。

### 响应式

- `1050px` 以下：变成两列，版权区域隐藏。
- `900px` 以下：宽度 `100%`，横向内边距 `17.6px`。
- `720px` 以下：变成单列；行间距 `24px`；上下内边距分别为 `32px` 和 `64px`。

## 7. PageHeader：普通页面标题

组件位置：[src/components/ui/PageHeader.astro](../src/components/ui/PageHeader.astro)

### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | 必填 | 主标题 |
| `eyebrow` | `string` | 无 | 标题上方的小标签 |
| `description` | `string` | 无 | 标题下方说明 |
| `id` | `string` | 无 | 标题 ID |
| `compact` | `boolean` | `false` | 缩小标题组件下方留白 |
| `detail` | `boolean` | `false` | 使用详情标题字号和 CJK 字体 |

### Slots

- `description`：需要动态更新内部数字或自定义标记时替代字符串描述。
- `actions`：筛选器、按钮等标题右侧操作区。

### 布局和尺寸

- 桌面为横向 Flex，标题在左、操作区在右、底部对齐。
- 标题与操作区间距：`32px`。
- 默认下方外边距：`clamp(40px, 5vw, 64px)`。
- `compact` 下方外边距：`24px`。
- Eyebrow 字号 `12.48px`，行高 `1`，字距 `.16em`，下方外边距 `8px`。
- 主标题字号：`40.8–60.8px`，行高 `.95`，字距 `-.045em`。
- 详情标题字号：`35.2–51.2px`，行高 `1.05`。
- 描述字号：`16–18px`，行高 `1.55`，最大宽度 `68ch`，顶部外边距 `12px`。
- `700px` 以下改为纵向，区域间距 `16px`，操作区宽 `100%`。

## 8. BackLink：详情页返回链接

组件位置：[src/components/ui/BackLink.astro](../src/components/ui/BackLink.astro)

### 属性

- `href`：必填，稳定的目标路径。
- `label`：必填，显示文字。

### 尺寸和状态

- `inline-flex`，宽度按内容决定。
- 最小高度：`2.5rem = 40px`。
- 图标与文字间距：`8px`。
- 下方外边距：`24px`。
- 字号：`14px`。
- 字距：`.1em`。
- 默认紫色；悬停或键盘聚焦后变珊瑚色，并向左移动 `.2rem = 3.2px`。
- 过渡时间：`160ms`。

## 9. EmptyState：空状态

组件位置：[src/components/ui/EmptyState.astro](../src/components/ui/EmptyState.astro)

### 属性

- `title`：必填。
- `description`：可选。
- `icon`：可选，默认 `ri-inbox-2-line`。

### 尺寸和样式

- 上下内边距：`clamp(48px, 8vw, 96px)`。
- 左右内边距：`24px`。
- 边框：`1px dashed`，P4 紫色混合后约 `28%` 强度。
- 圆角：`20px`。
- 居中排版。
- 图标字号：`40px`，珊瑚色。
- 标题字号：`23.2–30.4px`，顶部外边距 `12px`。
- 描述最大宽度 `42ch`，顶部外边距 `8px`，行高 `1.6`。
- 使用 `aria-live="polite"`，动态出现时不会强行打断读屏。

## 10. MediaFrame：统一图片容器

组件位置：[src/components/ui/MediaFrame.astro](../src/components/ui/MediaFrame.astro)

### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | URL 字符串或 Astro 图片元数据 | 无 | 图片来源；为空时显示占位图标 |
| `alt` | `string` | 必填 | 替代文本 |
| `aspectRatio` | `string` | `4 / 3` | 容器宽高比；传 `auto` 使用图片固有比例 |
| `fit` | `cover` 或 `contain` | `cover` | 图片填充方式 |
| `eager` | `boolean` | `false` | 是否首屏优先加载 |
| `class` | `string` | 空 | 外部附加类名 |

### 加载配置

- 默认 `loading="lazy"`、`decoding="async"`、`fetchpriority="auto"`。
- `eager=true` 时变成 `loading="eager"`、`fetchpriority="high"`。
- 本地 Astro 图片使用构建时优化；字符串 URL 使用普通 `<img>`。

### 视觉状态

- 容器 `position: relative`，默认比例 `4:3`，超出部分隐藏。
- 背景为 `76%` P4 黄与 P4 灰混合。
- 图片宽高 `100%`，使用配置的 `object-fit`。
- 加载中图片透明度 `.25`。
- Shimmer 角度 `105deg`，高光中心约在 `48%`，周期 `1.35s`。
- 图片透明度过渡 `240ms`，缩放过渡 `380ms`。
- 加载失败显示 `IMAGE UNAVAILABLE`，字号 `12.48px`，字距 `.12em`。
- 无 `src` 时显示 `48px` 的图片图标。

## 11. BlogPost：文章详情公共布局

布局位置：[src/layouts/BlogPost.astro](../src/layouts/BlogPost.astro)

样式位置：[src/styles/index.css](../src/styles/index.css)

### 布局尺寸

- 页面上下内边距：顶部 `clamp(32px, 5vw, 64px)`，底部 `clamp(48px, 5vw, 80px)`。
- 主网格最大宽度：`1180px`。
- 桌面两列：正文 `minmax(0, 1fr)`，目录 `210–240px`。
- 正文与目录间距：`clamp(32px, 3.5vw, 56px)`。
- `901–1180px` 时目录调整为 `190–220px`，列间距固定 `32px`。
- `900px` 以下改为单列，目录移到正文之前，顶部外边距 `48px`，目录最大高度 `min(54svh, 520px)`。

### 正文排版

- Article 正文最大宽度：`88ch`；Memo、Review 等其他长正文继续使用 `72ch`。
- Article 详情正文字号：`15–16px`；其他 Markdown 正文仍为 `17–18px`。
- 行高：`1.82`；16px 时 Article 正文实际约 `29.12px`。
- H1：`29.6px`。
- H2：`24.8–28.8px`。
- H3：`20.48px`。
- H4：`17.28px`。
- 引用块内边距：上下 `16px`、左右 `20px`，圆角 `10px`。
- Markdown 图片圆角 `12px`，默认懒加载并异步解码。

## 12. PostTitle：文章标题和元信息

组件位置：[src/components/PostTitle.astro](../src/components/PostTitle.astro)

### 属性

- `title`、`date`：必填。
- `tags`、`lastModified`、`draft`、`readingTime`：可选。

### 视觉配置

- 标题字号：`35.2–51.2px`。
- 字体：`--font-article-title`。
- 字重 `700`、行高 `1`、字距 `-.045em`。
- 元信息为可换行 Flex，顶部和底部外边距各 `.5rem = 8px`。
- 各元信息项右侧间距 `.5rem = 8px`。
- 文章超过 6 个月未更新时显示提示块：内边距 `.5rem = 8px`、字号 `14px`、卡片背景为 P4 黄。

## 13. Toc：文章目录

组件位置：[src/components/Toc.astro](../src/components/Toc.astro)

### 内容范围

- 收集 Markdown H1–H4。
- 每一级缩进增加 `.85rem = 13.6px`。

### 位置和尺寸

- Sticky 顶部位置：`1.5rem = 24px`。
- 最大高度：`100svh - 48px`。
- 容器内边距：顶部 `13.6px`、左右 `11.2px`、底部 `16px`。
- 圆角：`10px`。
- 背景：P4 黄。
- 阴影：`0 6px 18px rgba(74, 47, 79, .08)`。
- 标题和条目字号均为 `15px`。
- 条目行高 `1.35`，垂直内边距 `4px`、水平基础内边距 `3.2px`。
- 条目间距 `.2rem = 3.2px`。
- 超长标题单行省略。
- 当前条目、悬停和聚焦状态变为珊瑚色，字重 `600`。

## 14. ScrollToTop：回到顶部

组件位置：[src/components/ScrollToTop.astro](../src/components/ScrollToTop.astro)

- 只在滚动距离超过 `200px` 后显示。
- 固定位置：底部 `1rem = 16px`，右侧 `.5rem = 8px`。
- 继承 `.header-btn`：上下内边距 `4px`、左右 `8px`，带边框和圆角。
- 点击后平滑滚动到页面顶部。
- 当前组件仍使用 Tailwind 工具类控制位置，未来调整时应保持固定定位和不遮挡正文。

## 15. AskBox：提问框

组件位置：[src/components/AskBox.astro](../src/components/AskBox.astro)

### 属性

- `variant`：`corner` 或 `inline`，默认 `corner`。
- `email`：必填，表单最终通过 `mailto:` 打开邮件客户端。

### Corner 触发器

- 固定在右下角，`z-index: 70`。
- 宽度：`clamp(94px, 7.5vw, 140px)`；`720px` 以下固定 `90px`。
- 宽高比 `1.12`。
- 图标宽度：`clamp(46px, 3.6vw, 64px)`。
- 右侧无内边距；底部和右侧视觉内容内缩约 `16–20px`。
- 背景 P4 紫，使用三角形 `clip-path`。

### Inline 触发器

- 宽度：`clamp(112px, 11vw, 168px)`。
- 宽高比 `1:1`。
- 边框：`3px` P4 紫。
- 图标宽度：容器的 `58%`。
- 悬停或聚焦后背景变黄，旋转 `3deg`，过渡 `200ms`。

### Dialog

- 居中定位：`top: 50%; left: 50%; transform: translate(-50%, -50%)`。
- 宽度：`min(92vw, 560px)`。
- 内容内边距：`clamp(25.6px, 4vw, 48px)`。
- 背景 P4 黄；不规则圆角；向右 `16px`、向下 `18px` 的实色紫色阴影。
- 遮罩：`rgba(63, 39, 67, .5)`，模糊 `6px`。
- 关闭按钮位于右上各 `16px`，尺寸 `42 × 42px`。
- 主标题字号：`41.6–76.8px`。
- 表单标签字号：`.72rem = 11.52px`，字距 `.14em`。
- 输入区域下边框 `3px`，内边距上下 `11.2px`、左右 `4px`。
- 提交按钮内边距上下 `12px`、左右 `16px`，字号 `.82rem = 13.12px`。

## 16. Comment、Waline 和 Giscus

组件位置：

- [src/components/Comment.astro](../src/components/Comment.astro)
- [src/components/WalineComment.astro](../src/components/WalineComment.astro)
- [src/components/GiscusComment.astro](../src/components/GiscusComment.astro)

全局配置位置：[src/consts.ts](../src/consts.ts)

### 当前总开关

- `comment.enable = false`，因此普通文章评论当前不显示。
- `comment.type = 'waline'`。

### Waline 配置

| 配置 | 当前值 |
| --- | --- |
| Server URL | 生产环境使用本站 `/waline-api/` 同源代理；localhost 直连 `https://waline-blog-tau-three.vercel.app/` |
| 语言 | `en` |
| 每页评论数 | `20` |
| Pageview | `true` |
| 必填信息 | nickname、email |
| Reaction | 组件初始化时固定关闭 |
| 独立匿名模式 | 隐藏昵称、邮件、链接，关闭登录和搜索 |
| 图片上传默认上限 | `5MB`，可由环境变量覆盖 |

Waline 的最终视觉尺寸主要来自官方样式和 Memo 页面覆盖规则，不在共同组件中固定宽高；容器始终使用父区域的 `100%` 宽度。

### Giscus 配置

- 当前仓库、分类、主题等字段为空。
- 只有 `comment.enable = true` 且 `comment.type = 'giscus'` 时加载。
- Giscus iframe 宽度由父容器和 Giscus 官方样式决定。

## 17. Donate：赞助组件

组件位置：[src/components/Donate.astro](../src/components/Donate.astro)

样式位置：[src/styles/donate.css](../src/styles/donate.css)

### 当前配置

- `donate.enable = false`，当前不会显示。
- 提示文案：`Thanks for the coffee !!!☕`。
- 支持 Alipay、WeChat Pay 和 PayPal。

### 尺寸

- 组件宽度 `100%`。
- 上下外边距 `40px`。
- 支付图标高度由 `h-4` 设置为 `16px`。
- 每个支付按钮内边距 `8px`。
- 二维码弹层：`200 × 200px`。
- 二维码水平居中：`left: calc(50% - 100px)`。
- 二维码位于组件顶部上方：`top: -170px`。
- 二维码层级：`z-index: 999`。
- 二维码默认隐藏，鼠标经过 Alipay 或 WeChat 项时显示。

## 18. IndexPage：普通页面布局入口

布局位置：[src/layouts/IndexPage.astro](../src/layouts/IndexPage.astro)

### 属性

- `title`、`description`：页面元数据。
- `contentClass`：页面 `<main>` 类名。
- `bodyClass`：页面 `<body>` 类名。
- `frontmatter.comment`：是否在页面尾部显示评论。
- `frontmatter.donate`：是否在页面尾部显示赞助。

IndexPage 本身不定义尺寸。实际页面宽度由传入的 `contentClass` 和共享 Token 控制。

## 19. BaseHead 和不可见公共组件

组件位置：[src/components/BaseHead.astro](../src/components/BaseHead.astro)

这些组件不占据页面可见空间，但属于全局配置：

- 页面 viewport：`width=device-width, initial-scale=1`。
- 浏览器主题色：`#e1e6e1`。
- Windows Tile 颜色：`#7a5980`。
- 默认页面标题格式：`页面标题 - Terminal 4`。
- 全站启用 Astro `ClientRouter`。
- MathJax、Mermaid 只在页面属性开启时加载。
- Google Analytics、Umami、Busuanzi 由全局配置决定；当前 Analytics 总开关为关闭。

## 20. 修改组件时的尺寸检查表

修改共同组件后至少确认：

- `1920 × 1080`：普通页面内容最大宽度是否仍为 `1180px`，标题和页脚左边线是否一致。
- `1482 × 706`：短桌面下标题、筛选器、目录和页脚是否仍完整可见。
- `390 × 844`：页面顶部是否留出约 `88px` 菜单空间，是否无横向滚动。
- 侧栏打开和关闭是否产生 `0px` 布局位移。
- 键盘焦点是否有 `2px` 珊瑚色轮廓和 `3px` 偏移。
- 图片是否预留比例、显示加载状态，并在失败时显示替代状态。
- 所有动画是否遵守 `prefers-reduced-motion`。
- 最后运行 `pnpm verify`。
