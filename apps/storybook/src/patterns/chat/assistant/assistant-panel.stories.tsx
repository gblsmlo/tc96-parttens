import type { Meta, StoryObj } from '@storybook/react-vite'
import { AssistantPanel } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { failedMessages, messages, suggestions } from './fixtures/assistant'

const usage = `
import { AssistantPanel } from '@acme/patterns'

<div className="relative h-full">
  <AssistantPanel
    description="Li o fluxo, a última execução e o que você anexar."
    expanded={expanded}
    greeting="Oi, Gabriel"
    messages={messages}
    onAttach={openAttachments}
    onEnd={() => setOpen(false)}
    onExpandedChange={setExpanded}
    onNewChat={() => setMessages([])}
    onSend={(text) => ask(text)}
    onSuggestion={(suggestion) => ask(suggestion.label)}
    placement="floating"
    suggestions={suggestions}
    typing={pending}
  />
</div>
`

const docs = {
  api: [
    {
      description:
        'Root component, a `section` named by its `h2` (`Assistente`) on a COSS `Card`. `placement` is `docked` (fills its parent) or `floating` (`absolute`, bottom end corner of the nearest positioned ancestor, over the canvas). `expanded` makes the floating card larger. The header shows `Badge` `Beta` (`badge`) and one icon button with a tooltip for each of `onNewChat`, `onHistory`, `onExpandedChange` (Expandir or Minimizar) and `onEnd`; a button without its callback is not rendered.',
      name: 'AssistantPanel',
    },
    {
      description:
        'With no `messages` the body greets with `greeting` and `description` and lists the `suggestions` under `Experimente perguntar`; with messages it is a `ChatConversation` (`role="log"`) that follows the last one, with the typing indicator while `typing`. An assistant message with `error` shows its text as an alert and the retry button, which calls `onRetry(id)`.',
      name: 'messages, suggestions, typing',
    },
    {
      description:
        'The composer: `Enter` sends, `Shift + Enter` breaks the line. `onSend` receives the trimmed text and the field is cleared. `onAttach` adds the attach button. The fixed `disclaimer` sits under it.',
      name: 'AssistantComposer, onSend, onAttach',
    },
    {
      description:
        'Every visible text defaults to pt-BR and is overridden through `labels`; `placeholder`, `greeting`, `description` and `disclaimer` are separate props.',
      name: 'labels',
    },
  ],
  description: {
    component:
      'A controlled AI assistant card for an editor. The consumer owns the conversation: it passes the messages and suggestions and answers `onSend` and `onSuggestion`; the pattern never calls a model, fetches or persists.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    description: 'Li o fluxo, a última execução e o que você anexar.',
    greeting: 'Oi, Gabriel',
    messages: [],
    onAttach: fn(),
    onEnd: fn(),
    onExpandedChange: fn(),
    onHistory: fn(),
    onNewChat: fn(),
    onRetry: fn(),
    onSend: fn(),
    onSuggestion: fn(),
    placement: 'floating',
    suggestions,
  },
  argTypes: {
    badge: { control: 'boolean' },
    className: { control: 'text' },
    expanded: { control: 'boolean' },
    placement: { control: 'inline-radio', options: ['docked', 'floating'] },
    typing: { control: 'boolean' },
  },
  component: AssistantPanel,
  decorators: [
    (Story) => (
      <div className="relative h-176 w-[56rem] max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs, layout: 'padded' },
  title: 'Patterns/Chat/Assistant',
} satisfies Meta<typeof AssistantPanel>

export default meta

type Story = StoryObj<typeof meta>

const panel = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('region', { name: 'Assistente' })

export const Empty: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await expect(canvas.getByText('Oi, Gabriel')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Quais passos foram pulados?' }),
    )
    await expect(args.onSuggestion).toHaveBeenCalledWith(suggestions[1])
  },
}

export const Conversation: Story = {
  args: { messages },
  play: async ({ args, canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await expect(
      canvas.getByRole('log', { name: 'Mensagens do assistente' }),
    ).toBeVisible()
    const input = canvas.getByRole('textbox', {
      name: 'Mensagem para o assistente',
    })
    await userEvent.type(input, 'Rascunhe um resumo{Enter}')
    await expect(args.onSend).toHaveBeenCalledWith('Rascunhe um resumo')
    await expect(input).toHaveValue('')
  },
}

export const Typing: Story = {
  args: { messages: messages.slice(0, 1), typing: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(panel(canvasElement)).getByText('O assistente está digitando'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  args: { messages: failedMessages },
  name: 'Error',
  play: async ({ args, canvasElement }) => {
    const canvas = within(panel(canvasElement))
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não consegui responder agora.',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    )
    await expect(args.onRetry).toHaveBeenCalledWith('m-error')
  },
}

export const Expanded: Story = {
  args: { expanded: true, messages },
  play: async ({ args, canvasElement }) => {
    await expect(panel(canvasElement)).toHaveAttribute('data-expanded', 'true')
    await userEvent.click(
      within(panel(canvasElement)).getByRole('button', { name: 'Minimizar' }),
    )
    await expect(args.onExpandedChange).toHaveBeenCalledWith(false)
  },
}

export const Minimized: Story = {
  args: { expanded: false, messages },
  play: async ({ args, canvasElement }) => {
    await expect(panel(canvasElement)).toHaveAttribute('data-expanded', 'false')
    await userEvent.click(
      within(panel(canvasElement)).getByRole('button', { name: 'Expandir' }),
    )
    await expect(args.onExpandedChange).toHaveBeenCalledWith(true)
  },
}
