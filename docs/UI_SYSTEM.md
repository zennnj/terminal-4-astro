# Terminal 4 UI system

This is the practical entry point for ordinary content-page work. `UI_STYLE_GUIDE.md` remains the visual contract; this file explains how to apply it.

## Page families

- Special compositions: `/`, `/about`, and `/site`. Preserve their dedicated layout rules.
- Index pages: Article, Memo, Review, Gallery, Search, and Tags. Use the standard shell and `PageHeader`.
- Index toolbars place view-switching tabs at the upper right. Article search is a single `36px` capsule at the upper left; it expands without reflow while its only icon remains flush with the capsule's right end, with no inset ring or seam. Gallery and Review share a relaxed `clamp(2rem, 4vw, 3.5rem)` desktop shell top inset.
- Article page/count status belongs directly above the card list as compact metadata; do not pass it to `PageHeader.description`. Search and Tag filters operate on the complete collection and paginate matching results at 10 items per client-side page; the unfiltered state uses `/articles` for page one and `/articles/page/N` for later pages. Article list entries use separate `92%` white rough-frosted cards with gaps and a static yellow hover state. Archive year numerals use transparent fill and a P4 orange outline, with each post count centered immediately to the year's right; archive entry shapes stay unchanged while their surfaces use semi-transparent rough-frosted white and yellow.
- Memo directory entries are local Markdown rendered as compact, circular-avatar-led speech bubbles. On desktop the page retains its natural vertical scroll and the square-corner notes from `src/config/memos.ts` stay in view through sticky positioning; the feed does not own a nested scroll container. Mobile uses natural page flow. Memo frontmatter omits title and tags, with an optional lower-left footnote. Per-entry comments remain on the Waline-backed detail route. Junk is a standalone Waline thread whose first-day timestamps remain relative, whose older timestamps use `YYYY-MM-DD HH:mm:ss`, and whose post numbers sit at the upper right.
- Detail pages: Article, Memo, and Review details. Use `BackLink`, the detail title scale, readable content width, and optional TOC/media regions. Article details place the full left column in one `92%` white, shared-radius panel with the Article directory card shadow while keeping the TOC separate.

## Shared primitives

```astro
---
import PageHeader from '@/components/ui/PageHeader.astro';
import BackLink from '@/components/ui/BackLink.astro';
import EmptyState from '@/components/ui/EmptyState.astro';
import MediaFrame from '@/components/ui/MediaFrame.astro';
---
```

- `PageHeader`: pass `title`, optional `eyebrow`, `description`, `compact`, or `detail`. Use the `actions` slot for filters and the `description` slot when live values must update.
- `BackLink`: pass a stable route and label; do not use `history.back()` for primary navigation.
- `EmptyState`: use when a collection or filtered result is empty.
- `MediaFrame`: pass local `ImageMetadata` or a string URL, `alt`, `aspectRatio`, `fit`, and optional `eager`. Use eager loading only for critical above-the-fold media.
- Gallery modal media is the exception to intrinsic directory sizing: its frame stretches across the available modal image column without inner padding, uses `object-fit: contain`, and stays transparent over the single purple preview canvas; the adjacent description rail explicitly retains its P4-gray surface. The transparent outer dialog allows its navigation buttons to sit beyond the rounded, shadowed content layer; edge buttons and the Left/Right Arrow keys cycle through the current filtered artwork set and wrap at both ends.
- Gallery directory cards use a row-major three-column grid on desktop, two columns at medium widths, and one column on mobile so date-descending source order is also the visible left-to-right, top-to-bottom order. Each light rounded card insets a square, rounded, cover-cropped preview, then shows a compact body-font title and ISO date; the fixed caption footer anchors the category at lower left and tag chips at lower right. The modal continues to show the complete uncropped artwork.

## Tokens

Use the shared values in `src/styles/index.css`:

- Type: `--text-xs` through `--text-xl`, `--page-title-size`, `--detail-title-size`.
- Space: `--space-1` through `--space-8`.
- Shape: `--radius-control`, `--radius-card`, `--radius-pill`.
- Layout: `--page-content-width`, `--reading-width`, `--article-shell-width`, `--article-shell-padding-inline`.
- Motion: `--motion-fast`, `--motion-base`, `--motion-slow`, `--motion-page`, `--ease-standard`.

Avoid one-off `clamp()` values for a role already represented by a token.

## Interaction states

All routes inherit the shared `900ms` non-blocking page reveal from `.site-content`. ClientRouter swaps replay that duration and show the shared preparation progress line. Ordinary routes rise into place. Homepage is the direction exception: its hero artwork and Contact, Main2 heading/cards, and Main3 groups all descend from above with the same duration and short staggered starts. Main2 quotation and card grid are separate scroll stages; Main3 About and Site/Update Log are also separate, with the latter using a deeper desktop trigger line. Fine-pointer desktop Main1 applies restrained multi-depth pointer parallax only to its supplied character, sticker, OMO, and title layers; no separate rings, dots, or light blobs sit behind them, and the top brand and side Contact block stay fixed after entering. Touch and reduced-motion modes stay static. The Scroll cue stays in place and fades in after its configured delay; the fixed question trigger never participates in motion. The full-screen `loading.png` remains a homepage-only, once-per-session exception; the hero layers and clipped title letters begin only after that overlay clears.

Article, Memo, Review, and Gallery families use only the shared quiet white `28px` dot matrix over P4 gray. Do not combine it with light pools or paper grain. Review's supplied ticket, rotating polygon layers, random label, and page-bound mascot are explicit local artwork layers over that single page surface; they do not change the standard Review shell or PageHeader. The mascot is neither fixed nor sticky: it is absolutely anchored to the Review page's lower-right content region, with the visible person's right edge aligned approximately to the ticket's right edge.

The Review mascot follows the Homepage sequence convention: its nine exported files contain three repeated copies of each pose, so only frame numbers `0000`, `0003`, and `0006` play at `100ms` per pose. Its sixteen-loop phase order is eight person-only loops, four `Game is life` loops, then four `Don't you know?` loops.

Review ticket overlays render Chinese copy as Taiwan Traditional Chinese through a server/build-time converter; authored content remains untouched. The ticket center uses a plain-text excerpt of the Markdown body's first non-empty paragraph rather than the frontmatter `summary`. Review metadata uses the optional free-text `verdict` field for recommendations such as `值得一看`; numeric ratings are not part of the content contract.

The Review directory uses content-width ABOUT-style capsules rather than a fixed card grid. Each white-filled capsule keeps its small category bullet, preferred `name`/`originalName`, muted creator, and date together; filters expose hover/focus feedback, and pagination measures the responsive full-width wrapping layout at 10 visual rows per page. The directory begins only after the ticket's random label and rotating artwork have sufficient vertical clearance.

Every asynchronous or filterable feature should define the applicable states:

1. Initial or idle.
2. Loading.
3. Populated.
4. Empty.
5. Error.

Buttons that represent a selected view or filter use `aria-pressed`. Keyboard focus must remain visible. ClientRouter behavior binds on `astro:page-load` and guards duplicate listeners when elements persist.

On fine-pointer devices, ordinary content inherits the shared orange-square cursor from `src/styles/index.css`. Semantic interactive elements must be represented by links, buttons, form controls, or an appropriate ARIA role so their complete child subtree receives the red-square interactive cursor without flickering back to the ordinary state. Text-entry and disabled controls keep their native semantic cursors. Sidebar link labels are rendered by the shared cursor-following label; Homepage Contact icons intentionally expose no visual hover label.

## Verification

Run `pnpm verify`, then inspect standard pages at `1482x706`, `1920x1080`, and `390x844`. Check title hierarchy, readable line length, horizontal overflow, media loading/error states, keyboard focus, filters/search, ClientRouter navigation, and sidebar layout shift.
