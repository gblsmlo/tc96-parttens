import type { Meta, StoryObj } from '@storybook/react-vite'
import { lookupCreate1ControlArgs } from './lookup-create-1-controls.ts'
import { ComposedLookupCreate1 } from './lookup-create-1-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'Blocks/Records/LookupCreate1/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedLookupCreate1 {...lookupCreate1ControlArgs} />,
}
