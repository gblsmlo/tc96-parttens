import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Crm1Controls,
  crm1ControlArgs,
  crm1ControlArgTypes,
} from './crm-1-controls.ts'
import { ComposedCrm1 } from './crm-1-layouts.tsx'

const meta = {
  args: crm1ControlArgs,
  argTypes: crm1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCrm1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/CRM/Crm1/Playground',
} satisfies Meta<Crm1Controls>

export default meta

type Story = StoryObj<Crm1Controls>

export const Playground: Story = {}
