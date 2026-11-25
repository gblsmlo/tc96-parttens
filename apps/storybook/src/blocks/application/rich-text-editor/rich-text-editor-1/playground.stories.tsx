import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RichTextEditor1Controls,
  richTextEditor1ControlArgs,
  richTextEditor1ControlArgTypes,
} from './rich-text-editor-1-controls.ts'
import { ComposedRichTextEditor1 } from './rich-text-editor-1-layouts.tsx'

const meta = {
  args: richTextEditor1ControlArgs,
  argTypes: richTextEditor1ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor1/Playground',
} satisfies Meta<RichTextEditor1Controls>

export default meta

type Story = StoryObj<RichTextEditor1Controls>

export const Playground: Story = {}
