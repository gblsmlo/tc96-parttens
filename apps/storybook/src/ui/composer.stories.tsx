import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
  useComposerContext,
} from '@tc96/ui/composer'
import { ArrowUpIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { expect, fn, userEvent } from 'storybook/test'
import type { UsageDocsParameters } from '../../.storybook/docs-page.tsx'

const usage = `
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
  getComposerText,
} from '@acme/ui/composer'

const [value, setValue] = useState<ComposerValue>([])

<Composer
  onSubmit={(draft) => {
    onSend(getComposerText(draft))
    setValue([])
  }}
  onValueChange={setValue}
  value={value}
>
  <ComposerInput aria-label="Message" placeholder="Write a message…" />
  <ComposerActions>
    <ComposerActionGroup>{/* Optional leading buttons */}</ComposerActionGroup>
    <ComposerActionGroup align="end">
      <ComposerSubmit
        render={
          <Button aria-label="Send message" size="icon">
            <ArrowUpIcon aria-hidden="true" />
          </Button>
        }
      />
    </ComposerActionGroup>
  </ComposerActions>
</Composer>
`

const docs = {
  api: [
    {
      description:
        'Frame and draft owner, a `form` by default (`render={<div />}` inside another form). `onSubmit` receives the structured draft and never clears it. Controlled through `value` and `onValueChange`, uncontrolled through `defaultValue`. `submitOnEnter` is `always`, `desktop` or `never`; `layout` is `stacked` or `adaptive`. `disabled`, `readOnly`, `submitDisabled` and `allowEmpty` set the submission policy; `triggers` and `onAction` add mentions and slash actions.',
      name: 'Composer',
    },
    {
      description:
        'The editable input, a contenteditable `div` by default; `render={<textarea />}` keeps the draft as plain text. Needs `aria-label` or `aria-labelledby`. `renderToken` draws each selected token. Row limits are the `--composer-min-rows` and `--composer-max-rows` variables on `Composer`.',
      name: 'ComposerInput',
    },
    {
      description:
        'The action row after the input, with a leading and an `align="end"` trailing `ComposerActionGroup`.',
      name: 'ComposerActions, ComposerActionGroup',
    },
    {
      description:
        'Submit control. Pass a COSS `Button` through `render`; it is disabled while the draft cannot be sent.',
      name: 'ComposerSubmit',
    },
    {
      description:
        '`ComposerPopup`, `ComposerList`, `ComposerItem` and `ComposerStatus` render the suggestions of a trigger, right after `ComposerInput`. They need the contenteditable input.',
      name: 'Suggestions',
    },
    {
      description:
        '`getComposerText` turns a draft into text, tokens included. `useComposerContext` gives custom controls `value`, `isEmpty`, `canSubmit`, `submit`, `insertTrigger` and `reset`.',
      name: 'getComposerText, useComposerContext',
    },
  ],
  description: {
    component:
      'COSS Composer, unmodified. A growing message input with a persistent action row, for chat and assistant interfaces. Enter submits and Shift + Enter adds a line. The draft is structured (`ComposerValue`), so the consumer owns sending and clearing it.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

type ComposerStoryProps = ComponentProps<typeof Composer> & {
  input: 'contenteditable' | 'textarea'
  leading: 'none' | 'reset'
}

function ResetMessage() {
  const { isEmpty, reset } = useComposerContext()
  return (
    <Button disabled={isEmpty} onClick={reset} size="sm" variant="ghost">
      Reset
    </Button>
  )
}

const meta = {
  args: {
    input: 'contenteditable',
    leading: 'none',
    onSubmit: fn(),
  },
  argTypes: {
    input: {
      control: 'inline-radio',
      options: ['contenteditable', 'textarea'],
    },
    leading: { control: 'inline-radio', options: ['none', 'reset'] },
  },
  component: Composer,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  render: ({ input, leading, ...args }) => (
    <Composer {...args}>
      {input === 'textarea' ? (
        <ComposerInput
          render={
            <textarea aria-label="Message" placeholder="Write a message…" />
          }
        />
      ) : (
        <ComposerInput aria-label="Message" placeholder="Write a message…" />
      )}
      <ComposerActions>
        <ComposerActionGroup>
          {leading === 'reset' && <ResetMessage />}
        </ComposerActionGroup>
        <ComposerActionGroup align="end">
          <ComposerSubmit
            render={
              <Button aria-label="Send message" size="icon">
                <ArrowUpIcon aria-hidden="true" />
              </Button>
            }
          />
        </ComposerActionGroup>
      </ComposerActions>
    </Composer>
  ),
  title: 'UI/Composer',
} satisfies Meta<ComposerStoryProps>

export default meta
type Story = StoryObj<typeof meta>

const text = (value: string): ComposerValue => [{ text: value, type: 'text' }]

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const send = canvas.getByRole('button', { name: 'Send message' })
    await expect(send).toBeDisabled()
    await userEvent.type(canvas.getByRole('textbox', { name: 'Message' }), 'Hi')
    await expect(send).toBeEnabled()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSubmit).toHaveBeenCalledWith(text('Hi'))
  },
}

export const PlainText: Story = {
  args: { input: 'textarea' },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await expect(input.tagName).toBe('TEXTAREA')
    await userEvent.type(input, 'First line{Shift>}{Enter}{/Shift}second')
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await expect(args.onSubmit).toHaveBeenCalledWith(text('First line\nsecond'))
  },
}

export const Adaptive: Story = {
  args: { layout: 'adaptive' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-layout="adaptive"]'),
    ).not.toBeNull()
  },
}

export const EnterAddsLine: Story = {
  args: { input: 'textarea', submitOnEnter: 'never' },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await userEvent.type(input, 'One{Enter}Two')
    await expect(input).toHaveValue('One\nTwo')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const WithReset: Story = {
  args: { leading: 'reset' },
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
  args: { submitDisabled: true },
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
  args: { allowEmpty: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await expect(args.onSubmit).toHaveBeenCalledWith([])
  },
}

export const Disabled: Story = {
  args: { disabled: true, input: 'textarea' },
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
  args: {
    defaultValue: text('Sent drafts stay selectable.'),
    input: 'textarea',
    readOnly: true,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Message' })
    await expect(input).toHaveAttribute('readonly')
    await expect(input).toHaveValue('Sent drafts stay selectable.')
  },
}
