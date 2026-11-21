import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd } from '@tc96/ui/kbd'
import { expect, within } from 'storybook/test'
import { kbdControlArgs } from './kbd-controls.ts'
import { ComposedKbd, SaveButton } from './kbd-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Kbd/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const KeyElement: Story = {
  render: () => <ComposedKbd {...kbdControlArgs} />,
  play: async ({ canvasElement }) => {
    const key = canvasElement.querySelector('kbd')
    await expect(key).toHaveTextContent('⌘')
    await expect(key).toHaveAttribute('data-slot', 'kbd')
  },
}

export const GroupInOrder: Story = {
  render: () => <ComposedKbd {...kbdControlArgs} keys="Ctrl Shift P" />,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="kbd-group"]')
    if (!(group instanceof HTMLElement))
      throw new Error('The key group did not render.')
    await expect(group.tagName).toBe('KBD')
    const keys = within(group).getAllByText(/^(Ctrl|Shift|P)$/)
    await expect(keys.map((key) => key.textContent)).toEqual([
      'Ctrl',
      'Shift',
      'P',
    ])
    for (const key of keys)
      await expect(key).toHaveAttribute('data-slot', 'kbd')
  },
}

export const FixedHeight: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>K</Kbd>
      <Kbd>Backspace</Kbd>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const single = canvas.getByText('K').getBoundingClientRect()
    const word = canvas.getByText('Backspace').getBoundingClientRect()
    await expect(single.height).toBe(20)
    await expect(single.width).toBe(20)
    await expect(word.height).toBe(20)
    await expect(word.width).toBeGreaterThan(20)
  },
}

export const IconSize: Story = {
  render: () => <ComposedKbd {...kbdControlArgs} icon keys="" />,
  play: async ({ canvasElement }) => {
    const icon = within(canvasElement).getByRole('img', { name: 'Enter' })
    const { height, width } = icon.getBoundingClientRect()
    await expect(width).toBe(12)
    await expect(height).toBe(12)
  },
}

export const HiddenFromControlName: Story = {
  render: () => <SaveButton />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Save' })
    await expect(button.querySelector('[data-slot="kbd"]')).toHaveTextContent(
      '⌘ ↵',
    )
  },
}
