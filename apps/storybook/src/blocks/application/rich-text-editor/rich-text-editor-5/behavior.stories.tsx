import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  rolloutAuthor,
  rolloutOwnerCount,
  rolloutQuestionCount,
  rolloutRewriteCount,
  rolloutTbdCount,
  rolloutTime,
  rolloutTypoCount,
  rolloutValue,
} from '../fixtures/rich-text-editor-5.ts'
import {
  type RichTextEditor5Controls,
  richTextEditor5ControlArgs,
} from './rich-text-editor-5-controls.ts'
import {
  ComposedRichTextEditor5,
  dockOf,
  editorOf,
  openTaskMenu,
  PlanPage,
  requestOf,
  reviewItems,
  richTextEditor5Handlers,
  runTask,
  selectRolloutText,
  statusOf,
  topBlocks,
  waitForFinished,
} from './rich-text-editor-5-layouts.tsx'

const meta = {
  args: richTextEditor5ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(richTextEditor5Handlers))
      handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor5/Behavior',
} satisfies Meta<RichTextEditor5Controls>

export default meta

type Story = StoryObj<typeof meta>

const bubbleOf = (canvasElement: HTMLElement) =>
  within(canvasElement).findByRole('group', {
    name: 'Ações para o trecho selecionado',
  })

export const SpellingWritesSuggestionsFromTheAssistant: Story = {
  play: async ({ canvasElement }) => {
    const before = editorOf(canvasElement).textContent
    await runTask(canvasElement, 'Corrigir ortografia')
    await waitForFinished(canvasElement)
    const editor = editorOf(canvasElement)
    await waitFor(() =>
      expect(reviewItems(canvasElement)).toHaveLength(rolloutTypoCount),
    )
    await expect(
      editor.querySelector('ins[data-suggestion-type="insert"]'),
    ).toHaveTextContent(
      /^(implantação|prioridade|recebimento|responsável|validação)$/,
    )
    await expect(
      editor.querySelector('del[data-suggestion-type="remove"]'),
    ).toHaveTextContent(
      /^(implantaçao|priorirdade|recebimeto|responsavel|validaçao)$/,
    )
    await expect(editor.textContent).not.toBe(before)
    const first = reviewItems(canvasElement)[0] as HTMLElement
    await expect(first).toHaveAttribute('data-kind', 'replace')
    await expect(within(first).getByText('Assistente')).toBeVisible()
    await expect(statusOf(canvasElement)).toHaveTextContent(
      'Pronto: 5 sugestões escritas no texto.',
    )
  },
}

export const TheAssistantIsADistinctAuthor: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    await waitForFinished(canvasElement)
    await waitFor(() =>
      expect(richTextEditor5Handlers.onChange).toHaveBeenCalled(),
    )
    const last = JSON.stringify(
      richTextEditor5Handlers.onChange.mock.calls.at(-1)?.[0],
    )
    await expect(last).toContain('"userId":"assistente"')
    await expect(last).not.toContain('"userId":"ana"')
    for (const item of reviewItems(canvasElement))
      await expect(within(item).queryByText('Ana Souza')).toBeNull()
  },
}

export const YourOwnTypingStaysADirectEdit: Story = {
  play: async ({ canvasElement }) => {
    const editor = editorOf(canvasElement)
    await selectRolloutText(editor, 'Cronograma')
    await userEvent.keyboard('{ArrowRight} geral')
    await waitFor(() => expect(editor).toHaveTextContent('Cronograma geral'))
    await expect(reviewItems(canvasElement)).toHaveLength(0)
    await expect(editor.querySelector('[data-suggestion-type]')).toBeNull()
  },
}

export const TightenRewritesTwoPhrases: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Enxugar o texto')
    await waitForFinished(canvasElement)
    await waitFor(() =>
      expect(reviewItems(canvasElement)).toHaveLength(rolloutRewriteCount),
    )
    const [first, second] = reviewItems(canvasElement) as [
      HTMLElement,
      HTMLElement,
    ]
    await expect(first.querySelector('del')).toHaveTextContent(
      'em virtude do fato de que',
    )
    await expect(first.querySelector('ins')).toHaveTextContent('porque')
    await expect(second.querySelector('ins')).toHaveTextContent('para migrar')
  },
}

