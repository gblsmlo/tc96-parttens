import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  placeCaretAtEnd,
  typedText,
} from '../../../../test-utils/rich-text-typing.ts'
import { followScript, longSpecValue } from '../fixtures/rich-text-editor-4.ts'
import {
  type RichTextEditor4Controls,
  richTextEditor4ControlArgs,
} from './rich-text-editor-4-controls.ts'
import {
  ComposedRichTextEditor4,
  richTextEditor4Handlers,
  selectText,
  sessions,
  TwoClients,
  withToasts,
} from './rich-text-editor-4-layouts.tsx'

const meta = {
  args: { ...richTextEditor4ControlArgs, autoplay: false },
  beforeEach: () => {
    richTextEditor4Handlers.onCommentsChange.mockClear()
  },
  decorators: [withToasts],
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor4/Behavior',
} satisfies Meta<RichTextEditor4Controls>

export default meta

type Story = StoryObj<typeof meta>

const ready = async () => {
  await waitFor(() => expect(sessions.room).not.toBeNull())
  const room = sessions.room
  if (!room) throw new Error('The room is not ready')
  return room
}

const editorOf = async (canvasElement: HTMLElement, name?: string) => {
  const canvas = within(canvasElement)
  return await waitFor(
    () => {
      const editor = canvas.getByRole('textbox', name ? { name } : undefined)
      expect(typedText(editor)).toContain('Checkout em um passo')
      return editor
    },
    { timeout: 5000 },
  )
}

const remoteCaret = (canvasElement: HTMLElement, id: string) =>
  canvasElement.querySelector<HTMLElement>(
    `[data-slot="remote-caret"][data-user="${id}"]`,
  )

const wait = (ms: number) => new Promise((done) => setTimeout(done, ms))

async function typeAtEnd(editor: HTMLElement, text: string) {
  placeCaretAtEnd(editor)
  await waitFor(() => expect(editor).toHaveFocus())
  await userEvent.keyboard(text)
}

export const TwoClientsConverge: Story = {
  render: () => <TwoClients />,
  play: async ({ canvasElement }) => {
    const a = await editorOf(canvasElement, 'Editor da Marina')
    const b = await editorOf(canvasElement, 'Editor do Otávio')
    await typeAtEnd(a, ' Escrito pela Marina.')
    await waitFor(() => expect(typedText(b)).toContain('Escrito pela Marina.'))
    await typeAtEnd(b, ' Escrito pelo Otávio.')
    await waitFor(() => {
      expect(typedText(a)).toContain('Escrito pelo Otávio.')
      expect(typedText(a)).toBe(typedText(b))
    })
  },
}

export const RemoteCaretAndSelectionShowTheName: Story = {
  play: async ({ canvasElement }) => {
    const editor = await editorOf(canvasElement)
    const room = await ready()
    await expect(remoteCaret(canvasElement, 'bruno')).toBeNull()
    room.step()
    room.step()
    await waitFor(async () => {
      const caret = remoteCaret(canvasElement, 'bruno')
      await expect(caret).not.toBeNull()
      await expect(caret).toHaveTextContent('Bruno Lima')
    })
    const caret = remoteCaret(canvasElement, 'bruno') as HTMLElement
    const goal = Array.from(
      editor.querySelectorAll('[data-slate-node="element"]'),
    ).find((node) => node.textContent?.startsWith('Objetivo'))
    const goalBox = goal?.getBoundingClientRect()
    const caretBox = caret.getBoundingClientRect()
    await expect(caretBox.top).toBeGreaterThanOrEqual((goalBox?.top ?? 0) - 2)
    await expect(caretBox.bottom).toBeLessThanOrEqual(
      (goalBox?.bottom ?? 0) + 2,
    )
    const selection = canvasElement.querySelector<HTMLElement>(
      '[data-slot="remote-selection"][data-user="bruno"]',
    )
    await expect(selection).not.toBeNull()
    await expect(selection?.getBoundingClientRect().width).toBeGreaterThan(20)
    await expect(
      canvasElement.querySelector('[data-slot="remote-carets"]'),
    ).toHaveAttribute('aria-hidden', 'true')
  },
}

export const PresenceReportsEditingViewingAndIdle: Story = {
  play: async ({ canvasElement }) => {
    await editorOf(canvasElement)
    const canvas = within(canvasElement)
    const room = await ready()
    room.stepAll()
    await waitFor(async () => {
      await expect(
        canvas.getByRole('button', { name: 'Bruno Lima, Visualizando' }),
      ).toBeVisible()
      await expect(
        canvas.getByRole('button', { name: 'Carla Prado, Editando' }),
      ).toBeVisible()
      await expect(
        canvas.getByRole('button', { name: 'Diego Alves, Ausente' }),
      ).toBeVisible()
    })
    await expect(
      canvas.getByRole('img', { name: 'Você, Visualizando' }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="presence-summary"]'),
    ).toHaveTextContent('1 editando, 2 visualizando, 1 ausente')
  },
}

