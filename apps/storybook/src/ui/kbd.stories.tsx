import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, KbdGroup } from '@tc96/ui/kbd'
import { expect, within } from 'storybook/test'

const meta = {
  title: 'UI/Kbd',
  component: Kbd,
  args: {
    children: '⌘',
  },
  parameters: {
    docs: {
      description: {
        component:
          'COSS Kbd, unmodified. Shows a key or a keyboard shortcut; `KbdGroup` sets the keys of a combination side by side. Its muted colors are meant for the page and popover surfaces. On a filled surface, such as a primary button, set the foreground pair of that surface. When a control already announces the shortcut, hide the hint with `aria-hidden` and put the shortcut in `aria-keyshortcuts`, as `RecordDialog` does.',
      },
    },
  },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const key = canvasElement.querySelector('kbd')
    await expect(key).toHaveTextContent('⌘')
    await expect(key).toHaveAttribute('data-slot', 'kbd')
  },
}

export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="kbd-group"]')
    if (!(group instanceof HTMLElement))
      throw new Error('The key group did not render.')
    const keys = within(group).getAllByText(/^(Ctrl|Shift|P)$/)
    await expect(keys.map((key) => key.textContent)).toEqual([
      'Ctrl',
      'Shift',
      'P',
    ])
  },
}

export const InText: Story = {
  render: () => (
    <p className="text-sm">
      Press{' '}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{' '}
      to search
    </p>
  ),
}
