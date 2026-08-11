# TERMINAL4 UI Style Guide

This file is the design contract for future maintenance sessions. Read it before changing layout, colors, typography, homepage assets, the sidebar, or interaction styles. The user's latest explicit request takes precedence; when a requested change alters a rule here, update this document in the same change.

## 1. Visual direction

TERMINAL4 uses a hand-drawn editorial style based on the P4 palette. 

Core principles:

- Treat the sidebar as an overlay. Opening it must never reflow or shift page content.
- Prefer the shared palette and font tokens over page-specific hard-coded values.
- Use responsive rules based on both viewport width and viewport height.

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

| CSS token        | Font                        | Use                                                                 |
| ---------------- | --------------------------- | ------------------------------------------------------------------- |
| `--font-title`   | PP Neue Montreal Bold       | Large section titles and strong display headings                    |
| `--font-display` | Boba Mono Regular           | sentence/quotation heading                                          |
| `--font-body`    | Wix Madefor Display Regular | Body copy, small headings, navigation labels, `TERMINAL4` top label |
| `--font-about-copy` | 猫啃网烟波宋-B Bold       | ABOUT ME introduction and ABOUT SITE Markdown copy                  |

Rules:

- Small headings and body text use Wix Madefor Display Regular.
- Large textual titles use PP Neue Montreal Bold.
- Keep local fallback stacks declared in the shared font tokens; do not load replacements from a remote font service.

## 4. Asset organization and configuration

Do not return homepage assets to an unclassified flat folder.

```text
public/assets/
  fonts/                    Local font files
  home/hero/                Main1 layered artwork
    main-pic.png            Character layer
    stickers.png            Sticker layer
    omo.png                 OMO/spirit layer; may later become a GIF
    title.png               TERMINAL4 title layer
  home/navigation/          Main2 images, masks, and outlines
  ui/
    side-icon.png           Bottom icon in the sidebar
    corner-icon.png         Homepage question-box icon
```

Homepage copy, links, accounts, and replaceable asset paths belong in `src/config/home.ts`. Prefer changing configuration rather than duplicating markup in `src/pages/index.astro`.

ABOUT ME prose and configuration belong in `src/content/pages/about.md`: the Markdown body is the introduction, while portrait, contacts, playlist, favorites, OTHER, and SOMETHING FUN live in frontmatter. ABOUT SITE prose is authored as Markdown in `src/content/pages/site.md`; its `updates` frontmatter is the shared update log read by the homepage. ABOUT SITE structure cards remain in `src/config/site.ts`.

ABOUT ME embeds the official NetEase Cloud Music playlist player from the `neteasePlaylistId` and `autoplay` values in the Markdown frontmatter. ABOUT sections must size from their configured content; do not reserve viewport-height blocks beneath the hero. Desktop ABOUT ME sections share one left-column width and gap so the introduction, contact links, player, favorites, OTHER, and SOMETHING FUN all begin on the same right-column axis.

ABOUT ME section labels (`CONTACT`, `MY PLAYLIST`, `MY FAVORITE`, and similar headings) must never render smaller than the contact-link text beside them.

The ABOUT pages use a yellow-to-gray gradient at the top, coral editorial text, and the same overlay sidebar contract as the homepage. The reusable question dialog is `src/components/AskBox.astro`; homepage and ABOUT ME triggers must continue to open the same form behavior.

For each Main2 card:

- `image` is the replaceable photograph/artwork.
- `mask` supplies the clipping silhouette.
- `outline` is the visible hand-drawn border layer.

## 5. Homepage structure

The homepage implementation is `src/pages/index.astro` and contains three major panels:

1. Main1 / hero: neutral gray background, layered character composition, Contact, bottom scroll cue, and homepage-only question box.
2. Main2 / navigation: yellow background, quotation heading, and four large masked navigation cards.
3. Main3 / information: yellow background, homepage-specific About copy, Site Update Log, More links, and purple footer.

The Main3 About text is independent from the `/about` page. Configure it through `homeConfig.about`; do not source it from the About page collection.

## 6. Hero composition and centering

The hero is a single centered `.hero-art` coordinate system. Its centered layers use `left: 50%` plus `translateX(-50%)`.

Layer order:

1. `.hero-person` — character
2. `.hero-stickers` — stickers with a soft purple drop shadow
3. `.hero-spirit` — OMO/spirit
4. `.hero-title` — title image with a soft purple drop shadow

Current placement intent:

- Person, stickers, and title share the exact viewport center axis.
- `.hero-panel` uses symmetrical horizontal padding. Never use extra left padding to compensate for the sidebar.
- `.hero-art` has no top margin; its box is vertically and horizontally centered.
- OMO intentionally sits left of the person (`top: 11%`, `left: -6%`) so it does not crowd the character.
- On short desktop viewports, the title is raised and the scroll triangle stays at the bottom.

