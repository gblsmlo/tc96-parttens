import type { Meta, StoryObj } from '@storybook/react-vite'
import { CrmCanvas } from './crm-canvas.tsx'
import {
  BareDeals,
  ContactNameOnlyCard,
  ContactWithoutActivityCard,
  SalesPipeline,
} from './crm-layouts.tsx'

const meta = {
  decorators: [CrmCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/CRM/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const PipelineWithPeriods: Story = {
  render: () => <SalesPipeline />,
}

export const DealsWithoutDetails: Story = {
  render: () => <BareDeals />,
}

export const ContactWithoutActivity: Story = {
  render: () => <ContactWithoutActivityCard />,
}

export const ContactNameOnly: Story = {
  render: () => <ContactNameOnlyCard />,
}
