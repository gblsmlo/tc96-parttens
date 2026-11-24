import type { Meta, StoryObj } from '@storybook/react-vite'
import { AssistantComposer, AssistantSuggestions } from '@tc96/ui/patterns'
import { assistantControlArgs } from './assistant-controls.ts'
import { AssistantCanvas, ComposerCanvas } from './assistant-frame.tsx'
import { ComposedAssistant } from './assistant-layouts.tsx'
import { suggestions } from './fixtures/assistant'

const meta = {
  decorators: [AssistantCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Assistant/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutHeaderActions: Story = {
  render: () => (
    <ComposedAssistant
      {...assistantControlArgs}
      end={false}
      expandToggle={false}
      history={false}
      newChat={false}
    />
  ),
}

export const WithoutBadge: Story = {
  render: () => <ComposedAssistant {...assistantControlArgs} badge={false} />,
}

export const WithoutSuggestions: Story = {
  render: () => (
    <ComposedAssistant {...assistantControlArgs} suggestions={false} />
  ),
}

export const WithoutAttach: Story = {
  render: () => <ComposedAssistant {...assistantControlArgs} attach={false} />,
}

export const StandaloneSuggestions: Story = {
  decorators: [ComposerCanvas],
  render: () => <AssistantSuggestions suggestions={suggestions} />,
}

export const StandaloneComposer: Story = {
  decorators: [ComposerCanvas],
  render: () => <AssistantComposer onAttach={() => {}} onSend={() => {}} />,
}
