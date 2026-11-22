import type { Meta, StoryObj } from '@storybook/react-vite'
import { CrmCanvas } from './crm-canvas.tsx'
import {
  type CrmControls,
  crmControlArgs,
  crmControlArgTypes,
} from './crm-controls.ts'
import { ComposedCrm } from './crm-layouts.tsx'

const meta = {
  args: crmControlArgs,
  argTypes: crmControlArgTypes,
  decorators: [CrmCanvas],
  parameters: {
    controls: { exclude: ['empty', 'widget'] },
    layout: 'padded',
  },
  render: (args) => <ComposedCrm {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/CRM/Stories',
} satisfies Meta<CrmControls>

export default meta

type Story = StoryObj<CrmControls>

export const Default: Story = {}

export const Pipeline: Story = {
  args: { widget: 'pipeline' },
}

export const ActivityFeed: Story = {
  args: { widget: 'activity-feed' },
  name: 'Activity feed',
}

export const Contact: Story = {
  args: { widget: 'contact' },
}

export const Empty: Story = {
  args: { empty: true },
}
