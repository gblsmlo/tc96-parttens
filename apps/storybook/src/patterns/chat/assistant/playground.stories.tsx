import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type AssistantControls,
  assistantControlArgs,
  assistantControlArgTypes,
} from './assistant-controls.ts'
import { AssistantCanvas } from './assistant-frame.tsx'
import { ComposedAssistant } from './assistant-layouts.tsx'

const meta = {
  args: assistantControlArgs,
  argTypes: assistantControlArgTypes,
  decorators: [AssistantCanvas],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedAssistant {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Assistant/Playground',
} satisfies Meta<AssistantControls>

export default meta

type Story = StoryObj<AssistantControls>

export const Playground: Story = {}
