---
name: terminal4-maintenance
description: Maintain and extend the Terminal 4 Astro blog while preserving its content conventions, component boundaries, visual contract, ClientRouter behavior, and verification requirements. Use for changes to routes, Astro components, content collections, blog/gallery/review/memo features, styles, assets, or project cleanup in this repository.
---

# Maintain Terminal 4

## Prepare

1. Read `../../../docs/DEVELOPMENT.md`.
2. Read `../../../UI_STYLE_GUIDE.md` before changing visual UI, layout, typography, assets, the sidebar, or interactions.
3. Read `../../../docs/UI_SYSTEM.md` when changing ordinary index/detail/utility pages or shared UI primitives.
4. Inspect `git status` and preserve unrelated user changes.

## Implement

- Keep route files focused on loading data and composing domain components.
- Place page sections in the matching `src/components/<domain>/` folder and page-level CSS in `src/styles/pages/`.
- Build ordinary pages from the primitives in `src/components/ui/` and shared design tokens before adding page-specific equivalents.
- Keep blog content tag-only; remove rather than revive Hexo category metadata.
- Keep Gallery source images in `src/image/gallery/` so Astro can optimize them.
- Bind ClientRouter-aware browser behavior on `astro:page-load` and guard against duplicate listeners.
- Update `src/content.config.ts`, templates, documentation, and creation scripts together when changing a content contract.
- Confirm all references before deleting components, utilities, or assets.

## Verify

1. Run `pnpm check` and fix all errors.
2. Run `pnpm build` or the combined `pnpm verify` command.
3. For UI changes, run `pnpm astro dev status` first. Reuse a server that is already running; otherwise start one with `pnpm astro dev --background`. Inspect affected routes at the viewports required by `UI_STYLE_GUIDE.md`.
4. Check ClientRouter navigation, interactive controls, horizontal overflow, and sidebar layout shift.
5. Stop the background server only if the current task started it. Never stop or restart a server that was already running before validation.

Report the files and user-visible behavior changed, plus the exact verification results.
