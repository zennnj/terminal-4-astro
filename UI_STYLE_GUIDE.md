# TERMINAL4 UI Style Guide

This file is the design contract for future maintenance sessions. Read it before changing layout, colors, typography, homepage assets, the sidebar, or interaction styles. The user's latest explicit request takes precedence; when a requested change alters a rule here, update this document in the same change.

## 1. Visual direction

TERMINAL4 uses a hand-drawn editorial style based on the P4 palette. 

Core principles:

- Treat the sidebar as an overlay. Opening it must never reflow or shift page content.
- Prefer the shared palette and font tokens over page-specific hard-coded values.
- Use responsive rules based on both viewport width and viewport height.
- Browser text selection uses a light-purple background with white foreground text.
- Fine-pointer devices use a centered `12px` P4-orange square cursor over ordinary content and a centered `12px` P4-coral red square across the complete subtree of clickable controls and links. Text-entry and disabled controls retain their semantic cursors; touch input is unaffected. Homepage Contact icons have no hover labels. Sidebar labels appear beside and follow the cursor instead of occupying fixed positions beside their icons.

## 2. P4 color palette

The canonical variables live in `src/styles/index.css` on `:root`.

| Token         | Hex       | Primary use                                         |
| ------------- | --------- | --------------------------------------------------- |
| `--p4-orange` | `#F9A620` | Illustration accents and optional highlights        |
| `--p4-purple` | `#7A5980` | Sidebar, footer, dark UI blocks, primary ink        |
| `--p4-coral`  | `#E86252` | Titles, labels, outlines, primary accent            |
| `--p4-gray`   | `#E1E6E1` | Main1 background and light neutral surfaces         |
| `--p4-yellow` | `#F4FFC1` | Main2/Main3 backgrounds and light-on-purple accents |

Semantic aliases such as `--paper`, `--ink`, `--purple`, and `--pink` map to these P4 tokens. New homepage styling should normally reference the `--p4-*` variables directly. Do not introduce a near-duplicate color when an existing token serves the role.

## 3. Typography

Font files are stored in `public/assets/fonts/` and registered in `src/styles/index.css`.

| CSS token              | Font stack                                      | Use                                      |
| ---------------------- | ----------------------------------------------- | ---------------------------------------- |
| `--font-title`         | PP Neue Montreal + CJK heading fallback         | Large section titles                     |
| `--font-display`       | Boba Mono Regular                               | Sentence/quotation headings              |
| `--font-index`         | Wix Madefor Display + explicit system CJK stack | Decorative/index labels and homepage UI |
| `--font-body`          | Explicit system CJK sans-serif stack            | Body copy and ordinary controls          |
| `--font-article-title` | Explicit system CJK heading stack               | Mixed-language article and detail titles |
| `--font-about-copy`    | Maoken Yanbo Song + serif fallback              | ABOUT prose                              |
| `--font-review-ticket` | Xiangcui Kesong + serif fallback                 | REVIEW ticket copy                       |
| `--font-rockwell`      | Local Rockwell + serif fallback                  | REVIEW random label                      |

Rules:

- Body text uses the system CJK sans-serif stack. Wix Madefor Display is reserved for decorative/index text and homepage UI.
- ABOUT ME introduction copy changes only its font family to `--font-body`; preserve its established `700` weight, responsive display size, line height, and Markdown emphasis rendering.
- Large textual titles use PP Neue Montreal Bold.
- Keep local fallback stacks declared in the shared font tokens; do not load replacements from a remote font service.
- Mixed Chinese/Latin copy relies on per-glyph fallback. Keep both stacks explicit so rendering does not depend on an undeclared local font.
- Standard content pages use the shared `--text-*`, `--page-title-size`, and `--detail-title-size` scale.

## 4. Asset organization and configuration

Do not return homepage assets to an unclassified flat folder.

```text
public/assets/
  fonts/                    Local font files
  home/hero/                Main1 layered artwork
    main-pic.png            Character layer
    stickers.png            Sticker layer
    timeline-loading/       Three-pose transparent homepage loader sequence
    timeline-stars/         Three-pose transparent background-star sequence
    timeline-omo1/          Three-pose transparent OMO normal sequence
    timeline-omo2/          Three-pose transparent OMO blink sequence
    title.png               TERMINAL4 title layer
  home/navigation/          Main2 images, masks, and outlines
  ui/
    side-icon.png           Bottom icon in the sidebar
  reviews/
    multigle-orange.png     Shared REVIEW polygon and ASK trigger artwork
```

