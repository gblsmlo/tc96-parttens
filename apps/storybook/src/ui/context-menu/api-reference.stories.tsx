import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuPopup,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubPopup,
  ContextMenuSubTrigger,
} from '@tc96/ui/context-menu'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'
import { OpenOnMountTrigger } from './context-menu-layouts.tsx'

const anatomySlots = [
  'context-menu-label',
  'context-menu-item',
  'context-menu-item',
  'context-menu-link-item',
  'context-menu-separator',
  'context-menu-label',
  'context-menu-checkbox-item',
  'context-menu-checkbox-item',
  'context-menu-separator',
  'context-menu-label',
  'context-menu-radio-item',
  'context-menu-radio-item',
  'context-menu-separator',
  'context-menu-sub-trigger',
]

const meta = {
  component: ContextMenu,
  parameters: {
    docs: { story: { iframeHeight: '600px', inline: false } },
    layout: 'padded',
  },
  render: (args) => (
    <ContextMenu {...args}>
      <OpenOnMountTrigger className="flex h-16 w-56 items-center justify-center rounded-lg border border-dashed">
        <Slot name="ContextMenuTrigger" />
      </OpenOnMountTrigger>
      <ContextMenuPopup align="start" className="w-72">
        <ContextMenuGroup>
          <ContextMenuGroupLabel>
            <Slot name="ContextMenuGroupLabel" />
          </ContextMenuGroupLabel>
          <ContextMenuItem>
            <IconSlot />
            <Slot name="ContextMenuItem" />
            <ContextMenuShortcut>
              <Slot name="ContextMenuShortcut" />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset>
            <Slot name="ContextMenuItem inset" />
          </ContextMenuItem>
          <ContextMenuLinkItem href="#anatomy">
            <IconSlot />
            <Slot name="ContextMenuLinkItem" />
          </ContextMenuLinkItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuGroupLabel>
            <Slot name="ContextMenuGroupLabel" />
          </ContextMenuGroupLabel>
          <ContextMenuCheckboxItem defaultChecked>
            <Slot name="ContextMenuCheckboxItem" />
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem defaultChecked variant="switch">
            <Slot name="ContextMenuCheckboxItem switch" />
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuGroupLabel>
            <Slot name="ContextMenuGroupLabel" />
          </ContextMenuGroupLabel>
          <ContextMenuRadioGroup defaultValue="checked">
            <ContextMenuRadioItem value="checked">
              <Slot name="ContextMenuRadioItem" />
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="unchecked">
              <Slot name="ContextMenuRadioItem" />
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuSub defaultOpen>
          <ContextMenuSubTrigger>
            <IconSlot />
            <Slot name="ContextMenuSubTrigger" />
          </ContextMenuSubTrigger>
          <ContextMenuSubPopup>
            <ContextMenuItem>
              <Slot name="ContextMenuItem" />
            </ContextMenuItem>
          </ContextMenuSubPopup>
        </ContextMenuSub>
      </ContextMenuPopup>
    </ContextMenu>
  ),
  tags: ['!autodocs', '!dev'],
  title: 'UI/ContextMenu/API Reference',
} satisfies Meta<typeof ContextMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}

export const AnatomySlots: Story = {
  play: async () => {
    const [menu] = await screen.findAllByRole('menu')
    if (!menu) throw new Error('The menu did not open.')
    const slots = [
      ...menu.querySelectorAll(
        ':scope [data-slot^="context-menu-"]:not([data-slot="context-menu-group"]):not([data-slot="context-menu-radio-group"]):not([data-slot="context-menu-shortcut"])',
      ),
    ]
      .filter((node) => node.closest('[role="menu"]') === menu)
      .map((node) => node.getAttribute('data-slot'))
    await expect(slots).toEqual(anatomySlots)
    await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2))
    await userEvent.keyboard('{Escape}')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
