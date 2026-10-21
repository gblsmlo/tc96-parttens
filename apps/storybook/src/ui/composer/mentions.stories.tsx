import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerItem,
  ComposerList,
  ComposerPopup,
  ComposerStatus,
  ComposerToken,
  type ComposerTrigger,
  getComposerText,
  useComposerContext,
} from '@tc96/ui/composer'
import { AtSignIcon, UserRoundIcon, UsersRoundIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'

const people: ComposerTrigger = {
  character: '@',
  items: [
    { id: 'sam', kind: 'person', label: 'Sam Rivera' },
    { id: 'jordan', kind: 'person', label: 'Jordan Lee' },
    { id: 'design', kind: 'team', label: 'Design team' },
  ],
}

const actions: ComposerTrigger = {
  character: '/',
  items: [
    { id: 'summarize', label: 'Summarize', type: 'action' },
    { id: 'translate', label: 'Translate', type: 'action' },
  ],
}

const loadingPeople: ComposerTrigger = {
  character: '@',
  filter: null,
  items: [],
  status: 'loading',
}

type MentionsStoryProps = ComponentProps<typeof Composer> & {
  tokens: 'default' | 'chip'
}

function MentionButton() {
  const { insertTrigger } = useComposerContext()
  return (
    <Button
      aria-label="Mention someone"
      onClick={() => insertTrigger('@')}
      size="icon-sm"
      variant="ghost"
    >
      <AtSignIcon aria-hidden="true" />
    </Button>
  )
}

function SuggestionStatus() {
  const { status } = useComposerContext()
  if (status !== 'loading') return null
  return <ComposerStatus>Searching people…</ComposerStatus>
}

const meta = {
  args: {
    onAction: fn(),
    onSubmit: fn(),
    tokens: 'default',
    triggers: [people, actions],
  },
  argTypes: {
    tokens: { control: 'inline-radio', options: ['default', 'chip'] },
  },
  component: Composer,
  decorators: [
    (Story) => (
      <div className="w-96 pt-48">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Mentions and slash actions on the contenteditable input. Each trigger lists its items in `ComposerPopup`; selecting a mention inserts a token, while an `action` item calls `onAction` and inserts nothing. `getComposerText` writes a token as its trigger and label. A button can open a trigger with `insertTrigger`, and `renderToken` draws tokens as chips.',
      },
    },
  },
  render: ({ tokens, ...args }) => (
    <Composer {...args}>
      <ComposerInput
        aria-label="Message"
        placeholder="Type @ to mention, / for actions"
        renderToken={
          tokens === 'chip'
            ? (token) => (
                <ComposerToken
                  icon={
                    token.kind === 'team' ? (
                      <UsersRoundIcon aria-hidden="true" />
                    ) : (
                      <UserRoundIcon aria-hidden="true" />
                    )
                  }
                  token={token}
                  variant="chip"
                />
              )
            : undefined
        }
      />
      <ComposerPopup>
        <SuggestionStatus />
        <ComposerList>
          {(item) => (
            <ComposerItem key={item.id} value={item}>
              {item.label}
            </ComposerItem>
          )}
        </ComposerList>
      </ComposerPopup>
      <ComposerActions>
        <ComposerActionGroup>
          <MentionButton />
        </ComposerActionGroup>
      </ComposerActions>
    </Composer>
  ),
  tags: ['!autodocs'],
  title: 'UI/Composer/Mentions',
} satisfies Meta<MentionsStoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Mention: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, 'Ping @sam')
    await userEvent.click(
      await screen.findByRole('option', { name: 'Sam Rivera' }),
    )
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1))
    const [draft] = (args.onSubmit as ReturnType<typeof fn>).mock.calls[0] ?? []
    await expect(getComposerText(draft).trim()).toBe('Ping @Sam Rivera')
  },
}

export const SlashAction: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, '/sum')
    await userEvent.click(
      await screen.findByRole('option', { name: 'Summarize' }),
    )
    await expect(args.onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'summarize' }),
      expect.objectContaining({ character: '/' }),
    )
    await expect(input).not.toHaveTextContent('/sum')
  },
}

export const ChipTokens: Story = {
  args: { tokens: 'chip' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, '@des')
    await userEvent.click(
      await screen.findByRole('option', { name: 'Design team' }),
    )
    await expect(input).toHaveTextContent('Design team')
  },
}

export const MentionButtonOpensSuggestions: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mention someone' }),
    )
    const option = await screen.findByRole('option', { name: 'Jordan Lee' })
    await waitFor(() => expect(option).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(option).not.toBeInTheDocument())
  },
}

export const LoadingResults: Story = {
  args: { triggers: [loadingPeople] },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('textbox', { name: 'Message' }), '@a')
    const status = await screen.findByText('Searching people…')
    await waitFor(() => expect(status).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(status).not.toBeInTheDocument())
  },
}