The composition is sized with both width and height constraints, for example:

```css
width: min(76vw, 1020px, calc(100svh - 4.5rem));
```

Do not replace this with a width-only size. Browser zoom at 100% does not guarantee a 1920×1080 CSS viewport: Windows display scaling and browser chrome can create a much shorter content viewport and cause width-sized artwork to be cropped.

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
- The global footer reuses the Article shell width and inline padding so its HOME column aligns with the shared Article/Memo/Review/Gallery content line. Do not change the existing gap between its two navigation columns when adjusting this alignment.
- The global footer uses a fixed `14.4px` font size and a compact `126px` desktop minimum height.
- Article, Memo, Review, and Gallery index/detail pages share `--article-shell-width: min(1240px, calc(100% - 27rem))` and `--article-shell-padding-inline: 2.5rem`, producing one enlarged desktop left-content line. At `900px` and below, their shell width becomes `100%` with `1.1rem` inline padding.
- Unless a page has an explicit exception, Memos, Reviews, Gallery, their detail views, and article detail reuse the Article hub's `--article-shell-width` and `--article-shell-padding-inline` values. Homepage and About are explicit exceptions.
- Article lists paginate at 10 posts per page and keep navigation aligned at the lower right.
- Article-detail BACK is a real link to `/blog/1`, not a `history.back()` control, so ClientRouter navigation cannot leave the URL and rendered page out of sync.
- Archive year numerals are background layers: the first post card overlaps the lower portion of each outlined year.
- Archive post cards use a solid surface slightly lighter than the page gray so the outlined year stays visibly behind the cards.
- Article/Archive tabs use `--p4-coral` in both active and inactive states.
- Sidebar navigation must not close the rail before route navigation; its open state remains visually stable across page transitions.
- Article titles use the `Noto Sans SC` stack through `--font-article-title`; other display headings continue to use `--font-title`.
- ARTICLE and REVIEW page/detail titles share the canonical responsive size `--article-detail-title-size: clamp(2.4rem, 4vw, 3.8rem)`. ARTICLE and REVIEW index headings keep `--font-title`; article-detail titles and latest-review titles use `Noto Sans SC` through `--font-article-title`. REVIEW-detail NOTES and REVIEW headings use `--font-title` and share `--markdown-h2-size: 1.55rem` with Markdown `h2` headings.
- REVIEW-detail metadata labels and values are both fixed at `15px`; compact desktop metadata rows use a `140px` label column and `.85rem` column gap so DESCRIPTION retains a wide reading column.
- REVIEW pages reuse the Article shell padding. On REVIEW detail pages, the back link, title, cover, NOTES, and REVIEW have no extra desktop inset: their left edge must exactly align with the REVIEW directory's large `REVIEW` heading. The back link is a separate row and must not consume a column in the cover/metadata grid.
- REVIEW detail uses a dense overview: the cover column is much narrower than the metadata column, the inter-column gap stays at or below `2.5rem`, metadata rows use a `.6rem` gap, and the title/NOTES/REVIEW vertical spacing must remain compact.
- The REVIEW directory uses a compact yellow latest-review feature card. Its orange `Latest` burst intentionally overlaps outside the card's upper-left edge, while the Noto Sans SC `Latest` text must remain fully contained inside the orange burst. The card is followed by a two-column desktop list. Filter selection is a contained capsule. Category markers are circles, dates remain visible, and filtered results paginate at 20 entries per page with a bottom page count and navigation.
- REVIEW category accents are a dedicated five-color palette configured in `src/config/reviews.ts`: GAME `#e36397`, MOVIE `#f6e27f`, ANI/COMIC `#44ccff`, VIDEO `#6e2594`, and BOOK `#169873`.
- Markdown tables of contents include heading levels 1 through 4 and remain vertically scrollable within the viewport.
- Article Markdown body copy is `16px`; TOC headings and entries are `15px`. Article detail keeps the original body left edge, the original `clamp(2rem, 3.5vw, 3.5rem)` body-to-TOC gap, and the original `210px–240px` TOC column. Its grid alone grows 5rem to the right (`min(1320px, calc(100% - 22rem))`), so all added width belongs to the body column and the right outer margin becomes smaller. Do not center, translate, or resize either panel to achieve this.
- ARTICLE index descriptions are `15px`; dates and word counts are `12px`; page summaries plus TOTAL/TAGS labels are `14.5px`; article and filter tags are `12.5px`.
- Markdown soft line endings, including consecutive blockquote lines, render as visible single line breaks on CRLF, LF, and CR-authored files.

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

## 11. Key files

| File                             | Responsibility                                                     |
| -------------------------------- | ------------------------------------------------------------------ |
| `src/pages/index.astro`          | Homepage structure, local responsive layout, homepage interactions |
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
