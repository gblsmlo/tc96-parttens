import type { ApiReferenceEntry } from '../../../.storybook/docs-page.tsx'

const insetRow =
  '| `inset` | `boolean` | - | Adds left padding to align with items that have icons |'

export const menuApi = {
  Menu: {
    description:
      'Root component. Alias for `Menu.Root` from Base UI. Also exported as `DropdownMenu`.',
    name: 'Menu',
  },
  MenuCheckboxItem: {
    description: `Checkbox menu item. Also exported as \`DropdownMenuCheckboxItem\`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`"default"\` or \`"switch"\` | \`"default"\` | Display style; \`switch\` shows a toggle switch indicator |

The \`switch\` variant only changes the indicator: the item is still a \`menuitemcheckbox\`. COSS puts the check before the label; this workspace edits \`MenuCheckboxItem\` so it sits in a trailing column, as in \`SelectItem\` and the switch, and the label starts where the other items' labels do.`,
    name: 'MenuCheckboxItem',
  },
  MenuGroup: {
    description:
      'Groups related menu items. Alias for `Menu.Group` from Base UI. Also exported as `DropdownMenuGroup`.',
    name: 'MenuGroup',
  },
  MenuGroupLabel: {
    description: `Label for a menu group. Also exported as \`DropdownMenuLabel\`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
${insetRow}`,
    name: 'MenuGroupLabel',
  },
  MenuItem: {
    description: `Individual menu item. Also exported as \`DropdownMenuItem\`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
${insetRow}
| \`variant\` | \`"default"\` or \`"destructive"\` | \`"default"\` | Controls the item styling |

When items with and without icons are mixed, set \`inset\` on the items without an icon to keep the labels aligned; this workspace sets the inset padding to the label start after an icon (COSS leaves it 4px further). A disabled item ignores the pointer, so a tooltip never opens on it: say why it is disabled inside the item.

With a coarse pointer every item, link, checkbox, radio and submenu trigger is at least 44px tall (\`pointer-coarse:min-h-11\`), an edit of this workspace.`,
    name: 'MenuItem',
  },
  MenuLinkItem: {
    description: `Link menu item for navigation. Renders a native \`<a>\` when \`href\` is passed, styled like \`MenuItem\`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
${insetRow}
| \`variant\` | \`"default"\` or \`"destructive"\` | \`"default"\` | Controls the item styling |
| \`closeOnClick\` | \`boolean\` | \`true\` | Whether the menu closes when the link is clicked |

Use \`href\` only for plain anchor links. With a router link, keep it in \`render\`: \`<MenuLinkItem render={<Link href="/docs" />}>\`.`,
    name: 'MenuLinkItem',
  },
  MenuPopup: {
    description: `Popup container that displays the menu content. Also exported as \`DropdownMenuContent\`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`side\` | \`"top"\`, \`"bottom"\`, \`"left"\` or \`"right"\` | \`"bottom"\` | Side of the trigger to position the popup |
| \`align\` | \`"start"\`, \`"center"\` or \`"end"\` | \`"center"\` | Alignment relative to the trigger |
| \`sideOffset\` | \`number\` | \`4\` | Distance from the trigger in pixels |
| \`alignOffset\` | \`number\` | - | Offset along the alignment axis |
| \`portalProps\` | \`Menu.Portal.Props\` | - | Props forwarded to the internal portal (\`keepMounted\`, \`container\`, etc.); see Base UI Menu portal API |

This workspace edits the popup: it is at least 160px wide (\`min-w-40\`, also when a \`w-*\` class is passed) and pads its items by 8px (\`p-2\`); COSS uses \`min-w-32\` only without a \`w-*\` class, and \`p-1\`.`,
    name: 'MenuPopup',
  },
  MenuRadioGroup: {
    description:
      'Groups radio menu items. Alias for `Menu.RadioGroup` from Base UI. Also exported as `DropdownMenuRadioGroup`.',
    name: 'MenuRadioGroup',
  },
  MenuRadioItem: {
    description:
      'Radio menu item. Styled wrapper for `Menu.RadioItem` from Base UI. Also exported as `DropdownMenuRadioItem`. COSS puts the check before the label; this workspace edits `MenuRadioItem` so it sits in a trailing column, as in `SelectItem`.',
    name: 'MenuRadioItem',
  },
  MenuSeparator: {
    description:
      'Visual separator between menu items. Styled wrapper for `Menu.Separator` from Base UI. Also exported as `DropdownMenuSeparator`.',
    name: 'MenuSeparator',
  },
  MenuShortcut: {
    description:
      'Displays keyboard shortcut text. Custom component, not a Base UI wrapper. Also exported as `DropdownMenuShortcut`. This workspace renders it with `aria-hidden`, so the shortcut stays out of the item name; announce it with `aria-keyshortcuts` on the item (`<MenuItem aria-keyshortcuts="Meta+K">`).',
    name: 'MenuShortcut',
  },
  MenuSub: {
    description:
      'Submenu container. Alias for `Menu.SubmenuRoot` from Base UI. Also exported as `DropdownMenuSub`.',
    name: 'MenuSub',
  },
  MenuSubPopup: {
    description: `Popup for submenu content. Also exported as \`DropdownMenuSubContent\`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`align\` | \`"start"\`, \`"center"\` or \`"end"\` | \`"start"\` | Alignment relative to the trigger |
| \`sideOffset\` | \`number\` | \`0\` | Distance from the trigger in pixels |
| \`alignOffset\` | \`number\` | \`-5\` | Offset along the alignment axis; \`-5\` when \`align\` is not \`"center"\` |`,
    name: 'MenuSubPopup',
  },
  MenuSubTrigger: {
    description: `Trigger for opening a submenu. Also exported as \`DropdownMenuSubTrigger\`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
${insetRow}`,
    name: 'MenuSubTrigger',
  },
  MenuTrigger: {
    description:
      'Trigger button that opens the menu. Alias for `Menu.Trigger` from Base UI. Also exported as `DropdownMenuTrigger`.',
    name: 'MenuTrigger',
  },
} satisfies Record<string, ApiReferenceEntry>

export type MenuPart = keyof typeof menuApi

export const menuParts: readonly MenuPart[] = [
  'Menu',
  'MenuTrigger',
  'MenuPopup',
  'MenuGroup',
  'MenuItem',
  'MenuLinkItem',
  'MenuCheckboxItem',
  'MenuRadioGroup',
  'MenuRadioItem',
  'MenuGroupLabel',
  'MenuSeparator',
  'MenuShortcut',
  'MenuSub',
  'MenuSubTrigger',
  'MenuSubPopup',
]
