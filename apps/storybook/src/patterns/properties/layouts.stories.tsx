import type { Meta, StoryObj } from '@storybook/react-vite'
import { propertiesControlArgs } from './properties-controls'
import { ComposedProperties, PlainPropertyColumn } from './properties-layouts'

const meta = {
  decorators: [
    (Story) => (
      <div className="min-h-96 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedProperties {...propertiesControlArgs} />,
}

export const PlainColumn: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'One row per property in a two-column grid, the name on the start and a `plain` value on the end, editable and read-only values aligned on the same x. For a side panel or a detail view, where each value needs its name in view.',
      },
    },
  },
  render: () => <PlainPropertyColumn />,
}
