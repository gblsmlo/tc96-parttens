import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type AiChat1Controls,
  aiChat1ControlArgs,
  aiChat1ControlArgTypes,
} from './ai-chat-1-controls.ts'
import { ComposedAiChat1 } from './ai-chat-1-layouts.tsx'

const meta = {
  args: aiChat1ControlArgs,
  argTypes: aiChat1ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedAiChat1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/AI Chat/AiChat1/Playground',
} satisfies Meta<AiChat1Controls>

export default meta

type Story = StoryObj<AiChat1Controls>

export const Playground: Story = {}
