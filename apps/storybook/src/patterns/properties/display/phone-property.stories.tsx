import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneProperty } from '@tc96/parttens'
import { useState } from 'react'
import { expect, screen, userEvent } from 'storybook/test'
import { propertyArgTypes } from '../../../test-utils/story-arg-types'

const PHONE = '+5511987654321'
const OTHER = '+351912345678'

const meta = {
  argTypes: propertyArgTypes,
  component: PhoneProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Phones as a row of chips, with the same trigger as `TagsProperty`: when empty, the trigger explains itself ("Adicionar telefone"); with numbers in the row the context is already given and only the `+` remains. The difference from Tags is where the value comes from: a tag comes from a closed catalog and the popup is a list; a phone is typed, and the popup is the `PhoneInput`, with a country selector and formatting as you type. Format belongs to the field, which carries the library that validates; `errorMessage` is for the consumer\'s rejection: duplicate in the workspace, uniqueness, role.',
      },
    },
  },
  title: 'Patterns/Properties/Display/Phone',
} satisfies Meta<typeof PhoneProperty>

export default meta

type Story = StoryObj<typeof PhoneProperty>

function PhoneField({ initial = [] as string[], ...props }) {
  const [value, setValue] = useState<readonly string[]>(initial)
  return <PhoneProperty {...props} onValueChange={setValue} value={value} />
}

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With no number at all the trigger is the only content of the row. If it were just a `+`, the initial state would have no affordance whatsoever.',
      },
    },
  },
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole('button', {
      name: 'Adicionar telefone',
    })
    await expect(trigger.textContent).toContain('Sem telefone')
  },
  render: () => <PhoneField />,
}

export const WithPhones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With numbers in the row the label leaves the text and becomes the accessible name: the chips next to it already give the context, and repeating the word per number would be noise. The trigger stays in the same 24px square as `TagsProperty`.',
      },
    },
  },
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole('button', {
      name: 'Adicionar telefone',
    })
    await expect(trigger.textContent).toBe('')

    const rect = trigger.getBoundingClientRect()
    await expect(rect.width).toBe(24)
    await expect(rect.height).toBe(24)
  },
  render: () => <PhoneField initial={[PHONE, OTHER]} />,
}

export const Adding: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The popup is the `PhoneInput`: country selector and formatting in the country pattern as you type. Submitting an incomplete number does not reach the server: the same library that formats knows how to reject, and the message stays next to the field.',
      },
    },
  },
  play: async ({ canvas, step }) => {
    await step(
      'incomplete number is rejected in the field itself',
      async () => {
        await userEvent.click(
          await canvas.findByRole('button', { name: 'Adicionar telefone' }),
        )
        const field = await screen.findByRole('textbox', { name: 'Principal' })
        await userEvent.type(field, '11987')
        // No button in the popup, so `Enter` in the field is what confirms.
        await userEvent.keyboard('{Enter}')
        await expect(await screen.findByRole('alert')).toBeTruthy()
      },
    )
  },
  render: () => <PhoneField initial={[PHONE]} />,
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
      canvas.queryByRole('button', { name: 'Adicionar telefone' }),
    ).toBeNull()
    await expect(
      (await canvas.findByRole('button', { name: /Telefones: / })).textContent,
    ).toContain('+1')
  },
  render: () => <PhoneField display="trigger" initial={[PHONE, OTHER]} />,
}

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Without an action the row offers neither add nor remove: the chip of someone who can only read. When empty, it declares the absence instead of staying blank.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <PhoneProperty value={[PHONE, OTHER]} />
      <PhoneProperty value={[]} />
    </div>
  ),
}

export const AddDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`addDisabled` closes only the add path, without making the row read-only: the existing number is still removable. It is the case of a contract that holds a single primary number: once filled, there is no second one to add, and a `+` would promise what the write would refuse.',
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('button', { name: 'Adicionar telefone' }),
    ).toBe(null)
    await expect(
      await canvas.findByRole('button', { name: `Remover telefone ${PHONE}` }),
    ).toBeTruthy()
  },
  render: () => <PhoneField addDisabled initial={[PHONE]} />,
}

export const WithRejection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The field resolves format on its own. `errorMessage` is for what only the consumer knows (uniqueness in the workspace, role, duplicate) and it appears in the same place.',
      },
    },
  },
  render: () => (
    <PhoneField errorMessage="Another contact with this phone already exists." />
  ),
}
