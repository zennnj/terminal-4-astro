## Required UI reference

Before changing layout, colors, typography, homepage assets, the sidebar, or interactive UI, read [UI_STYLE_GUIDE.md](./UI_STYLE_GUIDE.md). Treat it as the current design contract unless the user explicitly requests a change to that contract.

## Development

Follow [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for project structure, content conventions, checks, and review requirements.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Before handing off code changes, run:

```
pnpm verify
```

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
