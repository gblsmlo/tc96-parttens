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
import { expect, screen, waitFor } from 'storybook/test'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'

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

const meta = {
  component: Menu,
  parameters: {
    docs: { story: { iframeHeight: '560px', inline: false } },
    layout: 'padded',
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Menu/API Reference',
} satisfies Meta<typeof Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true, modal: false },
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
  render: (args) => (
    <Menu {...args}>
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
