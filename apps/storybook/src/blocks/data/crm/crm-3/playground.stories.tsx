import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Crm3Controls,
  crm3ControlArgs,
  crm3ControlArgTypes,
} from './crm-3-controls.ts'
import { ComposedCrm3 } from './crm-3-layouts.tsx'

const meta = {
  args: crm3ControlArgs,
  argTypes: crm3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCrm3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/CRM/Crm3/Playground',
} satisfies Meta<Crm3Controls>

export default meta

type Story = StoryObj<Crm3Controls>

export const Playground: Story = {}
