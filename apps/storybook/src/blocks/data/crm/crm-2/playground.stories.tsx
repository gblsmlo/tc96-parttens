import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Crm2Controls,
  crm2ControlArgs,
  crm2ControlArgTypes,
} from './crm-2-controls.ts'
import { ComposedCrm2 } from './crm-2-layouts.tsx'

const meta = {
  args: crm2ControlArgs,
  argTypes: crm2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCrm2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/CRM/Crm2/Playground',
} satisfies Meta<Crm2Controls>

export default meta

type Story = StoryObj<Crm2Controls>

export const Playground: Story = {}