Homepage copy, links, accounts, and replaceable asset paths belong in `src/config/home.ts`. Prefer changing configuration rather than duplicating markup in `src/pages/index.astro`.

ABOUT ME prose and configuration belong in `src/content/pages/about.md`: the Markdown body is the introduction, while portrait, contacts, playlist, favorites, OTHER, and SOMETHING FUN live in frontmatter. ABOUT SITE prose is authored as Markdown in `src/content/pages/site.md`; its `updates` frontmatter is the shared update log read by the homepage. ABOUT SITE structure cards remain in `src/config/site.ts`.

ABOUT ME embeds the official NetEase Cloud Music playlist player from the `neteasePlaylistId` and `autoplay` values in the Markdown frontmatter. ABOUT sections must size from their configured content; do not reserve viewport-height blocks beneath the hero. Desktop ABOUT ME sections share one left-column width and gap so the introduction, contact links, player, favorites, and OTHER begin on the same right-column axis. SOMETHING FUN is the exception: it spans the full content width, keeps every configured image at its intrinsic aspect ratio without count limits or thumbnail cropping, and opens images in a lightbox.

ABOUT ME section labels (`CONTACT`, `MY PLAYLIST`, `MY FAVORITE`, and similar headings) must never render smaller than the contact-link text beside them.

The ABOUT pages use the shared `.about-gradient-surface` style and `--about-top-gradient` token from `src/styles/index.css`, coral editorial text, and the same overlay sidebar contract as the homepage. Its color stops use `svh`, not percentages, so ABOUT ME and ABOUT SITE render the same color at the same viewport Y coordinate even though their containers have different heights. Do not define separate page gradients or percentage-based stops. The reusable question dialog is `src/components/AskBox.astro`; homepage and ABOUT ME triggers must continue to open the same form behavior. The ABOUT ME inline trigger displays `/assets/reviews/multigle-orange.png` directly, without a circular frame or filled backing shape.

On desktop, ABOUT ME uses a stable `330px` left column and `6rem` column gap. The portrait-to-introduction distance must not vary with viewport or panel width. Below the mobile breakpoint the layout stacks vertically.

For each Main2 card:

- `image` is the replaceable photograph/artwork.
- `mask` supplies the clipping silhouette.
- `outline` is the visible hand-drawn border layer.

Main2 intentionally uses a compact editorial scale: the quotation and four navigation labels must not compete with the artwork, and navigation art is capped at the calibrated midpoint values of `288px` on wide desktop, `275px` on the two-column layout, and `min(70vw, 266px)` on mobile. The centered four-column grid is capped at `1212px` with a compact `12–20px` gap; the two-column grid is capped at `590px`, while the single-column grid is capped at `266px`.

## 5. Homepage structure

The homepage route is composed in `src/pages/index.astro`; its three major panels are implemented in `src/components/home/`:

1. Main1 / hero: neutral gray background, layered character composition, Contact, bottom scroll cue, and homepage-only question box.
2. Main2 / navigation: yellow background, quotation heading, and four large masked navigation cards.
3. Main3 / information: yellow background, homepage-specific About copy, Site Update Log, More links, and purple footer.

The Main3 About text is independent from the `/about` page. Configure it through `homeConfig.about`; do not source it from the About page collection.

## 6. Hero composition and centering

The hero is a single centered `.hero-art` coordinate system. Its centered layers use `left: 50%` plus `translateX(-50%)`.

Layer order:

1. `.hero-stars` — full-panel transparent hand-drawn star sequence; preserve the complete authored composition without cropping on wider screens
2. `.hero-person` — character
3. `.hero-stickers` — stickers with a soft purple drop shadow
4. `.hero-spirit` — OMO/spirit sequence
5. `.hero-title` — nine clipped title-letter layers with a hard-edged purple drop shadow

Current placement intent:

