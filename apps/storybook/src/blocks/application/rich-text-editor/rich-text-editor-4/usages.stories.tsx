import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RichTextEditor4Controls,
  richTextEditor4ControlArgs,
} from './rich-text-editor-4-controls.ts'
import {
  ComposedRichTextEditor4,
  TwoClients,
  withToasts,
} from './rich-text-editor-4-layouts.tsx'

const meta = {
  args: richTextEditor4ControlArgs,
  decorators: [withToasts],
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor4/Usages',
} satisfies Meta<RichTextEditor4Controls>

export default meta

type Story = StoryObj<typeof meta>

export const ReviewingTheSpecWithTheTeam: Story = {}

export const TwoPeopleOnTheSameDocument: Story = {
  render: () => <TwoClients />,
}
