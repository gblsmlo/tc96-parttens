import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FlowRunCard,
  type FlowStepGroup,
  FlowStepLibraryGroup,
} from '@tc96/ui/patterns'
import { failedRun } from './fixtures/runs'
import { workflowStepTypes } from './fixtures/workflow'
import { stepLibraryControlArgs } from './step-library-controls.ts'
import { EditorFrame, PartFrame } from './step-library-frame.tsx'
import { ComposedStepLibrary } from './step-library-layouts.tsx'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Step Library/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const messages: FlowStepGroup = {
  label: 'Mensagens',
  types: workflowStepTypes.filter((type) => type.group === 'Mensagens'),
}

export const WithoutRunCard: Story = {
  decorators: [EditorFrame],
  render: () => (
    <ComposedStepLibrary {...stepLibraryControlArgs} runCard={false} />
  ),
}

export const StandaloneGroup: Story = {
  decorators: [PartFrame],
  render: () => <FlowStepLibraryGroup group={messages} onAdd={() => {}} />,
}

export const StandaloneRunCard: Story = {
  decorators: [PartFrame],
  render: () => <FlowRunCard run={failedRun} />,
}