- Person, stickers, and title share the exact viewport center axis.
- `.hero-panel` uses symmetrical horizontal padding. Never use extra left padding to compensate for the sidebar.
- `.hero-art` remains horizontally centered. Because the visible layered content occupies roughly `5%–100%` of its internal canvas, the complete coordinate system uses `translateY(-2.5%)` so the visible person/title composition—not the transparent canvas box—is vertically centered.
- `.hero-art` keeps a fixed `1020 / 940` aspect ratio. Responsive rules may resize the wrapper, but must not independently change its height or reposition/resize the person, stickers, or title.
- OMO intentionally sits left of the person (`top: 11%`, `left: -6%`, `width: min(32%, 290px)`) so it remains prominent without crowding the character. Its authored source frames retain their transparent 1920×1080 canvas; runtime playback uses generated 337×279 display crops in the same asset folders so decoded surfaces match the visible OMO layer. The three unique poses each hold for `100ms`, an accelerated cadence equivalent to playing the original tripled nine-frame source at 30fps. The normal sequence runs four times before the blink sequence runs once.
- The title keeps `bottom: 0` and `width: 88%` at every viewport size so it overlaps only the lower part of the person, matching the Main1 reference relationship. Its nine layers reuse clipped regions of `title.png` while entering from above in left-to-right order after the homepage loader clears. Once the sequence finishes, the clipped layers switch to one complete `title.png` layer so glyph edges and the zero-blur hard shadow cannot be cut by per-letter masks. The scroll triangle stays independently anchored to the panel bottom.
- Main1 uses pointer-responsive depth on the character, stickers, OMO, and title at restrained, distinct levels inside the existing coordinate system. Do not add separate rings, dots, light blobs, or other depth-field ornaments behind the supplied artwork. The top brand and side Contact block stay fixed after their entrance animation. Do not replace the current assets with generic demo copy or cards. Touch devices and `prefers-reduced-motion` remain static.
- The fixed corner question trigger uses `assets/reviews/multigle-orange.png`. Treat its outline as circular: its center sits on the right-triangle incenter so the perpendicular clearance to all three triangle edges is equal, and its complete outline stays inside those edges.

The composition is sized with both width and height constraints, for example:

```css
width: min(68vw, 900px, 85.8svh);
```

Do not replace this with a width-only size or an independently calculated height. The pure `svh` cap intentionally avoids subtracting a fixed `rem` value: browser zoom reduces the CSS viewport, and a fixed subtraction would otherwise make the artwork counter-intuitively shrink after zooming. Browser zoom at 100% does not guarantee a 1920×1080 CSS viewport: Windows display scaling and browser chrome can create a much shorter content viewport and cause width-sized artwork to be cropped.

## 7. Sidebar contract

The shared sidebar is implemented in `src/components/SiteShell.astro` and styled in `src/styles/index.css`.

- Width: `--rail-width: 72px`.
- On desktop, the homepage sidebar remains toggleable. Every other route keeps the sidebar open and replaces the close X with a static white three-bar menu mark without a circular background.
- At `900px` and below, the sidebar starts closed on every route and can be opened or closed with the shared toggle.
- Background: solid `--p4-purple`; no divider line.
- Closed state: the rail is translated off canvas and the purple circular menu button remains visible.
- On the homepage and on narrow screens, the open-state button becomes white with a purple X.
- The toggle, X, navigation icons, and bottom side icon are centered on the same horizontal axis.
- Opening/closing must not add page margin, change content width, or shift the hero. Expected layout shift is `0px`.
- The bottom item uses `public/assets/ui/side-icon.png`.
- ABOUT SITE has no separate information (`i`) navigation icon; the bottom `side-icon.png` remains its sidebar entry.
- Leave modest symmetrical page padding so the overlay does not obscure critical content.
- Article, Memo, Review, Gallery, archive, tag, search, and utility-page layouts center inside the desktop space to the right of the fixed rail. Homepage, ABOUT ME, and ABOUT SITE preserve their full-viewport composition.

Never implement `.rail-open` by changing `.site-content` width, margin, padding, grid columns, or transform.

## 8. Shared page footer and article surfaces

