import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuItem,
  ContextMenuPopup,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@tc96/ui/context-menu'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'COSS ContextMenu, with the workspace edits of `UI/Menu`: the check of `ContextMenuCheckboxItem` and `ContextMenuRadioItem` sits on the right, `inset` aligns with the label after an icon, items are 44px tall with a coarse pointer, `ContextMenuShortcut` is `aria-hidden`, and the popup is at least 160px wide with 8px padding. Opens on a right-click or a long press on its trigger area. Reference: [coss ui Context Menu](https://coss.com/ui/docs/components/context-menu).',
      },
    },
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-72 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuPopup>
        <ContextMenuItem aria-keyshortcuts="Meta+E">
          Edit
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem defaultChecked>
          Show grid
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup defaultValue="comfortable">
          <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
          <ContextMenuRadioItem value="comfortable">
            Comfortable
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuPopup>
    </ContextMenu>
  ),
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

async function openContextMenu(canvasElement: HTMLElement) {
  await userEvent.pointer({
    keys: '[MouseRight]',
    target: within(canvasElement).getByText('Right-click here'),
  })
  return screen.findByRole('menu')
}

async function expectIndicatorAfterLabel(item: HTMLElement) {
  const label = item.querySelector<HTMLElement>(':scope > span:first-child')
  const indicator = item.querySelector<HTMLElement>(':scope > span:last-child')
  if (!label || !indicator || label === indicator)
    throw new Error('The item did not render its label and indicator.')
  await expect(indicator.getBoundingClientRect().left).toBeGreaterThanOrEqual(
    label.getBoundingClientRect().right,
  )
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const menu = await openContextMenu(canvasElement)
    await expect(menu.getBoundingClientRect().width).toBeGreaterThanOrEqual(160)

    const edit = within(menu).getByRole('menuitem', { name: 'Edit' })
    await expect(edit).toHaveAttribute('aria-keyshortcuts', 'Meta+E')

    await expectIndicatorAfterLabel(
      within(menu).getByRole('menuitemcheckbox', { name: 'Show grid' }),
    )
    await expectIndicatorAfterLabel(
      within(menu).getByRole('menuitemradio', { name: 'Comfortable' }),
    )

    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(edit).toHaveFocus())
    await expect(getComputedStyle(edit).outlineStyle).toBe('solid')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
