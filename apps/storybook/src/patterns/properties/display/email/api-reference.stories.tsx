import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'

const ignore = () => undefined

const meta = {
  args: {
    onValueChange: ignore,
    value: ['ana.souza@example.com'],
  },
  component: EmailProperty,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Email/API Reference',
} satisfies Meta<typeof EmailProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByRole('group', { name: 'E-mails' })

    await expect(row).toHaveAttribute('data-slot', 'email-property')
    await expect(
      within(row).getByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeVisible()
  },
}

export const TriggerAnatomy: Story = {
  args: { display: 'trigger' },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'E-mails: ana.souza@example.com',
    })

    await expect(trigger).toHaveAttribute('data-slot', 'popover-trigger')
    await expect(
      trigger.querySelector('[data-slot="property-icon"]'),
    ).toBeInTheDocument()
  },
}
