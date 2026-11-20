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
  ComposerSubmit,
  type ComposerTrigger,
  type ComposerValue,
} from '@tc96/ui/composer'
import { expect, screen, userEvent } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { ComposerCanvas, SuggestionsCanvas } from './composer-frame.tsx'

const anatomyDraft: ComposerValue = [
  { text: 'ComposerInput with a ', type: 'text' },
  {
    id: 'token',
    label: 'ComposerToken',
    trigger: '@',
    type: 'mention',
  },
]

const anatomyTrigger: ComposerTrigger = {
  character: '@',
  filter: null,
  items: [
    { id: 'first', label: 'ComposerItem' },
    { id: 'second', label: 'ComposerItem' },
  ],
}

const meta = {
  component: Composer,
  decorators: [ComposerCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Composer/API Reference',
} satisfies Meta<typeof Composer>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Composer {...args} defaultValue={anatomyDraft}>
      <ComposerInput aria-label="ComposerInput" />
      <ComposerActions>
        <ComposerActionGroup>
          <Slot name="ComposerActionGroup" />
        </ComposerActionGroup>
        <ComposerActionGroup align="end">
          <ComposerSubmit render={<Button size="sm" variant="outline" />}>
            <Slot name="ComposerSubmit" />
          </ComposerSubmit>
        </ComposerActionGroup>
      </ComposerActions>
    </Composer>
  ),
}

export const SuggestionsAnatomy: Story = {
  decorators: [SuggestionsCanvas],
  parameters: {
    docs: { story: { iframeHeight: '360px', inline: false } },
  },
  render: (args) => (
    <Composer {...args} triggers={[anatomyTrigger]}>
      <ComposerInput aria-label="ComposerInput" placeholder="ComposerInput" />
      <ComposerPopup>
        <ComposerStatus>ComposerStatus</ComposerStatus>
        <ComposerList>
          {(item) => (
            <ComposerItem key={item.id} value={item}>
              {item.label}
            </ComposerItem>
          )}
        </ComposerList>
      </ComposerPopup>
    </Composer>
  ),
  play: async ({ canvas }) => {
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'ComposerInput' }),
      '@',
    )
    await expect(
      await screen.findByRole('listbox', { name: 'Suggestions' }),
    ).toBeInTheDocument()
  },
}