export const SummaryAddsAParagraphAfterTheTitle: Story = {
  play: async ({ canvasElement }) => {
    const before = topBlocks(canvasElement).length
    await runTask(canvasElement, 'Escrever resumo')
    await waitForFinished(canvasElement)
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await expect(topBlocks(canvasElement)).toHaveLength(before + 1)
    await expect(topBlocks(canvasElement)[1]).toHaveTextContent(
      'Resumo: a nova central de ajuda entra no ar em três ondas',
    )
    await expect(reviewItems(canvasElement)[0]).toHaveAttribute(
      'data-kind',
      'insert',
    )
  },
}

export const ChecklistAddsFourTasksAndRejectingRemovesThem: Story = {
  play: async ({ canvasElement }) => {
    const before = topBlocks(canvasElement).length
    await runTask(canvasElement, 'Adicionar checklist')
    await waitForFinished(canvasElement)
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(4))
    await expect(topBlocks(canvasElement)).toHaveLength(before + 4)
    const blocks = topBlocks(canvasElement)
    await expect(blocks.at(-4)).toHaveTextContent(
      'Migrar os artigos da central antiga',
    )
    await expect(blocks.at(-1)).toHaveTextContent(
      'Comunicar o piloto aos clientes',
    )
    await userEvent.click(
      dockOf(canvasElement).getByRole('button', { name: 'Rejeitar tudo' }),
    )
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(0))
    await expect(topBlocks(canvasElement)).toHaveLength(before)
    await expect(editorOf(canvasElement)).not.toHaveTextContent(
      'Migrar os artigos da central antiga',
    )
  },
}

export const QuestionsAreFindingsThatEditNothing: Story = {
  play: async ({ canvasElement }) => {
    const before = editorOf(canvasElement).textContent
    await runTask(canvasElement, 'Listar perguntas em aberto')
    await waitForFinished(canvasElement)
    const dock = dockOf(canvasElement)
    const list = await dock.findByRole('list', { name: 'Achados' })
    const found = Array.from(
      list.querySelectorAll<HTMLElement>('[data-slot="assistant-finding"]'),
    )
    await expect(found).toHaveLength(rolloutQuestionCount + rolloutTbdCount)
    await expect(found.map((item) => item.getAttribute('data-kind'))).toEqual([
      'tbd',
      'question',
      'question',
    ])
    await expect(found[1]).toHaveTextContent(
      'Quem aprova o texto final dos artigos jurídicos?',
    )
    await expect(reviewItems(canvasElement)).toHaveLength(0)
    await expect(editorOf(canvasElement).textContent).toBe(before)
    await expect(
      editorOf(canvasElement).querySelector('[data-suggestion-type]'),
    ).toBeNull()
    await expect(statusOf(canvasElement)).toHaveTextContent(
      'Pronto: 3 achados, nenhuma alteração no texto.',
    )
  },
}

export const FindingsJumpToTheirText: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Listar perguntas em aberto')
    await waitForFinished(canvasElement)
    const dock = dockOf(canvasElement)
    await userEvent.click(
      await dock.findByRole('button', {
        name: 'Ir para o trecho: O piloto inclui clientes do plano gratuito?',
      }),
    )
    await waitFor(() =>
      expect(canvasElement.ownerDocument.getSelection()?.toString()).toBe(
        'O piloto inclui clientes do plano gratuito?',
      ),
    )
    const item = canvasElement.querySelector(
      '[data-slot="assistant-finding"][data-finding-id="question-3"]',
    )
    await expect(item).toHaveClass('ring-1')
    await expect(reviewItems(canvasElement)).toHaveLength(0)
  },
}

export const OwnersAreFindingsNamingTeammates: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Listar responsáveis')
    await waitForFinished(canvasElement)
    const list = await dockOf(canvasElement).findByRole('list', {
      name: 'Achados',
    })
    const found = Array.from(
      list.querySelectorAll<HTMLElement>('[data-slot="assistant-finding"]'),
    )
    await expect(found).toHaveLength(rolloutOwnerCount)
    await expect(found.map((item) => item.getAttribute('data-kind'))).toEqual([
      'owner',
      'owner',
      'owner',
    ])
    await expect(found[0]).toHaveTextContent(
      'Marina: Marina fica com a migração',
    )
    await expect(found[2]).toHaveTextContent('Camila')
    await expect(reviewItems(canvasElement)).toHaveLength(0)
  },
}