export const FollowingAFaceScrollsToItsCaret: Story = {
  args: { teammates: 3 },
  render: (args) => (
    <ComposedRichTextEditor4
      {...args}
      script={followScript}
      value={longSpecValue}
    />
  ),
  play: async ({ canvasElement }) => {
    await editorOf(canvasElement)
    const room = await ready()
    room.stepAll()
    const scroller = canvasElement.querySelector<HTMLElement>(
      '[data-slot="rich-text-editor-4-scroll"]',
    ) as HTMLElement
    await waitFor(() =>
      expect(remoteCaret(canvasElement, 'carla')).not.toBeNull(),
    )
    const inView = () => {
      const caret = remoteCaret(canvasElement, 'carla')?.getBoundingClientRect()
      const view = scroller.getBoundingClientRect()
      return !!caret && caret.top >= view.top && caret.bottom <= view.bottom
    }
    await expect(inView()).toBe(false)
    const face = within(canvasElement).getByRole('button', {
      name: /Carla Prado/,
    })
    await userEvent.click(face)
    await expect(face).toHaveAttribute('aria-pressed', 'true')
    await waitFor(() => expect(inView()).toBe(true))
    await expect(scroller.scrollTop).toBeGreaterThan(0)
    await userEvent.click(face)
    await expect(face).toHaveAttribute('aria-pressed', 'false')
  },
}

async function createThread(
  canvasElement: HTMLElement,
  text: string,
  body: string,
  editorName?: string,
) {
  const editor = await editorOf(canvasElement, editorName)
  selectText(editor, text)
  const offer = await waitFor(() => {
    const element = document.querySelector<HTMLElement>(
      '[data-slot="comment-offer"]',
    )
    expect(element).not.toBeNull()
    return element as HTMLElement
  })
  await userEvent.click(within(offer).getByRole('button', { name: 'Comentar' }))
  const compose = await waitFor(() => {
    const element = document.querySelector<HTMLElement>(
      '[data-slot="comment-compose"]',
    )
    expect(element).not.toBeNull()
    return element as HTMLElement
  })
  const field = within(compose).getByRole('textbox', {
    name: 'Escreva um comentário',
  })
  await waitFor(() => expect(field).toHaveFocus())
  await userEvent.type(field, body)
  await userEvent.click(within(compose).getByRole('button', { name: 'Enviar' }))
  await waitFor(() =>
    expect(document.querySelector('[data-slot="comment-compose"]')).toBeNull(),
  )
  return editor
}

export const CommentThreadCanBeCreatedAndAnswered: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = await createThread(
      canvasElement,
      'Conversão',
      'Qual é a meta por canal?',
    )
    const mark = await waitFor(() => {
      const element = editor.querySelector<HTMLElement>('mark[data-comment-id]')
      expect(element).not.toBeNull()
      return element as HTMLElement
    })
    await expect(mark).toHaveTextContent('Conversão')
    const item = await canvas.findByRole('button', {
      name: 'Abrir conversa sobre "Conversão"',
    })
    await expect(item).toHaveTextContent(
      'Marina Costa: Qual é a meta por canal?',
    )
    await waitFor(() => {
      const last = richTextEditor4Handlers.onCommentsChange.mock.lastCall?.[0]
      expect(last?.[0]?.quote).toBe('Conversão')
      expect(last?.[0]?.messages).toHaveLength(1)
    })
    await userEvent.click(mark)
    const thread = await waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        '[data-slot="comment-thread"]',
      )
      expect(element).not.toBeNull()
      return element as HTMLElement
    })
    const reply = within(thread).getByRole('textbox', {
      name: 'Escreva uma resposta',
    })
    await userEvent.type(reply, 'Vamos medir por canal pago e orgânico.')
    await userEvent.click(
      within(thread).getByRole('button', { name: 'Responder' }),
    )
    await waitFor(() =>
      expect(within(thread).getAllByText(/Vamos medir/)).toHaveLength(1),
    )
    await waitFor(() => expect(item).toHaveTextContent('2 mensagens'))
  },
}

export const ResolvingAThreadShowsAnUndoToast: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await createThread(canvasElement, 'Prazo', 'Confirmar a data do piloto.')
    const item = await canvas.findByRole('button', {
      name: 'Abrir conversa sobre "Prazo"',
    })
    await userEvent.click(item)
    const thread = await waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        '[data-slot="comment-thread"]',
      )
      expect(element).not.toBeNull()
      return element as HTMLElement
    })
    await userEvent.click(
      within(thread).getByRole('button', { name: 'Resolver' }),
    )
    await expect(await screen.findByText('Conversa resolvida')).toBeVisible()
    await waitFor(() =>
      expect(
        canvas.queryByRole('button', { name: 'Abrir conversa sobre "Prazo"' }),
      ).toBeNull(),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Desfazer resolução' }),
    )
    await expect(
      await canvas.findByRole('button', {
        name: 'Abrir conversa sobre "Prazo"',
      }),
    ).toHaveAttribute('data-resolved', 'false')
  },
}

