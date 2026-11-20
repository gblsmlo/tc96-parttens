# Menu accessibility

Local accessibility and usability decisions for the menu parts. The repo-wide rules (WCAG thresholds, contrast fixed without changing token values, axe in every story) are in `docs/accessibility.md`; this file holds what applies only to the menu. Measured on 2026-11-19 in the `UI/Menu` stories, `Default` theme preset.

## Roles and names

- Base UI renders `role="menu"` on the popup and `menuitem`, `menuitemcheckbox` and `menuitemradio` on the items, with `aria-checked`, `aria-disabled`, `aria-haspopup` and `aria-expanded` where they apply. The popup takes its name from the trigger.
- `MenuShortcut` renders `aria-hidden`, so the item name is its label alone (`"Edit"`, not `"Edit ⌘E"`). An item with a shortcut announces it with `aria-keyshortcuts` (`<MenuItem aria-keyshortcuts="Meta+E">`).
- The `switch` variant of `MenuCheckboxItem` only changes the indicator: the item stays a `menuitemcheckbox`.

## Keyboard and focus

- Arrow keys move the highlight, `ArrowRight` opens a submenu, `Escape` closes, typing jumps to an item (Base UI). Focus moves to the highlighted item and returns to the trigger on close.
- Keyboard focus shows as a 2px `--ring` outline inside the item, from the theme rule `[role^="menuitem"][data-slot^="menu-"]:focus-visible`. The COSS highlight alone (`data-highlighted:bg-accent`) measures 1.09:1 against `--popover` in light; the outline measures 4.73:1 (light) and 3.52:1 (dark). A pointer hover does not put the item in `:focus-visible`, so it shows the highlight only.

## Contrast

| Pair | Light | Dark | Note |
| --- | --- | --- | --- |
| focus outline (`--ring`) on `--popover` | 4.73:1 | 3.52:1 | non-text, 3:1 |
| `MenuShortcut` (`--muted-foreground`) on `--popover` | 5.73:1 | 5.10:1 | the COSS `/72` measured 3.14:1; the theme rule `[data-slot="menu-shortcut"]` drops the opacity |
| destructive item (`--destructive-foreground`) on `--popover` | 6.42:1 | | |
| destructive item on the highlight (`--accent`) | 5.89:1 | | |

The dark shortcut ratio comes from the `muted-foreground` on `popover` record in `docs/accessibility.md` (`record-preview`); the light values were measured here. Disabled items (`opacity-64`) are exempt from contrast (WCAG 1.4.3).

## Pointer and touch

- Items are 44px tall with a coarse pointer (`pointer-coarse:min-h-11`), 32px below `sm` and 28px from `sm` with a fine pointer.
- A disabled item ignores the pointer, so a tooltip never opens on it: the reason goes inside the item (`Pause` with `Nothing is playing`).

## Layout that carries meaning

- The check of `MenuCheckboxItem` and `MenuRadioItem` sits in a trailing column, so every label in a mixed menu starts at the same edge, as in `SelectItem` and the `switch` variant.
- `inset` lines a label without an icon up with the labels after an icon.

## Verified by

The plays in `apps/storybook/src/ui/menu/` check the trailing check, the inset alignment, the focus outline, the shortcut name and the disabled reason; axe runs on every story in the `storybook` and `storybook-dark` projects.
