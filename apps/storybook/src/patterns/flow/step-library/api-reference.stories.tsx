import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowRunCard, FlowStepLibrary } from '@tc96/parttens'
import { EditorFrame } from './step-library-frame.tsx'

const noop = () => {}

const meta = {
  args: {
    children: (
      <FlowRunCard
        labels={{ title: 'FlowRunCard: labels.title' }}
        run={{ completed: 1, note: 'run.note', status: 'success', total: 2 }}
      />
    ),
    groups: [
      {
        label: 'FlowStepLibraryGroup: groups[0].label',
        types: [
          {
            description: 'type.description',
            group: 'first',
            id: 'action',
            kind: 'action',
            label: 'FlowStepLibraryItem: type.label',
          },
          {
            description: 'type.description',
            group: 'first',
            id: 'condition',
            kind: 'condition',
            label: 'FlowStepLibraryItem: type.label',
          },
        ],
      },
      {
        label: 'FlowStepLibraryGroup: groups[1].label',
        types: [
          {
            group: 'second',
            id: 'trigger',
            kind: 'trigger',
            label: 'FlowStepLibraryItem: type.label',
          },
        ],
      },
    ],
    labels: { hint: 'labels.hint', title: 'labels.title' },
    onAdd: noop,
  },
  component: FlowStepLibrary,
  decorators: [EditorFrame],
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Flow/Step Library/API Reference',
} satisfies Meta<typeof FlowStepLibrary>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
