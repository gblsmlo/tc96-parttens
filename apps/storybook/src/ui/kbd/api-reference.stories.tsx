import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, KbdGroup } from '@tc96/ui/kbd'

const meta = {
  component: KbdGroup,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Kbd/API Reference',
} satisfies Meta<typeof KbdGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <KbdGroup {...args}>
      <Kbd>children</Kbd>
      <Kbd>
        <svg aria-hidden="true" data-anatomy="icon" viewBox="0 0 12 12">
          <rect
            fill="none"
            height="11"
            rx="2"
            stroke="currentColor"
            strokeDasharray="2 2"
            width="11"
            x="0.5"
            y="0.5"
          />
        </svg>
      </Kbd>
    </KbdGroup>
  ),
}
