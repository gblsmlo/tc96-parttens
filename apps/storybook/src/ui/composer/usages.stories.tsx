import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  type ComposerTrigger,
  type ComposerValue,
} from '@tc96/ui/composer'
import { useState } from 'react'
import { expect } from 'storybook/test'
import { people } from './composer-data.ts'
import { ComposerCanvas } from './composer-frame.tsx'
import {
  AttachButton,
  MentionButton,
  renderChipToken,
  SendButton,
  SuggestionsPopup,
} from './composer-layouts.tsx'

const assistantActions: ComposerTrigger = {
  character: '/',
  items: [
    { id: 'summarize', label: 'Summarize this thread', type: 'action' },
    { id: 'draft-reply', label: 'Draft a reply', type: 'action' },
    { id: 'translate', label: 'Translate to Spanish', type: 'action' },
  ],
}

const budgetReview: ComposerValue = [
  { text: 'Can ', type: 'text' },
  {
    id: 'jordan',
    kind: 'person',
    label: 'Jordan Lee',
    trigger: '@',
    type: 'mention',
  },
  { text: ' review the Q3 budget before Friday?', type: 'text' },
]

const incidentNotes: ComposerValue = [
  {
    text: [
      'Checkout errors started at 14:05 UTC after the payments deploy.',
      'Rolled back at 14:20; error rate is back under 0.1%.',
      'Card payments retried automatically, so no orders were lost.',
      'Next: add a canary step for the payments service.',
      'Postmortem draft is in the incident channel.',
      'Owner for follow-ups: Sam Rivera.',
    ].join('\n'),
    type: 'text',
  },
]

const ThreadReply = () => {
  const [value, setValue] = useState<ComposerValue>([])
  return (
    <Composer
      onSubmit={() => setValue([])}
      onValueChange={setValue}
      value={value}
    >
      <ComposerInput aria-label="Reply" placeholder="Reply to Sam Rivera…" />
      <ComposerActions>
        <ComposerActionGroup>
          <AttachButton />
        </ComposerActionGroup>
        <ComposerActionGroup align="end">
          <SendButton />
        </ComposerActionGroup>
      </ComposerActions>
    </Composer>
  )
}

const meta = {
  decorators: [ComposerCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Composer/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ReplyInThread: Story = {
  render: () => <ThreadReply />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'Reply' }),
    ).toHaveAttribute('data-placeholder', 'Reply to Sam Rivera…')
    await expect(
      canvas.getByRole('button', { name: 'Attach file' }),
    ).toBeVisible()
  },
}

export const AssistantPrompt: Story = {
  render: () => (
    <Composer
      layout="adaptive"
      onAction={() => {}}
      triggers={[assistantActions]}
    >
      <ComposerInput
        aria-label="Ask the assistant"
        placeholder="Ask anything, or type / for actions"
      />
      <SuggestionsPopup />
      <ComposerActions>
        <ComposerActionGroup>
          <AttachButton />
        </ComposerActionGroup>
        <ComposerActionGroup align="end">
          <SendButton />
        </ComposerActionGroup>
      </ComposerActions>
    </Composer>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'Ask the assistant' }),
    ).toBeVisible()
  },
}

export const MentionTeammates: Story = {
  render: () => (
    <Composer defaultValue={budgetReview} triggers={[people]}>
      <ComposerInput
        aria-label="Message #finance"
        placeholder="Message #finance"
        renderToken={renderChipToken}
      />
      <SuggestionsPopup />
      <ComposerActions>
        <ComposerActionGroup>
          <MentionButton />
        </ComposerActionGroup>
        <ComposerActionGroup align="end">
          <SendButton />
        </ComposerActionGroup>
      </ComposerActions>
    </Composer>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'Message #finance' }),
    ).toHaveTextContent('Jordan Lee')
  },
}

export const LongMessage: Story = {
  render: () => (
    <Composer defaultValue={incidentNotes}>
      <ComposerInput
        aria-label="Incident update"
        placeholder="Post an incident update"
      />
      <ComposerActions>
        <ComposerActionGroup align="end">
          <SendButton />
        </ComposerActionGroup>
      </ComposerActions>
    </Composer>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'Incident update' }),
    ).toHaveTextContent('Postmortem draft is in the incident channel.')
  },
}
