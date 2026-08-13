# Terminal 4 development workflow

## Source organization

- Keep route files in `src/pages/` focused on loading route data and composing components.
- Put page-section components under a domain folder such as `src/components/home/`, `articles/`, `memos/`, or `reviews/`.
- Put page-level styles in `src/styles/pages/`. Scope selectors under the route shell class when a name could collide with another page.
- Keep reusable site chrome in `src/components/`, shared layouts in `src/layouts/`, and editable site content/configuration in `src/content/` and `src/config/`.
- Build ordinary index/detail/utility routes from the primitives in `src/components/ui/` before adding route-specific equivalents.
- Prefer extracting a section when a route mixes several independent sections, client interactions, or grows beyond roughly 250 lines.

## Content conventions

- `blog` supports tags but not categories. Do not add Hexo `category` or `categories` fields back to migrated posts.
- Keep optimized Gallery source images in `src/image/gallery/`; do not duplicate them under `public/gallery/`.
- Keep legacy article images under `public/images/` unless an article is deliberately migrated to Astro image imports.
- Add or change collection fields in `src/content.config.ts` before relying on them in components or utilities.

## Change workflow

1. Read `UI_STYLE_GUIDE.md` before any visual, layout, typography, asset, sidebar, or interaction change.
2. Inspect existing imports before deleting files; Astro component references are static and should be searchable.
3. Keep route data preparation on the server and DOM behavior in the component that owns the affected markup.
4. Run `pnpm check` while developing and fix errors instead of suppressing them.
5. Run `pnpm verify` before handoff. For UI changes, also compare the affected routes at `1482x706`, `1920x1080`, and `390x844`.

Start the development server in the repository-required background mode:

```bash
pnpm astro dev --background
pnpm astro dev status
pnpm astro dev logs
pnpm astro dev stop
```

Check `pnpm astro dev status` before starting UI validation. Treat a server that was already running as user-owned: reuse it and leave it running after validation. Stop the server only when the current task started it. Do not restart a pre-existing server merely to obtain a clean session.

## Review checklist

- No unused components, utilities, or duplicate assets were introduced.
- Route files remain composition-focused.
- Client scripts are safe across Astro ClientRouter navigation and bind on `astro:page-load` without duplicate listeners.
- Async UI exposes loading, empty, and error states; images reserve space and use the shared media-frame behavior where possible.
- `pnpm check` reports zero errors and `pnpm build` succeeds.
- Visual changes follow `UI_STYLE_GUIDE.md`, with no sidebar-induced layout shift or horizontal overflow.