- The purple homepage footer is a global site footer rendered by `src/components/GlobalFooter.astro` on every route.
- The global footer reuses the standard content shell width and inline padding so its HOME column aligns with Article/Memo/Review/Gallery/Search/Tags. Do not change the existing gap between its two navigation columns when adjusting this alignment.
- The global footer uses a fixed `14.4px` font size and a compact `126px` desktop minimum height.
- Standard index/detail/utility pages share `--page-content-width: 1180px`, `--article-shell-width: min(var(--page-content-width), 100%)`, and responsive `--article-shell-padding-inline`. The legacy `--article-*` names remain compatibility aliases until route styles are renamed.
- Article, Memo, Review, Gallery, Search, Tags, 404, and their detail views use the shared page primitives in `src/components/ui/`. Homepage and both About routes are explicit composition exceptions.
- Article lists paginate at 10 posts per page and keep navigation aligned at the lower right. Search and Tag filtering always run against the complete article collection, not only the current static route page; filtered results use their own client-side 10-item pagination while the unfiltered list uses `/articles` for page one and `/articles/page/N` for later pages.
- Article page/count status is compact `--text-xs` metadata immediately above the card list, not a `PageHeader` description.
- Article routes use `/articles` for page one, `/articles/page/N` for later pages, and `/articles/[slug]` for details. Article-detail BACK is a real link to `/articles`, not a `history.back()` control, so ClientRouter navigation cannot leave the URL and rendered page out of sync.
- Article-detail left columns are continuous subtly translucent (`92%` white) panels with the same soft shadow as Article directory cards, plus the shared card radius and responsive inner padding; the TOC remains a separate right-side panel.
- Archive year numerals are transparent background layers with a `2px` P4 orange outline: the first post card overlaps the lower portion of each year.
- Article directory entries are separate subtly translucent (`92%` white) rough-frosted cards with modest gaps, one soft shadow, no pointer tilt or positional hover motion, and a solid P4-yellow hover surface. Archive entries preserve their existing desktop pill and mobile rounded-rectangle shapes while using the same rough-frosted language as a semi-transparent white surface; their hover remains semi-transparent yellow. Each Archive post count sits immediately to the right of its outlined year and is vertically centered against the year glyphs.
- Article/Archive tabs use `--p4-coral` in both active and inactive states.
- Article/Archive and Memos/Junk tabs sit at the upper right of their index toolbar. Article search stays at the upper left as one `36px` collapsed capsule: its single icon is contained inside the capsule, sits flush with the capsule's right end without an inset seam, and travels with that end as the low-profile input expands. Expansion is overlaid and never changes toolbar, tab, or content geometry.
- Memos are local Markdown entries displayed as circular-avatar-led white speech bubbles. The `NOTES IN MOTION` / `MEMOS` / description header follows the same standard shell width, top inset, and PageHeader rhythm as the Review directory. Only the composition below that header breaks out wider on desktop. The left `notes.png` collage and its two fitted text overlays stay sticky. The right paper and three-pose handwritten prompt are page-bound absolute decorations, not sticky or viewport-fixed: they scroll upward with the speech bubbles and remain gone after leaving the viewport. The paper stays behind the feed, extends beyond the right viewport edge, and leaves its doodles visible beside the reserved bubble column; the `100ms`-per-pose prompt stays above the bubbles without colliding with the tabs or paper doodles. The feed must not create its own bordered or clipped scroll panel. Mobile stacks the left collage above the natural-flow feed and removes the overlapping right decoration. Memo frontmatter has no title or tags and may expose a short footnote at the bubble's lower left. Each bubble links to its Waline-backed detail comments. Junk remains a standalone Waline thread: posts newer than 24 hours retain Waline's relative `xx前` time, older posts use local `YYYY-MM-DD HH:mm:ss`, and each `#number` is anchored at its post's upper right.
- Gallery and Review directory shells share the relaxed `clamp(2rem, 4vw, 3.5rem)` desktop top inset and the standard `--article-shell-width` content axis. A Review feature-card redesign must not alter the shared PageHeader typography, shell width, or header spacing unless the user explicitly requests that broader layout change.
- Gallery directory cards use a row-major three-column desktop grid, two columns at medium widths, and a single mobile column. Preserve date-descending DOM order as the visible left-to-right, top-to-bottom order; do not use CSS multi-column flow, which fills vertically before moving to the next column. Each light rounded card insets a square, rounded, cover-cropped thumbnail, followed by a compact body-font title and ISO date; its fixed caption footer anchors the category at lower left and tag chips at lower right. The modal remains the uncropped full-art view.
- Gallery artwork opens in a viewport-filling viewer: a translucent black image canvas occupies the flexible left region while a narrower `300px–350px` P4-gray metadata rail owns the full right edge and scrolls independently. The image keeps its intrinsic proportions with `object-fit: contain` against the complete canvas and no authored inset, following the edge-filling behavior of Twitter media and the About-page Fancybox: portrait art may touch the top and bottom edges, landscape art may touch the side edges, and only aspect-ratio letterboxing remains. Close, `1×–3×` zoom, and circular previous/next controls belong to the image canvas and use restrained white-on-black translucent styling rather than P4-yellow buttons. Navigation wraps through only the currently filtered artworks and mirrors the keyboard Left/Right Arrow behavior; zoom resets when switching or closing. Below `620px`, the viewer stacks the image canvas above the metadata instead of preserving an unusably narrow side rail.
- Sidebar navigation must not close the rail before route navigation; its open state remains visually stable across page transitions. Article directory shell sizing must use a selector specific enough to beat the global `.site-content` rule regardless of ClientRouter stylesheet order, so static Next/Previous navigation cannot change horizontal alignment until refresh.
- Article and mixed-language detail titles use the explicit CJK stack through `--font-article-title`; other display headings continue to use `--font-title`.
- Standard index headings share `--page-title-size`; detail headings share the smaller `--detail-title-size`. REVIEW-detail NOTES and REVIEW headings share `--markdown-h2-size` with Markdown `h2` headings.
- REVIEW-detail metadata labels and values are both fixed at `15px`; compact desktop metadata rows use a `140px` label column and `.85rem` column gap so DESCRIPTION retains a wide reading column.
- REVIEW pages reuse the Article shell padding. On REVIEW detail pages, the back link, title, cover, NOTES, and REVIEW have no extra desktop inset: their left edge must exactly align with the REVIEW directory's large `REVIEW` heading. The back link is a separate row and must not consume a column in the cover/metadata grid.
- REVIEW detail uses a dense overview: the cover column is much narrower than the metadata column, the inter-column gap stays at or below `2.5rem`, metadata rows use a `.6rem` gap, and the title/NOTES/REVIEW vertical spacing must remain compact.
- REVIEW detail reuses the Article table of contents beside the Markdown REVIEW body whenever that body contains level 1–4 headings. If it has no eligible headings, neither the TOC nor an empty side column is rendered. The TOC follows the Article responsive behavior and moves above the Markdown body on narrow screens.
- REVIEW frontmatter uses optional `name` and `originalName` fields with at least one required. Display `name` first and fall back to `originalName`; when both exist, detail metadata also exposes `originalName`. Its optional free-text `verdict` field holds an authored recommendation such as `值得一看` or `可以一看`; REVIEW does not use a numeric rating.
- The REVIEW directory's latest feature replaces only the former yellow feature card with the supplied `review-ticket.png`; it scales inside the existing `.recent-review` region and preserves the surrounding Review page layout. Its centered title block aligns exactly with the ticket's top and bottom horizontal rules and expands with the preferred display name. Titles whose weighted visual length exceeds 10 units split at the middle character into two centered lines and use exactly half of the normal responsive title scale; shorter titles remain on one line. The ticket's center copy is a plain-text excerpt of the first non-empty paragraph in the Markdown review body, not the frontmatter summary. Xiangcui Kesong is used for the ticket title, formal Chinese date, body excerpt, and two-character Chinese type label. All Chinese text overlaid on the ticket is converted at build time to Taiwan Traditional Chinese while source content remains unchanged. The orange and white supplied polygons sit beneath the ticket and rotate slowly around their own centers; the orange polygon carries circular white `RECENTLY · RECENTLY ·` copy. The Rockwell `Random Review` image label sits below the ticket's lower-right corner and selects a random published review on activation.
- Filters keep their established full-width row and yellow capsule feedback, moving down only enough to clear the ticket's label and polygons. Directory entries retain the established full-width wrapping layout, with solid white capsule centers ordered as a category bullet, preferred name, muted parenthesized creator, and date. Pagination continues to measure 10 rendered rows after filtering, font readiness, or width changes.
- The REVIEW directory does not mount a bottom-right mascot. `src/components/reviews/ReviewMascot.astro`, its styles, and its source frames remain available as an unmounted sequence for later migration to another page. Preserve its Homepage `100ms` pose cadence and authored-frame selection of `0000`, `0003`, and `0006`. One sixteen-loop program repeats as eight person-only loops, four person plus `Game is life` loops, then four person plus `Don't you know?` loops. Text and person frames share the same selected pose index; reduced-motion retains a static person frame.
- Article, Memo, Review, and Gallery families use one quiet white `28px` dot matrix over the P4 gray surface. Do not stack light pools, paper grain, or a second texture on those page backgrounds. `surface-noise.svg` is reserved for local rough-frosted card surfaces such as Review Latest, Article cards, and Archive capsules; never apply it as another page background.
- REVIEW category accents are a dedicated five-color palette configured in `src/config/reviews.ts`: GAME `#e36397`, MOVIE `#f6e27f`, ANI/COMIC `#44ccff`, VIDEO `#6e2594`, and BOOK `#169873`.
- Markdown tables of contents include heading levels 1 through 4 and remain vertically scrollable within the viewport.
- Article Markdown body copy is responsive `15px–16px`, uses `1.82` line height, and is capped by `--article-reading-width: 88ch` so it can use more of the existing main column. Other Markdown surfaces retain the shared `17px–18px` scale and `--reading-width: 72ch`. The TOC remains `190px–240px`; collapse to one column at the mobile breakpoint rather than squeezing the reading column.
- ARTICLE descriptions use the base text size; dates, word counts, tags, and secondary metadata use `--text-xs`/`--text-sm`.
- Markdown soft line endings, including consecutive blockquote lines, render as visible single line breaks on CRLF, LF, and CR-authored files.
- Markdown emphasis remains visibly italic for Chinese and Latin text even when the active CJK body font has no native italic face. Inline code uses a conventional neutral code surface with a subtle border and default text color rather than the P4 yellow/coral accent treatment; fenced code blocks keep their existing syntax-highlighting theme.

