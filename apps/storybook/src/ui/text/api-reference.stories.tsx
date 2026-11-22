import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/ui/text'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Text,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Text/API Reference',
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Text {...args}>
      <Slot name="children" />
    </Text>
  ),
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('[data-slot="text"]')
    if (!(text instanceof HTMLElement))
      throw new Error('The text did not render.')
    await expect(within(text).getByText('children')).toBeVisible()
  },
}
