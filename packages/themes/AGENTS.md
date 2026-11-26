# themes

`@tc96/themes` holds every theme preset as data and turns it into CSS: the example theme that Storybook renders and the single-theme file `tc96 add --theme <name>` installs.

## Map

- `src/schema/`: the token methodology. Colors per mode in groups (primary, secondary, accent, base, card, popover, muted, destructive, border-input, chart, sidebar, status), with one shadow token in card, popover, border-input, sidebar and chart; typography and other.
- `src/presets/`: one file per preset; `index.ts` sets the order of the toolbar and of the generated CSS, with `twincan`, the tc96 theme, as the base.
- `src/registry/`: preset to CSS (`css.ts`), the `@theme inline` block (`tailwind.ts`), the installable item (`themes.ts`).
- `src/fonts/`: font stacks and Google Fonts links. `src/apply/`: DOM helpers for Storybook and theme pickers, exported from `@tc96/themes` like every other folder.
- `scripts/build-themes.ts`: writes `apps/example/packages/ui/src/themes/presets.css`.

## Dependents

- `packages/registry/src/build-registry.ts` writes `dist/cli/registry/themes/<name>.json`; `packages/registry/src/theme.ts` installs it.
- `apps/storybook/.storybook/preview.ts`, the `Theme picker` story and the `settings-preference-3` fixture read `themeOptions`.

## Invariants

- `twincan` defines every token. Another preset must define every color group but `status`; `status`, `destructive-foreground`, typography and other fall back to `twincan`, so the generated CSS always declares every token (a missing one would inherit the value resolved on `html`).
- `destructive-foreground` is the COSS destructive text on a surface, not text on the destructive fill.
- `fonts` lists only families Google Fonts serves (`onGoogleFonts`) that a stack names first.
- Values may use Tailwind functions (`--alpha()`, `var(--color-*)`), which only the consumer's Tailwind build resolves.
- Shadows are surface tokens drawn in `--shadow-color` (base group, per mode) (`--card-shadow`, `--popover-shadow`, `--input-shadow`, `--sidebar-shadow`, `--chart-shadow`) read in `packages/ui` as `shadow-(shadow:--card-shadow)` and so on. The `shadow:` hint lets the consumer's `tailwind-merge` replace it with `shadow-none`; a named utility (`shadow-card`) is not recognized as a shadow and would survive the merge. Tailwind compiles its own shadow scale into the class, so redefining `--shadow-xs` per theme has no effect. `--spacing` and `--tracking-*` stay out.

## Verify

```bash
bun test packages/themes
bun run themes:check
bun test packages/registry/src/theme.test.ts
```

## Pointers

- Contrast of each preset: `docs/accessibility.md` (`Temas do exemplo`).
- Structure reference: tweakcn (see Credits in the root `AGENTS.md`).
