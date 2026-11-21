import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ComposerItemValue,
  type ComposerQuery,
  type ComposerValue,
  getComposerText,
} from '@tc96/ui/composer'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import { composerControlArgs } from './composer-controls.ts'
import { loadingPeople, textDraft } from './composer-data.ts'
import { ComposerCanvas, SuggestionsCanvas } from './composer-frame.tsx'
import { ComposedComposer, CustomControlComposer } from './composer-layouts.tsx'

interface BehaviorArgs {
  onAction: (item: ComposerItemValue, query: ComposerQuery) => void
  onSubmit: (value: ComposerValue) => void
}

const suggestionArgs = {
  ...composerControlArgs,
  placeholder: 'Type @ to mention, / for actions',
  suggestions: true,
}

const meta = {
  args: { onAction: fn(), onSubmit: fn() },
  argTypes: {
    onAction: { control: false },
    onSubmit: { control: false },
  },
  decorators: [ComposerCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Composer/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const SubmitWaitsForText: Story = {
  render: () => <ComposedComposer {...composerControlArgs} />,
  play: async ({ canvas }) => {
    const send = canvas.getByRole('button', { name: 'Send message' })
    await expect(send).toBeDisabled()
    await userEvent.type(canvas.getByRole('textbox', { name: 'Message' }), 'Hi')
    await expect(send).toBeEnabled()
  },
}

export const EnterSubmits: Story = {
  render: ({ onSubmit }) => (
    <ComposedComposer {...composerControlArgs} onSubmit={onSubmit} />
  ),
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, 'Hi')
    await userEvent.keyboard('{Enter}')
    await expect(args.onSubmit).toHaveBeenCalledWith(textDraft('Hi'))
  },
}

export const SubmitKeepsDraft: Story = {
  render: ({ onSubmit }) => (
    <ComposedComposer {...composerControlArgs} onSubmit={onSubmit} />
  ),
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, 'Hi')
    await userEvent.keyboard('{Enter}')
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(input).toHaveTextContent('Hi')
  },
}

export const TextareaInput: Story = {
  render: ({ onSubmit }) => (
    <ComposedComposer
      {...composerControlArgs}
      input="textarea"
      onSubmit={onSubmit}
    />
  ),
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await expect(input.tagName).toBe('TEXTAREA')
    await userEvent.type(input, 'First line{Shift>}{Enter}{/Shift}second')
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await expect(args.onSubmit).toHaveBeenCalledWith(
      textDraft('First line\nsecond'),
    )
  },
}

export const EnterAddsLine: Story = {
  render: ({ onSubmit }) => (
    <ComposedComposer
      {...composerControlArgs}
      input="textarea"
      onSubmit={onSubmit}
      submitOnEnter="never"
    />
  ),
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, 'One{Enter}Two')
    await expect(input).toHaveValue('One\nTwo')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const AdaptiveLayout: Story = {
  render: () => <ComposedComposer {...composerControlArgs} layout="adaptive" />,
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-layout="adaptive"]'),
    ).not.toBeNull()
  },
}

export const ResetFromContext: Story = {
  render: () => <CustomControlComposer />,
  play: async ({ canvas }) => {
    const reset = canvas.getByRole('button', { name: 'Reset' })
    await expect(reset).toBeDisabled()
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, 'Draft')
    await userEvent.click(reset)
    await expect(input).toHaveTextContent('')
    await expect(reset).toBeDisabled()
  },
}

export const SubmitDisabled: Story = {
  render: ({ onSubmit }) => (
    <ComposedComposer
      {...composerControlArgs}
      onSubmit={onSubmit}
      submitDisabled
    />
  ),
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, 'Still editable{Enter}')
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(
      canvas.getByRole('button', { name: 'Send message' }),
    ).toBeDisabled()
  },
}

export const AllowEmpty: Story = {
  render: ({ onSubmit }) => (
    <ComposedComposer {...composerControlArgs} allowEmpty onSubmit={onSubmit} />
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await expect(args.onSubmit).toHaveBeenCalledWith([])
  },
}

export const Disabled: Story = {
  render: () => (
    <ComposedComposer {...composerControlArgs} disabled input="textarea" />
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'Message' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Send message' }),
    ).toBeDisabled()
  },
}

export const ReadOnly: Story = {
  render: () => (
    <ComposedComposer
      {...composerControlArgs}
      defaultText="Sent drafts stay selectable."
      input="textarea"
      readOnly
    />
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await expect(input).toHaveAttribute('readonly')
    await expect(input).toHaveValue('Sent drafts stay selectable.')
  },
}

export const MentionInsertsToken: Story = {
  decorators: [SuggestionsCanvas],
  render: ({ onSubmit }) => (
    <ComposedComposer {...suggestionArgs} onSubmit={onSubmit} />
  ),
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

export const SlashActionCallsOnAction: Story = {
  decorators: [SuggestionsCanvas],
  render: ({ onAction }) => (
    <ComposedComposer {...suggestionArgs} onAction={onAction} />
  ),
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
  decorators: [SuggestionsCanvas],
  render: () => <ComposedComposer {...suggestionArgs} tokenVariant="chip" />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, '@des')
    await userEvent.click(
      await screen.findByRole('option', { name: 'Design team' }),
    )
    await expect(input).toHaveTextContent('Design team')
    await waitFor(() =>
      expect(
        input.querySelector('[data-slot="composer-token"]'),
      ).toHaveAttribute('data-variant', 'chip'),
    )
  },
}

export const MentionButtonOpensSuggestions: Story = {
  decorators: [SuggestionsCanvas],
  render: () => <ComposedComposer {...suggestionArgs} />,
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

export const LoadingStatus: Story = {
  decorators: [SuggestionsCanvas],
  render: () => (
    <ComposedComposer {...suggestionArgs} triggers={[loadingPeople]} />
  ),
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('textbox', { name: 'Message' }), '@a')
    const status = await screen.findByText('Searching people…')
    await waitFor(() => expect(status).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(status).not.toBeInTheDocument())
  },
}
