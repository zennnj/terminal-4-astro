# Terminal 4 UI system

This is the practical entry point for ordinary content-page work. `UI_STYLE_GUIDE.md` remains the visual contract; this file explains how to apply it.

## Page families

- Special compositions: `/`, `/about`, and `/site`. Preserve their dedicated layout rules.
- Index pages: Article, Memo, Review, Gallery, Search, and Tags. Use the standard shell and `PageHeader`.
- Index toolbars place view-switching tabs at the upper right; Article search occupies the upper left. Gallery and Review share a relaxed `clamp(2rem, 4vw, 3.5rem)` desktop shell top inset.
- Article page/count status belongs directly above the card list as compact metadata; do not pass it to `PageHeader.description`. Archive year numerals use transparent fill and a P4 orange outline.
- Detail pages: Article, Memo, and Review details. Use `BackLink`, the detail title scale, readable content width, and optional TOC/media regions.

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

## Tokens

Use the shared values in `src/styles/index.css`:

- Type: `--text-xs` through `--text-xl`, `--page-title-size`, `--detail-title-size`.
- Space: `--space-1` through `--space-8`.
- Shape: `--radius-control`, `--radius-card`, `--radius-pill`.
- Layout: `--page-content-width`, `--reading-width`, `--article-shell-width`, `--article-shell-padding-inline`.
- Motion: `--motion-fast`, `--motion-base`, `--motion-slow`, `--motion-page`, `--ease-standard`.

Avoid one-off `clamp()` values for a role already represented by a token.

## Interaction states

All routes inherit the shared `900ms` non-blocking page reveal from `.site-content`. ClientRouter swaps replay that duration and show the shared preparation progress line. Ordinary routes rise into place. Homepage is the direction exception: its hero artwork and Contact, Main2 heading/cards, and Main3 groups all descend from above with the same duration and short staggered starts. Main2/Main3 still wait until the panel is deeper in view. The Scroll cue stays in place and fades in after 5 seconds; the fixed question trigger never participates in motion. The full-screen `loading.png` remains a homepage-only, once-per-session exception; the hero layers and clipped title letters begin only after that overlay clears.

Article, Memo, Review, and Gallery families use only the shared quiet white `28px` dot matrix over P4 gray. Do not combine it with light pools or paper grain. The Review latest card is opaque yellow frosted material: retain its local `/assets/ui/surface-noise.svg` roughness, single soft shadow, pointer tilt, orange hover light spot, and transparent Markdown excerpt background.

Every asynchronous or filterable feature should define the applicable states:

1. Initial or idle.
2. Loading.
3. Populated.
4. Empty.
5. Error.

Buttons that represent a selected view or filter use `aria-pressed`. Keyboard focus must remain visible. ClientRouter behavior binds on `astro:page-load` and guards duplicate listeners when elements persist.

## Verification

Run `pnpm verify`, then inspect standard pages at `1482x706`, `1920x1080`, and `390x844`. Check title hierarchy, readable line length, horizontal overflow, media loading/error states, keyboard focus, filters/search, ClientRouter navigation, and sidebar layout shift.
