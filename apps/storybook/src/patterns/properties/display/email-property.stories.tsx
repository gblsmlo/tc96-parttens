import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailProperty } from '@tc96/parttens'
import { useState } from 'react'
import { expect, screen, userEvent } from 'storybook/test'
import { propertyArgTypes } from '../../../test-utils/story-arg-types'

const EMAIL = 'ana.souza@example.com'
const OTHER = 'bruno.lima@example.com'

const meta = {
  argTypes: propertyArgTypes,
  component: EmailProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Emails as a row of chips, with the same anatomy as `PhoneProperty`: when empty, the trigger explains itself ("Adicionar e-mail"); with addresses in the row the context is already given and only the `+` remains. What changes compared to the phone is just the input: there is no country or formatting to apply, so it has two forms: `popover` opens a field over the trigger, and `inline` swaps the trigger itself for an `EditableText`. Format belongs to the field; `errorMessage` is for the consumer\'s rejection: duplicate in the workspace, uniqueness, corporate domain.',
      },
    },
  },
  title: 'Patterns/Properties/Display/Email',
} satisfies Meta<typeof EmailProperty>

export default meta

type Story = StoryObj<typeof EmailProperty>

function EmailField({ initial = [] as string[], ...props }) {
  const [value, setValue] = useState<readonly string[]>(initial)
  return <EmailProperty {...props} onValueChange={setValue} value={value} />
}

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With no address at all the trigger is the only content of the row. If it were just a `+`, the initial state would have no affordance whatsoever.',
      },
    },
  },
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.textContent).toContain('Sem e-mail')
  },
  render: () => <EmailField />,
}

export const WithEmails: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With addresses in the row the label leaves the text and becomes the accessible name: the chips next to it already give the context, and repeating the word per address would be noise.',
      },
    },
  },
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.textContent).toBe('')
    await expect(canvas.getByText(EMAIL)).toBeTruthy()
  },
  render: () => <EmailField initial={[EMAIL, OTHER]} />,
}

export const Adding: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The popup is an email field, and `Enter` confirms. A malformed address does not reach the server: the rejection stays next to the field.',
      },
    },
  },
  play: async ({ canvas, step }) => {
    await step('malformed email is rejected in the field itself', async () => {
      await userEvent.click(
        await canvas.findByRole('button', { name: 'Adicionar e-mail' }),
      )
      const field = await screen.findByRole('textbox', { name: 'Principal' })
      await userEvent.type(field, 'ana@{Enter}')

      await expect((await screen.findByRole('alert')).textContent).toContain(
        'e-mail válido',
      )
    })
  },
  render: () => <EmailField />,
}

export const InlineEditing: Story = {
  args: { editing: 'inline' },
  parameters: {
    docs: {
      description: {
        story:
          'With `editing="inline"` the trigger does not open a popup: it gives way to an `EditableText` in the row itself, which commits on `blur`. It suits a surface that holds a single address and does not want to take the person out of the line.',
      },
    },
  },
  play: async ({ canvas, step }) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Adicionar e-mail' }),
    )
    const field = await canvas.findByRole('textbox', {
      name: 'Adicionar e-mail',
    })

    await expect(field.getAttribute('data-slot')).toBe('editable-text')
    await expect(screen.queryByRole('dialog')).toBeNull()

    await step(
      'rejected format keeps the field open with the message',
      async () => {
        await userEvent.type(field, 'ana@')
        await userEvent.tab()

        await expect((await canvas.findByRole('alert')).textContent).toContain(
          'e-mail válido',
        )
        await expect(
          (
            canvas.getByRole('textbox', {
              name: 'Adicionar e-mail',
            }) as HTMLInputElement
          ).value,
        ).toBe('ana@')
      },
    )
  },
  render: () => <EmailField editing="inline" />,
}

export const PersistentTrigger: Story = {
  args: { display: 'trigger' },
  parameters: {
    docs: {
      description: {
        story:
          'With `display="trigger"` the row does not turn into chips: a single trigger that keeps naming the property even when filled, and opens the popup to add, edit or remove. It suits a line where two neighboring rows would collapse into two indistinguishable `+`.',
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('button', { name: 'Adicionar e-mail' }),
    ).toBeNull()
    await expect(
      (await canvas.findByRole('button', { name: /E-mails: / })).textContent,
    ).toContain('+1')
  },
  render: () => <EmailField display="trigger" initial={[EMAIL, OTHER]} />,
}

export const ReadOnly: Story = {
  args: { readOnly: true },
  parameters: {
    docs: {
      description: {
        story: 'Read-only: the addresses appear with no add or remove trigger.',
      },
    },
  },
  render: () => <EmailField initial={[EMAIL]} readOnly />,
}