## 9. Standard page primitives, media, and motion

- `PageHeader.astro` owns eyebrow, title, description, optional actions, and index/detail title scale.
- `BackLink.astro` owns the consistent return affordance on detail routes.
- `EmptyState.astro` owns empty-content messaging.
- `MediaFrame.astro` owns stable aspect ratios, lazy/eager loading, decoding, shimmer state, error state, and image fade-in.
- Standard route CSS belongs in `src/styles/pages/`; route files should primarily load data and compose components.
- Motion uses `--motion-fast`, `--motion-base`, `--motion-slow`, `--motion-page`, and `--ease-standard`. Page entrance motion uses the shared `--motion-page: 900ms` duration; do not give individual routes a faster or slower page entrance.
- Every route uses the shared content-reveal transition on initial load and ClientRouter navigation. Ordinary routes rise into place; Homepage is the intentional direction exception: its hero layers, Contact, Main2 heading/cards, and Main3 content all enter downward from above with the same `--motion-page` duration. Homepage sections reveal as independent scroll stages: Main2 quotation first and its four-card group farther down; Main3 About first and Site/Update Log on a deeper desktop trigger line. Mobile Main3 follows the natural stacked positions. Items inside each stage retain short start-time staggering. The Homepage Scroll cue does not move: it fades in at its final position after its configured delay. The fixed bottom-right question trigger remains outside Homepage motion and permanently available. The transparent `timeline-loading` sequence uses the same accelerated `100ms` pose cadence over a solid `--p4-purple` surface only on the first homepage visit per browser session. The authored Loader source PNGs stay untouched; runtime playback uses generated 745×480 display crops in the same asset folder. All three display frames load at high priority, and the `100ms` cadence begins only after every frame has decoded. Once animation starts it completes at least one `300ms` loop; if the `1000ms` readiness ceiling wins first, the Loader exits from its static first frame instead of starting a late partial loop. It waits only for the critical portrait and title images, then retains the established `.52s` upward exit before starting the hero and title reveals. Main2 navigation images load lazily. Stars and OMO preload after the Loader clears, keep their successfully decoded frames as resident DOM layers, switch visibility without changing `src`, and pause whenever their sequence leaves the viewport; a failed frame leaves the sequence static rather than playing with gaps. ClientRouter preparation displays a non-blocking 3px coral progress line immediately after navigation begins.
- All motion must obey the global `prefers-reduced-motion` rule.
- Static HTML does not need a loading spinner. Use local skeletons only for asynchronously fetched content such as Search or comments.

