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
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedCollection {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Playground',
} satisfies Meta<CollectionControls>

export default meta

type Story = StoryObj<CollectionControls>

export const Playground: Story = {}
