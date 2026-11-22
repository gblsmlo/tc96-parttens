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
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCrm {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/CRM/Playground',
} satisfies Meta<CrmControls>

export default meta

type Story = StoryObj<CrmControls>

export const Playground: Story = {}