## 10. Responsive validation

Do not validate only at a nominal 1920×1080 viewport. At minimum check:

- Short desktop content viewport near `1482×706` (representative of Edge at 100% with Windows/browser UI scaling).
- Standard desktop near `1920×1080`.
- Mobile near `390×844`.

For the desktop hero, verify programmatically or visually:

- Person, stickers, title, and `.hero-art` centers differ from the document center by less than 1px.
- Opening the sidebar changes the hero center by exactly 0px.
- The title remains fully visible and does not collide with the bottom scroll cue.
- OMO has clear breathing room from the person.
- The question icon remains inset and has no hover transform.
- There is no horizontal scrollbar.

Use the repository-required background development flow from `AGENTS.md`. Before handing off a layout change, run `pnpm build` and fix actual failures.

### Reference-image layout protocol

When the user supplies a layout reference, treat it as a measurable viewport composition rather than general visual inspiration:

1. Record the reference image's viewport dimensions and the visible bounds of every primary region before editing: header, sidebar, artwork, content column, fixed decorations, and controls.
2. Record each region's motion contract explicitly as `flow`, page-bound `absolute`, `sticky`, or viewport `fixed`. Never infer that adjacent artwork shares a positioning mode. Verify fixed elements by scrolling at least `200px` and asserting a `0px` viewport-position delta; verify page-bound absolute elements move by the same delta as their content container.
3. A supplied reference does not by itself authorize changing an established page shell, PageHeader, typography scale, or content axis. Preserve the existing layout and use the reference to position only the requested additions or replacements. Create and document a route-level layout exception only when the user explicitly asks for that broader change.
4. Define collision-free zones as relationships, not only absolute pixels, so browser zoom remains safe. Desktop Memo requires at least `32px` between the visible sidebar edge and the left collage; the handwritten prompt must sit below the Memo/Junk controls and end before the paper's character doodles begin.
5. Validate at the exact reference aspect/size when available, then at `1482×706`, `1920×1080`, and `390×844`. Compare visible artwork bounds, not transparent source canvases. Crop transparent animation stages to their shared alpha bounds before positioning them.
6. Do not hand off a result as “close” while any requested boundary, overlap, layer order, or scroll behavior differs visibly from the reference. Report the measured landmarks used for acceptance.
7. Before handoff, compare a populated rendered state against the reference, not only component boxes or empty placeholders. Record a small acceptance table containing the reference landmark, rendered landmark, and visible discrepancy for every requested field, artwork edge, and alignment relationship. A component existing in source code does not count as visually verified when the running page omits its data.