export const StepTraceShowsTheStepsAsTheyHappen: Story = {
  args: { stepDelay: 350 },
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    const dock = dockOf(canvasElement)
    const trace = await dock.findByRole('list', { name: 'Etapas da tarefa' })
    const states = () =>
      Array.from(
        trace.querySelectorAll<HTMLElement>('[data-slot="step-trace-item"]'),
      ).map((item) => item.getAttribute('data-state'))
    await waitFor(() => expect(states()).toContain('active'))
    await expect(trace.firstElementChild).toHaveTextContent(
      'Entendendo o pedido: corrigir a ortografia',
    )
    await waitFor(() => expect(states().length).toBeGreaterThan(1))
    await expect(states()[0]).toBe('done')
    await waitForFinished(canvasElement)
    await expect(states()).toEqual(['done', 'done', 'done', 'done'])
    await expect(trace).toHaveTextContent('Escrevendo 5 sugestões no texto')
    await expect(
      Array.from(trace.querySelectorAll('[data-kind]')).map((item) =>
        item.getAttribute('data-kind'),
      ),
    ).toEqual(['planning', 'reading', 'reviewing', 'editing'])
  },
}

export const ALabelledCaretFollowsTheAssistantWhileItWrites: Story = {
  args: { stepDelay: 350 },
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    const caret = await waitFor(
      () => {
        const element = canvasElement.querySelector<HTMLElement>(
          '[data-slot="assistant-caret"]',
        )
        if (!element) throw new Error('no caret yet')
        return element
      },
      { timeout: 4000 },
    )
    await expect(caret).toHaveTextContent('Assistente')
    await waitForFinished(canvasElement)
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="assistant-caret"]'),
      ).toBeNull(),
    )
  },
}

export const StopKeepsTheEditsWrittenSoFar: Story = {
  args: { stepDelay: 350 },
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    const dock = dockOf(canvasElement)
    await waitFor(
      () => expect(reviewItems(canvasElement).length).toBeGreaterThanOrEqual(1),
      { timeout: 6000 },
    )
    await userEvent.click(await dock.findByRole('button', { name: 'Parar' }))
    await waitFor(() =>
      expect(statusOf(canvasElement)).toHaveTextContent(/^Interrompido/),
    )
    const kept = reviewItems(canvasElement).length
    await expect(kept).toBeLessThan(rolloutTypoCount)
    await expect(dock.queryByRole('button', { name: 'Parar' })).toBeNull()
    await new Promise((resolve) => setTimeout(resolve, 800))
    await expect(reviewItems(canvasElement)).toHaveLength(kept)
    await expect(statusOf(canvasElement)).toHaveTextContent(
      `Interrompido: ${kept} ${kept === 1 ? 'sugestão mantida' : 'sugestões mantidas'} no texto.`,
    )
  },
}

export const TasksAreDisabledWhileARunIsActive: Story = {
  args: { stepDelay: 350 },
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    const dock = dockOf(canvasElement)
    await expect(
      dock.getByRole('button', { name: 'Enviar pedido' }),
    ).toBeDisabled()
    const menu = await openTaskMenu(canvasElement)
    await expect(
      menu.getByRole('option', { name: 'Enxugar o texto' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Escape}')
    await userEvent.click(await dock.findByRole('button', { name: 'Parar' }))
    await waitFor(() =>
      expect(dock.queryByRole('button', { name: 'Parar' })).toBeNull(),
    )
    const reopened = await openTaskMenu(canvasElement)
    await expect(
      reopened.getByRole('option', { name: 'Enxugar o texto' }),
    ).not.toHaveAttribute('aria-disabled')
  },
}

export const AcceptingAndRejectingDecideEachEdit: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Enxugar o texto')
    await waitForFinished(canvasElement)
    const dock = dockOf(canvasElement)
    const editor = editorOf(canvasElement)
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(2))
    await userEvent.click(
      dock.getByRole('button', {
        name: /Aceitar sugestão de Assistente: porque/,
      }),
    )
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await expect(editor).toHaveTextContent('porque o suporte')
    await expect(editor).not.toHaveTextContent('em virtude do fato de que')
    await expect(richTextEditor5Handlers.onDecision).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'accept',
        change: expect.objectContaining({ after: 'porque', kind: 'replace' }),
      }),
    )
    await userEvent.click(
      dock.getByRole('button', {
        name: /Rejeitar sugestão de Assistente: para migrar/,
      }),
    )
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(0))
    await expect(editor).toHaveTextContent('no sentido de realizar a migração')
    await expect(editor).not.toHaveTextContent('para migrar')
    await expect(richTextEditor5Handlers.onDecision).toHaveBeenLastCalledWith(
      expect.objectContaining({ action: 'reject' }),
    )
  },
}

