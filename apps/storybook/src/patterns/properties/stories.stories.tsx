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
  parameters: {
    controls: { exclude: ['defaultVisible', 'empty', 'readOnly', 'variant'] },
  },
  render: (args) => <ComposedProperties {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Stories',
} satisfies Meta<PropertiesControls>

export default meta

type Story = StoryObj<PropertiesControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const Empty: Story = {
  args: { empty: true },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const NoneVisible: Story = {
  args: { defaultVisible: [] },
  name: 'defaultVisible none',
}
