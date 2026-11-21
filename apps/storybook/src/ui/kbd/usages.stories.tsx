import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, KbdGroup } from '@tc96/ui/kbd'
import { expect, within } from 'storybook/test'
import { SaveButton } from './kbd-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Kbd/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const shortcuts = [
  { action: 'Open the command menu', keys: ['⌘', 'K'] },
  { action: 'Save the record', keys: ['⌘', 'S'] },
  { action: 'Fit the canvas to the screen', keys: ['Shift', '1'] },
  { action: 'Delete the selection', keys: ['Backspace'] },
] as const

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
  play: async ({ canvasElement }) => {
    const sentence = canvasElement.querySelector('p')
    await expect(sentence).toHaveTextContent('Press ⌘K to search')
  },
}

export const ShortcutList: Story = {
  render: () => (
    <ul className="flex w-80 flex-col gap-2 text-sm">
      {shortcuts.map(({ action, keys }) => (
        <li className="flex items-center justify-between gap-4" key={action}>
          {action}
          <KbdGroup>
            {keys.map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </KbdGroup>
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const rows = within(canvasElement).getAllByRole('listitem')
    await expect(rows).toHaveLength(shortcuts.length)
    await expect(
      within(rows[0] as HTMLElement).getByText('K', { selector: 'kbd' }),
    ).toBeVisible()
  },
}

export const SubmitHint: Story = {
  render: () => <SaveButton />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Save' }),
    ).toBeVisible()
  },
}