export const AcceptAllAppliesEveryEdit: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    await waitForFinished(canvasElement)
    await waitFor(() =>
      expect(reviewItems(canvasElement)).toHaveLength(rolloutTypoCount),
    )
    await userEvent.click(
      dockOf(canvasElement).getByRole('button', { name: 'Aceitar tudo' }),
    )
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(0))
    const editor = editorOf(canvasElement)
    await expect(editor).toHaveTextContent('recebimento dos artigos')
    await expect(editor).toHaveTextContent(
      'priorirdade'.replace('rirdade', 'ridade'),
    )
    await expect(editor).not.toHaveTextContent('recebimeto')
    await expect(richTextEditor5Handlers.onDecision).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'accept-all' }),
    )
  },
}

export const RejectAllRestoresTheOriginalText: Story = {
  play: async ({ canvasElement }) => {
    const before = editorOf(canvasElement).textContent
    await runTask(canvasElement, 'Corrigir ortografia')
    await waitForFinished(canvasElement)
    await waitFor(() =>
      expect(reviewItems(canvasElement)).toHaveLength(rolloutTypoCount),
    )
    await userEvent.click(
      dockOf(canvasElement).getByRole('button', { name: 'Rejeitar tudo' }),
    )
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(0))
    await expect(editorOf(canvasElement).textContent).toBe(before)
    await expect(richTextEditor5Handlers.onDecision).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'reject-all' }),
    )
  },
}

export const ReviewStepsThroughEachEdit: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    await waitForFinished(canvasElement)
    const dock = dockOf(canvasElement)
    await waitFor(() =>
      expect(reviewItems(canvasElement)).toHaveLength(rolloutTypoCount),
    )
    const active = () =>
      reviewItems(canvasElement).findIndex(
        (item) => item.getAttribute('data-active') === 'true',
      )
    await userEvent.click(
      dock.getByRole('button', { name: 'Próxima sugestão' }),
    )
    await waitFor(() => expect(active()).toBe(0))
    await expect(
      editorOf(canvasElement).querySelector('[data-active="true"]'),
    ).not.toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="assistant-review-position"]'),
    ).toHaveTextContent('1 de 5')
    await userEvent.click(
      dock.getByRole('button', { name: 'Próxima sugestão' }),
    )
    await waitFor(() => expect(active()).toBe(1))
    await userEvent.click(
      dock.getByRole('button', { name: 'Sugestão anterior' }),
    )
    await waitFor(() => expect(active()).toBe(0))
    await userEvent.click(
      dock.getByRole('button', { name: 'Sugestão anterior' }),
    )
    await waitFor(() => expect(active()).toBe(rolloutTypoCount - 1))
  },
}

export const UndoRevertsTheLastDecisionInOneStep: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    await waitForFinished(canvasElement)
    const dock = dockOf(canvasElement)
    await waitFor(() =>
      expect(reviewItems(canvasElement)).toHaveLength(rolloutTypoCount),
    )
    const undo = dock.getByRole('button', { name: 'Desfazer última decisão' })
    await expect(undo).toBeDisabled()
    await userEvent.click(dock.getByRole('button', { name: 'Aceitar tudo' }))
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(0))
    await expect(undo).toBeEnabled()
    await userEvent.click(undo)
    await waitFor(() =>
      expect(reviewItems(canvasElement)).toHaveLength(rolloutTypoCount),
    )
    await expect(undo).toBeDisabled()
    await expect(
      editorOf(canvasElement).querySelectorAll('[data-suggestion-type]').length,
    ).toBeGreaterThanOrEqual(rolloutTypoCount * 2)
  },
}

