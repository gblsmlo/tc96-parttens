import type { Meta, StoryObj } from '@storybook/react-vite'
import { crmControlArgs } from './crm-controls.ts'
import { ComposedCrm } from './crm-layouts.tsx'

const meta = {
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Widgets/CRM/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <ComposedCrm {...crmControlArgs} widget="pipeline" />
      <ComposedCrm {...crmControlArgs} widget="deals" />
      <ComposedCrm {...crmControlArgs} widget="activity-feed" />
      <ComposedCrm {...crmControlArgs} widget="contact" />
    </div>
  ),
}
