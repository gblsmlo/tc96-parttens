import type { Meta, StoryObj } from '@storybook/react-vite'
import type {
  RichTextEditor3Decision,
  RichTextEditor3ExportFormat,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-3'
import { useState } from 'react'
import {
  contractValue,
  redlineAuthor,
  redlineAuthors,
  redlineTime,
} from '../fixtures/rich-text-editor-3.ts'
import { ContractPage } from './rich-text-editor-3-layouts.tsx'

const decisionText = (decision: RichTextEditor3Decision) =>
  'change' in decision
    ? `${decision.action === 'accept' ? 'Aceita' : 'Rejeitada'}: alteração de ${decision.change.author.name}`
    : `${decision.action === 'accept-all' ? 'Aceitas' : 'Rejeitadas'} ${decision.changes.length} ${decision.changes.length === 1 ? 'alteração' : 'alterações'}`

const formatNames: Record<RichTextEditor3ExportFormat, string> = {
  'final-text': 'texto final',
  'original-text': 'texto original',
  'redline-html': 'redline em HTML',
}

const ReviewRoom = () => {
  const [log, setLog] = useState<string[]>([])
  const [exported, setExported] = useState('')

  return (
    <div className="flex min-h-svh flex-col">
      <ContractPage
        author={redlineAuthor}
        authors={redlineAuthors}
        className="flex-1"
        defaultValue={contractValue()}
        formatTime={redlineTime}
        onDecision={(decision) =>
          setLog((current) => [...current, decisionText(decision)])
        }
        onExport={(format, content) =>
          setExported(`${formatNames[format]}: ${content}`)
        }
      />
      <section
        aria-label="Registro da revisão"
        className="border-t bg-muted/40 p-4 text-sm"
      >
        <ul className="list-disc ps-5">
          {log.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
        <output className="block break-all text-muted-foreground text-xs">
          {exported}
        </output>
      </section>
    </div>
  )
}

const meta = {
  component: ReviewRoom,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor3/Usages',
} satisfies Meta<typeof ReviewRoom>

export default meta

type Story = StoryObj<typeof meta>

export const ReviewingAnAgreementWithTheCounterparty: Story = {}

export const CopyingTheRedlineForTheCounterparty: Story = {}