export const CommentsReachTheOtherClient: Story = {
  render: () => <TwoClients />,
  play: async ({ canvasElement }) => {
    await createThread(
      canvasElement,
      'Escopo',
      'Falta o escopo de devoluções.',
      'Editor da Marina',
    )
    const second = within(
      canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="rich-text-editor-4"]',
      )[1] as HTMLElement,
    )
    const item = await second.findByRole('button', {
      name: 'Abrir conversa sobre "Escopo"',
    })
    await expect(item).toHaveTextContent(
      'Marina Costa: Falta o escopo de devoluções.',
    )
    await waitFor(() =>
      expect(
        canvasElement
          .querySelectorAll('[data-slot="rich-text-editor-4"]')[1]
          ?.querySelector('mark[data-comment-id]'),
      ).not.toBeNull(),
    )
    await userEvent.click(item)
    const thread = await waitFor(() => {
      const element = document.querySelector<HTMLElement>(
        '[data-slot="comment-thread"]',
      )
      expect(element).not.toBeNull()
      return element as HTMLElement
    })
    await userEvent.type(
      within(thread).getByRole('textbox', { name: 'Escreva uma resposta' }),
      'Incluído.',
    )
    await userEvent.click(
      within(thread).getByRole('button', { name: 'Responder' }),
    )
    const first = within(
      canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="rich-text-editor-4"]',
      )[0] as HTMLElement,
    )
    await waitFor(() =>
      expect(
        first.getByRole('button', { name: 'Abrir conversa sobre "Escopo"' }),
      ).toHaveTextContent('2 mensagens'),
    )
  },
}

export const UndoRevertsOnlyTheLocalEdits: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = await editorOf(canvasElement)
    const room = await ready()
    room.stepAll()
    await waitFor(() =>
      expect(typedText(editor)).toContain('Revisar com o time de dados.'),
    )
    await typeAtEnd(editor, ' Minha nota.')
    await waitFor(() => expect(typedText(editor)).toContain('Minha nota.'))
    const undo = canvas.getByRole('button', { name: 'Desfazer' })
    await waitFor(() => expect(undo).toBeEnabled())
    await userEvent.click(undo)
    await waitFor(() => expect(typedText(editor)).not.toContain('Minha nota.'))
    await expect(typedText(editor)).toContain('Revisar com o time de dados.')
  },
}

export const OfflineEditsQueueAndMergeOnReconnect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = await editorOf(canvasElement)
    const room = await ready()
    const online = canvas.getByRole('switch', { name: 'Online' })
    await userEvent.click(online)
    await expect(online).toHaveAttribute('aria-checked', 'false')
    await expect(await canvas.findByText(/Você está offline/)).toBeVisible()
    room.stepAll()
    await typeAtEnd(editor, ' Escrito sem rede.')
    await waitFor(() =>
      expect(canvas.getByText(/edição aguarda|edições aguardam/)).toBeVisible(),
    )
    await wait(50)
    await expect(typedText(editor)).not.toContain(
      'Revisar com o time de dados.',
    )
    await expect(remoteCaret(canvasElement, 'carla')).toBeNull()
    await userEvent.click(online)
    await waitFor(
      async () => {
        await expect(typedText(editor)).toContain(
          'Revisar com o time de dados.',
        )
        await expect(typedText(editor)).toContain('Escrito sem rede.')
      },
      { timeout: 5000 },
    )
    const note = await waitFor(() => {
      const element = canvasElement.querySelector('[data-slot="online-note"]')
      expect(element).not.toBeNull()
      return element as HTMLElement
    })
    await expect(note).toHaveTextContent('Carla Prado')
    await expect(note).toHaveTextContent('foram mescladas')
    await expect(room.teammates[1] && room.doc.getMap('members').size > 0).toBe(
      true,
    )
  },
}

export const ReplayRestartsTheSession: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = await editorOf(canvasElement)
    const room = await ready()
    room.stepAll()
    await waitFor(() =>
      expect(typedText(editor)).toContain('Revisar com o time de dados.'),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Reproduzir' }))
    await waitFor(() => {
      expect(typedText(editor)).not.toContain('Revisar com o time de dados.')
      expect(remoteCaret(canvasElement, 'bruno')).toBeNull()
    })
    await expect(
      canvas.queryByRole('button', { name: /Abrir conversa/ }),
    ).toBeNull()
    room.step()
    room.step()
    await waitFor(() =>
      expect(remoteCaret(canvasElement, 'bruno')).not.toBeNull(),
    )
  },
}

export const HighlightIsDisabled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = await editorOf(canvasElement)
    selectText(editor, 'Objetivo')
    await userEvent.keyboard('{Meta>}{Shift>}h{/Shift}{/Meta}')
    await userEvent.keyboard('{Control>}{Shift>}h{/Shift}{/Control}')
    await wait(100)
    await expect(editor.querySelector('mark')).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Destaque de texto' }),
    ).toBeNull()
  },
}