## 11. Key files

| File                             | Responsibility                                                     |
| -------------------------------- | ------------------------------------------------------------------ |
| `src/pages/index.astro`          | Homepage route composition                                          |
| `src/components/home/`           | Homepage hero, navigation, and information sections                 |
| `src/components/articles/`       | Article directory sections and interactions                         |
| `src/components/memos/`          | Memo/Junk sections and interactions                                 |
| `src/components/reviews/`        | Review directory sections and interactions                          |
| `src/styles/pages/`              | Route-level styles extracted from page components                   |
| `src/config/home.ts`             | Homepage content, accounts, navigation targets, replaceable images |
| `src/content/pages/about.md`     | ABOUT ME Markdown prose, profile, playlist, favorites, and groups  |
| `src/config/site.ts`             | ABOUT SITE structure cards and update-log display title            |
| `src/content/pages/site.md`      | ABOUT SITE Markdown copy and shared update-log frontmatter          |
| `src/config/reviews.ts`          | Shared review labels and category accent colors                    |
| `src/components/AskBox.astro`    | Shared homepage and ABOUT ME question dialog                       |
| `src/components/SiteShell.astro` | Global overlay sidebar and page shell                              |
| `src/layouts/IndexPage.astro`    | Passes homepage body/content classes into the shell                |
| `src/styles/index.css`           | Shared P4 tokens, fonts, sidebar, and global UI styles             |
| `public/assets/`                 | Organized local visual assets and fonts                            |

## 12. Change checklist

Before completing future UI work:

- [ ] Re-read this guide and the user's latest visual reference.
- [ ] Reuse P4 variables and the three designated fonts.
- [ ] Keep configuration and replaceable image paths in `src/config/home.ts`.
- [ ] Preserve the sidebar overlay contract and centered hero axis.
- [ ] Check both viewport height and width behavior.
- [ ] Test short desktop, standard desktop, and mobile sizes.
- [ ] Run `pnpm build`.
- [ ] Update this guide if the design contract changed.