export const UndoRevertsASingleRejectedBlock: Story = {
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Escrever resumo')
    await waitForFinished(canvasElement)
    const dock = dockOf(canvasElement)
    const before = topBlocks(canvasElement).length
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await userEvent.click(
      dock.getByRole('button', { name: /^Rejeitar sugestão de Assistente/ }),
    )
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(0))
    await expect(topBlocks(canvasElement)).toHaveLength(before - 1)
    await userEvent.click(
      dock.getByRole('button', { name: 'Desfazer última decisão' }),
    )
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await expect(topBlocks(canvasElement)).toHaveLength(before)
  },
}

export const KeywordsPickTheMatchingTask: Story = {
  play: async ({ canvasElement }) => {
    const dock = dockOf(canvasElement)
    await userEvent.type(
      requestOf(canvasElement),
      'por favor, faça um resumo{enter}',
    )
    await waitForFinished(canvasElement)
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await expect(statusOf(canvasElement)).toHaveTextContent(
      'Pronto: 1 sugestão escrita no texto.',
    )
    await expect(topBlocks(canvasElement)[1]).toHaveTextContent('Resumo:')
    await userEvent.type(
      requestOf(canvasElement),
      'quais são as dúvidas em aberto?{enter}',
    )
    await waitForFinished(canvasElement)
    await expect(
      await dock.findByRole('list', { name: 'Achados' }),
    ).toBeVisible()
  },
}

export const EveryTaskHasKeywords: Story = {
  play: async ({ canvasElement }) => {
    const cases: [string, RegExp][] = [
      ['corrigir os erros do texto', /sugestões escritas/],
      ['enxugue o texto, deixe mais conciso', /sugestões escritas/],
      ['monte um checklist', /sugestões escritas/],
      ['quem é o responsável por cada tarefa', /3 achados/],
    ]
    for (const [text, status] of cases) {
      await userEvent.type(requestOf(canvasElement), `${text}{enter}`)
      await waitFor(
        () => expect(statusOf(canvasElement)).toHaveTextContent(status),
        { timeout: 8000 },
      )
    }
  },
}

export const AnUnmatchedRequestGetsThreeSuggestedTasks: Story = {
  play: async ({ canvasElement }) => {
    const dock = dockOf(canvasElement)
    await userEvent.type(requestOf(canvasElement), 'faça um café{enter}')
    const group = await dock.findByRole('group', {
      name: 'Não entendi “faça um café”. Experimente uma destas tarefas:',
    })
    const buttons = within(group).getAllByRole('button')
    await expect(buttons.map((button) => button.textContent)).toEqual([
      'Corrigir ortografia',
      'Enxugar o texto',
      'Escrever resumo',
    ])
    await expect(reviewItems(canvasElement)).toHaveLength(0)
    await expect(
      canvasElement.querySelector('[data-slot="assistant-status"]'),
    ).toBeNull()
    await userEvent.click(
      within(group).getByRole('button', { name: 'Enxugar o texto' }),
    )
    await waitForFinished(canvasElement)
    await waitFor(() =>
      expect(reviewItems(canvasElement)).toHaveLength(rolloutRewriteCount),
    )
    await expect(
      canvasElement.querySelectorAll('[data-slot="assistant-turn"]'),
    ).toHaveLength(2)
  },
}

export const SelectingTextShowsABubbleAboveIt: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('group', {
        name: 'Ações para o trecho selecionado',
      }),
    ).toBeNull()
    await selectRolloutText(
      editorOf(canvasElement),
      'A segunda onda existe no sentido de realizar a migração',
    )
    const bubble = await bubbleOf(canvasElement)
    await expect(bubble).toBeVisible()
    const names = within(bubble)
      .getAllByRole('button')
      .map((button) => button.textContent)
    await expect(names).toEqual([
      'Resumir',
      'Corrigir ortografia',
      'Pedir ao assistente',
    ])
    const selected = canvasElement.ownerDocument
      .getSelection()
      ?.getRangeAt(0)
      .getBoundingClientRect()
    await expect(bubble.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      (selected?.top ?? 0) + 1,
    )
  },
}

