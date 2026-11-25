import type { Meta, StoryObj } from '@storybook/react-vite'
import type {
  RichTextEditor5Decision,
  RichTextEditor5Planner,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-5'
import { useState } from 'react'
import {
  modelPlanner,
  rolloutAuthor,
  rolloutTime,
  rolloutValue,
} from '../fixtures/rich-text-editor-5.ts'
import { PlanPage } from './rich-text-editor-5-layouts.tsx'

const decisionText = (decision: RichTextEditor5Decision) =>
  'change' in decision
    ? `${decision.action === 'accept' ? 'Aceita' : 'Rejeitada'}: ${decision.change.after || decision.change.before}`
    : `${decision.action === 'accept-all' ? 'Aceitas' : 'Rejeitadas'} ${decision.changes.length} sugestões`

const RolloutRoom = ({
  planner,
}: Readonly<{ planner?: RichTextEditor5Planner }>) => {
  const [log, setLog] = useState<string[]>([])
  return (
    <div className="flex min-h-svh flex-col">
      <PlanPage
        author={rolloutAuthor}
        className="flex-1"
        defaultValue={rolloutValue()}
        formatTime={rolloutTime}
        onDecision={(decision) =>
          setLog((current) => [...current, decisionText(decision)])
        }
        stepDelay={0}
        {...(planner ? { planner } : {})}
      />
      <section
        aria-label="Registro de decisões"
        className="border-t bg-muted/40 p-4 text-sm"
      >
        <ul className="list-disc ps-5">
          {log.map((entry, index) => (
            <li key={`${index}-${entry}`}>{entry}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const meta = {
  component: RolloutRoom,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor5/Usages',
} satisfies Meta<typeof RolloutRoom>

export default meta

type Story = StoryObj<typeof meta>

export const PolishingARolloutPlanWithTheAssistant: Story = {}

export const TriagingOpenQuestionsBeforeTheKickoff: Story = {}

export const PluggingYourOwnModelIntoThePlanner: Story = {
  args: { planner: modelPlanner },
}
