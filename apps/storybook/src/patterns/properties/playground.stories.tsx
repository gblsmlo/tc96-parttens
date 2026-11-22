import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type PropertiesControls,
  propertiesControlArgs,
  propertiesControlArgTypes,
} from './properties-controls'
import { ComposedProperties } from './properties-layouts'

const meta = {
  args: propertiesControlArgs,
  argTypes: propertiesControlArgTypes,
  render: (args) => <ComposedProperties {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Playground',
} satisfies Meta<PropertiesControls>

export default meta

type Story = StoryObj<PropertiesControls>

export const Playground: Story = {}
