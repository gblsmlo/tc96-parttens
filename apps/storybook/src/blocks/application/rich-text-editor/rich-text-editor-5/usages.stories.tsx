import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RichTextEditor5,
  type RichTextEditor5Decision,
  type RichTextEditor5Planner,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-5'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import {
  modelPlanner,
  rolloutAuthor,
  rolloutDocumentName,
  rolloutTime,
  rolloutValue,
} from '../fixtures/rich-text-editor-5.ts'
import {
  dockOf,
  editorOf,
  reviewItems,
  runTask,
  waitForFinished,
} from './rich-text-editor-5-layouts.tsx'

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
      <RichTextEditor5
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

export const PolishingARolloutPlanWithTheAssistant: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    await waitForFinished(canvasElement)
    await runTask(canvasElement, 'Enxugar o texto')
    await waitForFinished(canvasElement)
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(7))
    await userEvent.click(
      dockOf(canvasElement).getByRole('button', {
        name: /Rejeitar sugestão de Assistente: para migrar/,
      }),
    )
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(6))
    await userEvent.click(
      dockOf(canvasElement).getByRole('button', { name: 'Aceitar tudo' }),
    )
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(0))
    const editor = editorOf(canvasElement)
    await expect(editor).toHaveTextContent('recebimento dos artigos')
    await expect(editor).toHaveTextContent('porque o suporte')
    await expect(editor).toHaveTextContent('no sentido de realizar a migração')
    await expect(
      within(canvasElement).getByRole('region', {
        name: 'Registro de decisões',
      }),
    ).toHaveTextContent('Aceitas 6 sugestões')
  },
}

export const TriagingOpenQuestionsBeforeTheKickoff: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Listar perguntas em aberto')
    await waitForFinished(canvasElement)
    const dock = dockOf(canvasElement)
    await userEvent.click(
      await dock.findByRole('button', {
        name: 'Ir para o trecho: A data do piloto ainda é TBD.',
      }),
    )
    await waitFor(() =>
      expect(canvasElement.ownerDocument.getSelection()?.toString()).toBe(
        'A data do piloto ainda é TBD.',
      ),
    )
    await runTask(canvasElement, 'Listar responsáveis')
    await waitForFinished(canvasElement)
    await expect(
      await dock.findByText(
        'Rafael: Rafael valida os fluxos de busca com o suporte.',
      ),
    ).toBeVisible()
    await expect(
      within(canvasElement).getByRole('textbox', { name: rolloutDocumentName }),
    ).toHaveTextContent('A data do piloto ainda é TBD.')
  },
}

export const PluggingYourOwnModelIntoThePlanner: Story = {
  args: { planner: modelPlanner },
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Escrever resumo')
    await waitForFinished(canvasElement)
    await expect(
      within(canvasElement).getByText('Modelo externo: summary'),
    ).toBeVisible()
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await expect(
      reviewItems(canvasElement)[0]?.querySelector('ins'),
    ).toHaveTextContent('Cronograma em três ondas')
  },
}
