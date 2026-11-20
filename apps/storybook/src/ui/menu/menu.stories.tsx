import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from '@tc96/ui/menu'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'
import { IconSlot, Slot } from '../../patterns/records/group/fixtures/slot'
import { menuApi, menuParts } from './menu-api.ts'

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

interface MenuStoryArgs {
  align: Align
  modal: boolean
  onOpenChange: (open: boolean) => void
  side: Side
}

const usage = `
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from '@acme/ui/menu'

<Menu>
  <MenuTrigger>Open</MenuTrigger>
  <MenuPopup align="start" sideOffset={4}>
    <MenuItem>Profile</MenuItem>
    <MenuSeparator />
    <MenuGroup>
      <MenuGroupLabel>Playback</MenuGroupLabel>
      <MenuItem>Play</MenuItem>
      <MenuItem>Pause</MenuItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuCheckboxItem>Shuffle</MenuCheckboxItem>
    <MenuCheckboxItem>Repeat</MenuCheckboxItem>
    <MenuCheckboxItem variant="switch">Auto save</MenuCheckboxItem>
    <MenuSeparator />
    <MenuGroup>
      <MenuGroupLabel>Sort by</MenuGroupLabel>
      <MenuRadioGroup>
        <MenuRadioItem value="artist">Artist</MenuRadioItem>
        <MenuRadioItem value="album">Album</MenuRadioItem>
        <MenuRadioItem value="title">Title</MenuRadioItem>
      </MenuRadioGroup>
    </MenuGroup>
    <MenuSeparator />
    <MenuSub>
      <MenuSubTrigger>Add to playlist</MenuSubTrigger>
      <MenuSubPopup>
        <MenuItem>Jazz</MenuItem>
        <MenuItem>Rock</MenuItem>
      </MenuSubPopup>
    </MenuSub>
  </MenuPopup>
</Menu>
`

const docs = {
  api: menuParts.map((part) => menuApi[part]),
  description: {
    component:
      'COSS Menu, with workspace edits: the check of `MenuCheckboxItem` and `MenuRadioItem` sits on the right, `inset` aligns with the label after an icon, items are 44px tall with a coarse pointer, and `MenuShortcut` is `aria-hidden`, and the popup is at least 160px wide with 8px padding. A list of actions in a dropdown, enhanced with keyboard navigation. `UI/Menu/Behavior` shows each item kind and how it reacts, `UI/Menu/API Reference` has one page per part with its controls, and `UI/Menu/Usages` composes the parts into whole menus. Reference: [coss ui Menu](https://coss.com/ui/docs/components/menu).',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    align: 'start',
    modal: true,
    onOpenChange: fn(),
    side: 'bottom',
  },
  argTypes: {
    align: {
      control: 'inline-radio',
      description: 'Alignment relative to the trigger. Set on `MenuPopup`.',
      options: ['start', 'center', 'end'],
      table: { defaultValue: { summary: 'center' } },
    },
    modal: {
      control: 'boolean',
      description:
        'Locks page scroll and outside pointer interaction while open. Set on `Menu`.',
      table: { defaultValue: { summary: 'true' } },
    },
    onOpenChange: { control: false },
    side: {
      control: 'inline-radio',
      description:
        'Side of the trigger to position the popup. Set on `MenuPopup`.',
      options: ['top', 'bottom', 'left', 'right'],
      table: { defaultValue: { summary: 'bottom' } },
    },
  },
  parameters: { docs, layout: 'centered' },
  render: ({ align, modal, onOpenChange, side }) => (
    <Menu modal={modal} onOpenChange={onOpenChange}>
      <MenuTrigger render={<Button variant="outline" />}>Open menu</MenuTrigger>
      <MenuPopup align={align} side={side}>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuSeparator />
        <MenuItem variant="destructive">Log out</MenuItem>
      </MenuPopup>
    </Menu>
  ),
  title: 'UI/Menu',
} satisfies Meta<MenuStoryArgs>

export default meta

type Story = StoryObj<MenuStoryArgs>

export const Default: Story = {}

const anatomySlots = [
  'menu-label',
  'menu-item',
  'menu-item',
  'menu-link-item',
  'menu-separator',
  'menu-label',
  'menu-checkbox-item',
  'menu-checkbox-item',
  'menu-separator',
  'menu-label',
  'menu-radio-item',
  'menu-radio-item',
  'menu-separator',
  'menu-sub-trigger',
]

export const Anatomy: Story = {
  play: async () => {
    const [menu] = await screen.findAllByRole('menu')
    if (!menu) throw new Error('The menu did not open.')
    const slots = [
      ...menu.querySelectorAll(
        ':scope [data-slot^="menu-"]:not([data-slot="menu-group"]):not([data-slot="menu-radio-group"]):not([data-slot="menu-shortcut"])',
      ),
    ]
      .filter((node) => node.closest('[role="menu"]') === menu)
      .map((node) => node.getAttribute('data-slot'))
    await expect(slots).toEqual(anatomySlots)
    await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2))
  },
  render: () => (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="outline" />}>
        <Slot name="MenuTrigger" />
      </MenuTrigger>
      <MenuPopup className="w-72" side="inline-end">
        <MenuGroup>
          <MenuGroupLabel>
            <Slot name="MenuGroupLabel" />
          </MenuGroupLabel>
          <MenuItem>
            <IconSlot />
            <Slot name="MenuItem" />
            <MenuShortcut>
              <Slot name="MenuShortcut" />
            </MenuShortcut>
          </MenuItem>
          <MenuItem inset>
            <Slot name="MenuItem inset" />
          </MenuItem>
          <MenuLinkItem href="#anatomy">
            <IconSlot />
            <Slot name="MenuLinkItem" />
          </MenuLinkItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>
            <Slot name="MenuGroupLabel" />
          </MenuGroupLabel>
          <MenuCheckboxItem defaultChecked>
            <Slot name="MenuCheckboxItem" />
          </MenuCheckboxItem>
          <MenuCheckboxItem defaultChecked variant="switch">
            <Slot name="MenuCheckboxItem switch" />
          </MenuCheckboxItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>
            <Slot name="MenuGroupLabel" />
          </MenuGroupLabel>
          <MenuRadioGroup defaultValue="checked">
            <MenuRadioItem value="checked">
              <Slot name="MenuRadioItem" />
            </MenuRadioItem>
            <MenuRadioItem value="unchecked">
              <Slot name="MenuRadioItem" />
            </MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
        <MenuSeparator />
        <MenuSub defaultOpen>
          <MenuSubTrigger>
            <IconSlot />
            <Slot name="MenuSubTrigger" />
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>
              <Slot name="MenuItem" />
            </MenuItem>
          </MenuSubPopup>
        </MenuSub>
      </MenuPopup>
    </Menu>
  ),
}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Open menu',
    })
    await userEvent.click(trigger)
    const menu = await screen.findByRole('menu')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.anything(),
    )
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(3)

    await userEvent.keyboard('{ArrowDown}')
    const profile = within(menu).getByRole('menuitem', { name: 'Profile' })
    await expect(profile).toHaveFocus()
    await expect(getComputedStyle(profile).outlineStyle).toBe('solid')

    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Settings' }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(trigger).toHaveFocus()
  },
  tags: ['!dev', '!autodocs'],
}
