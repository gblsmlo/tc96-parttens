import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsRow } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const slotIn = (root: Element, name: string) =>
  root.querySelector(`[data-slot="settings-row-${name}"]`)

const meta = {
  args: { title: 'Font size' },
  component: SettingsRow,
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/Settings/Composition/Row',
} satisfies Meta<typeof SettingsRow>

export default meta
type Story = StoryObj<typeof meta>

export const TitleDescriptionAndEndSlot: Story = {
  args: {
    description: "How people's names appear across the interface",
    endSlot: <button type="button">Full name</button>,
    title: 'Display names',
  },
  play: async ({ canvasElement }) => {
    await expect(slotIn(canvasElement, 'title')?.textContent).toBe(
      'Display names',
    )
    await expect(slotIn(canvasElement, 'description')?.textContent).toBe(
      "How people's names appear across the interface",
    )
    await expect(slotIn(canvasElement, 'end')?.textContent).toBe('Full name')
    await expect(slotIn(canvasElement, 'heading')?.nextElementSibling).toBe(
      slotIn(canvasElement, 'end'),
    )
  },
}

export const StartSlotOnlyWhenPassed: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div data-testid="without-start">
        <SettingsRow {...args} />
      </div>
      <div data-testid="with-start">
        <SettingsRow {...args} startSlot={<svg aria-hidden="true" />} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const without = canvas.getByTestId('without-start')
    const withStart = canvas.getByTestId('with-start')

    await expect(slotIn(without, 'start')).toBeNull()
    await expect(
      slotIn(withStart, 'start')?.querySelector('svg'),
    ).not.toBeNull()
    await expect(slotIn(withStart, 'start')?.nextElementSibling).toBe(
      slotIn(withStart, 'heading'),
    )
  },
}

export const TitleOnly: Story = {
  args: { title: 'Email' },
  play: async ({ canvasElement }) => {
    await expect(slotIn(canvasElement, 'description')).toBeNull()
    await expect(slotIn(canvasElement, 'end')).toBeNull()
    await expect(slotIn(canvasElement, 'heading')?.children).toHaveLength(1)
  },
}