export const BubbleSummarizesOnlyTheSelectedPassage: Story = {
  play: async ({ canvasElement }) => {
    const before = topBlocks(canvasElement).length
    await selectRolloutText(
      editorOf(canvasElement),
      'A segunda onda existe no sentido de realizar a migração dos artigos mais acessados',
    )
    const bubble = await bubbleOf(canvasElement)
    await userEvent.click(
      within(bubble).getByRole('button', { name: 'Resumir' }),
    )
    await waitForFinished(canvasElement)
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await expect(topBlocks(canvasElement)).toHaveLength(before)
    const inserted = editorOf(canvasElement).querySelector(
      'ins[data-suggestion-type="insert"]',
    )
    await expect(inserted).toHaveTextContent(
      'Resumindo: A segunda onda existe no sentido de realizar a migração',
    )
    await expect(inserted?.closest('p')).toHaveTextContent(
      'com priorirdade para os de cobrança',
    )
    await expect(
      within(canvasElement).queryByRole('group', {
        name: 'Ações para o trecho selecionado',
      }),
    ).toBeNull()
  },
}

export const BubbleFixesSpellingOnlyInsideThePassage: Story = {
  play: async ({ canvasElement }) => {
    await selectRolloutText(
      editorOf(canvasElement),
      'com priorirdade para os de cobrança',
    )
    const bubble = await bubbleOf(canvasElement)
    await userEvent.click(
      within(bubble).getByRole('button', { name: 'Corrigir ortografia' }),
    )
    await waitForFinished(canvasElement)
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    const editor = editorOf(canvasElement)
    await expect(editor.querySelector('ins')).toHaveTextContent('prioridade')
    await expect(editor).toHaveTextContent('recebimeto')
    await expect(editor).toHaveTextContent('implantaçao')
  },
}

export const BubbleHandsThePassageToTheDock: Story = {
  play: async ({ canvasElement }) => {
    const dock = dockOf(canvasElement)
    await selectRolloutText(
      editorOf(canvasElement),
      'no sentido de realizar a migração dos artigos',
    )
    const bubble = await bubbleOf(canvasElement)
    await userEvent.click(
      within(bubble).getByRole('button', { name: 'Pedir ao assistente' }),
    )
    const chip = await waitFor(() => {
      const element = canvasElement.querySelector<HTMLElement>(
        '[data-slot="assistant-passage"]',
      )
      if (!element) throw new Error('no passage')
      return element
    })
    await expect(chip).toHaveTextContent(
      'Trecho: no sentido de realizar a migração dos artigos',
    )
    await waitFor(() => expect(requestOf(canvasElement)).toHaveFocus())
    await expect(
      within(
        dock.getByRole('group', { name: 'Tarefas do assistente' }),
      ).getByRole('button', { name: 'Adicionar checklist' }),
    ).toBeDisabled()
    await userEvent.type(requestOf(canvasElement), 'enxugue o trecho{enter}')
    await waitForFinished(canvasElement)
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await expect(editorOf(canvasElement)).toHaveTextContent(
      'em virtude do fato de que',
    )
    await expect(
      editorOf(canvasElement).querySelector('ins'),
    ).toHaveTextContent('para migrar')
    await userEvent.click(
      dock.getByRole('button', { name: 'Remover trecho selecionado' }),
    )
    await expect(
      canvasElement.querySelector('[data-slot="assistant-passage"]'),
    ).toBeNull()
  },
}

export const ADockTaskRunsOnThePassageWhenOneIsHanded: Story = {
  play: async ({ canvasElement }) => {
    await selectRolloutText(
      editorOf(canvasElement),
      'Este plano descreve o recebimeto dos artigos migrados',
    )
    const bubble = await bubbleOf(canvasElement)
    await userEvent.click(
      within(bubble).getByRole('button', { name: 'Pedir ao assistente' }),
    )
    await runTask(canvasElement, 'Corrigir ortografia')
    await waitForFinished(canvasElement)
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await expect(editorOf(canvasElement)).toHaveTextContent('implantaçao')
  },
}

export const AFailingPlannerLeavesTheTextAlone: Story = {
  render: () => (
    <PlanPage
      author={rolloutAuthor}
      defaultValue={rolloutValue()}
      formatTime={rolloutTime}
      planner={() => {
        throw new Error('model offline')
      }}
      stepDelay={0}
    />
  ),
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Corrigir ortografia')
    await waitFor(() =>
      expect(statusOf(canvasElement)).toHaveTextContent('A tarefa falhou.'),
    )
    await expect(reviewItems(canvasElement)).toHaveLength(0)
  },
}

