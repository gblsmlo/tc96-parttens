import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionControls,
  collectionControlArgs,
  collectionControlArgTypes,
} from './collection-controls'
import { ComposedCollection } from './collection-layouts'

const meta = {
  args: collectionControlArgs,
  argTypes: collectionControlArgTypes,
  parameters: {
    controls: { exclude: ['empty', 'loading'] },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedCollection {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Variants',
} satisfies Meta<CollectionControls>

export default meta

type Story = StoryObj<CollectionControls>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { empty: true },
}