export const ACustomPlannerReceivesTheRequest: Story = {
  render: () => {
    const planner = fn(() => ({
      edits: [
        {
          find: 'Cronograma',
          text: 'Cronograma geral',
          type: 'replace' as const,
        },
      ],
      findings: [],
      steps: [{ id: 'a', kind: 'planning' as const, text: 'Plano do modelo' }],
    }))
    return (
      <PlanPage
        author={rolloutAuthor}
        defaultValue={rolloutValue()}
        formatTime={rolloutTime}
        onChange={richTextEditor5Handlers.onChange}
        planner={planner}
        stepDelay={0}
      />
    )
  },
  play: async ({ canvasElement }) => {
    await runTask(canvasElement, 'Enxugar o texto')
    await waitForFinished(canvasElement)
    await expect(
      within(canvasElement).getByText('Plano do modelo'),
    ).toBeVisible()
    await waitFor(() => expect(reviewItems(canvasElement)).toHaveLength(1))
    await expect(
      reviewItems(canvasElement)[0]?.querySelector('ins'),
    ).toHaveTextContent('Cronograma geral')
  },
}

export const RepliesAreChatMessagesWithATypingIndicator: Story = {
  args: { stepDelay: 350 },
  play: async ({ canvasElement }) => {
    const dock = dockOf(canvasElement)
    await expect(dock.getByText('Como posso ajudar no plano?')).toBeVisible()
    await runTask(canvasElement, 'Enxugar o texto')
    const log = await dock.findByRole('log', {
      name: 'Conversa com o assistente',
    })
    await expect(within(log).getByText('Enxugar o texto')).toBeVisible()
    await expect(
      within(log).getByText('O assistente está trabalhando'),
    ).toBeInTheDocument()
    await waitForFinished(canvasElement)
    await waitFor(() =>
      expect(
        within(log).queryByText('O assistente está trabalhando'),
      ).toBeNull(),
    )
    await expect(
      within(log).getByRole('region', { name: 'Revisão das sugestões' }),
    ).toBeVisible()
  },
}

export const TheCardCollapsesAndTheBubbleReopensIt: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await runTask(canvasElement, 'Enxugar o texto')
    await waitForFinished(canvasElement)
    await userEvent.click(
      dockOf(canvasElement).getByRole('button', {
        name: 'Recolher assistente',
      }),
    )
    await expect(
      canvas.queryByRole('complementary', { name: 'Assistente de escrita' }),
    ).toBeNull()
    const launcher = canvas.getByRole('button', { name: 'Assistente 2' })
    await expect(launcher).toBeVisible()
    await userEvent.click(launcher)
    await userEvent.click(
      dockOf(canvasElement).getByRole('button', {
        name: 'Recolher assistente',
      }),
    )
    await selectRolloutText(editorOf(canvasElement), 'Cronograma')
    const bubble = await bubbleOf(canvasElement)
    await userEvent.click(
      within(bubble).getByRole('button', { name: 'Pedir ao assistente' }),
    )
    await waitFor(() => expect(requestOf(canvasElement)).toHaveFocus())
  },
}

export const SlashInTheComposerRunsATask: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.type(requestOf(canvasElement), '/enx')
    const option = await within(
      await within(document.body).findByRole('listbox'),
    ).findByRole('option', { name: 'Enxugar o texto' })
    await userEvent.click(option)
    await waitForFinished(canvasElement)
    await expect(statusOf(canvasElement)).toHaveTextContent(
      'Pronto: 2 sugestões escritas no texto.',
    )
    await expect(requestOf(canvasElement)).toHaveTextContent('')
  },
}

export const LabelsOverrideTheTexts: Story = {
  render: () => (
    <PlanPage
      author={rolloutAuthor}
      defaultValue={rolloutValue()}
      formatTime={rolloutTime}
      labels={{
        assistant: 'Helper',
        dock: 'Writing assistant',
        request: 'Ask something',
        tasks: {
          checklist: 'Add checklist',
          owners: 'List owners',
          questions: 'List open questions',
          spelling: 'Fix spelling',
          summary: 'Write summary',
          tighten: 'Tighten',
        },
        tasksGroup: 'Assistant tasks',
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dock = within(
      canvas.getByRole('complementary', { name: 'Writing assistant' }),
    )
    await expect(
      dock.getByRole('textbox', { name: 'Ask something' }),
    ).toBeVisible()
    await expect(
      within(dock.getByRole('group', { name: 'Assistant tasks' })).getByRole(
        'button',
        {
          name: 'Fix spelling',
        },
      ),
    ).toBeVisible()
  },
}
