import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeopleProperty, type PeoplePropertyOption } from '@tc96/parttens'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { esperarAvatarComAresta } from '../../../test-utils/property-surface'
import { propertyArgTypes } from '../../../test-utils/story-arg-types'

type ExamplePerson = string

const initialOptions: PeoplePropertyOption<ExamplePerson>[] = [
  { imageUrl: undefined, label: 'Bruno Lima', value: 'person-1' },
  { imageUrl: undefined, label: 'Ana Souza', value: 'person-2' },
  { imageUrl: undefined, label: 'Carla Dias', value: 'person-3' },
]

const meta = {
  argTypes: propertyArgTypes,
  args: {
    ariaLabel: 'Participants',
    options: initialOptions,
    value: ['person-1'],
  },
  component: PeopleProperty,
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Collection of people in the chip anatomy that `TagsProperty` already fixes: each chip here carries an avatar and a name, as `PersonProperty` already draws for the single value. The add trigger stays as the last element and becomes just the `+` once someone is applied.',
      },
    },
  },
  render: function People(args) {
    const [value, setValue] = useState(args.value)

    return <PeopleProperty {...args} onValueChange={setValue} value={value} />
  },
  title: 'Patterns/Properties/Display/People',
} satisfies Meta<typeof PeopleProperty>

export default meta

type Story = StoryObj<typeof PeopleProperty>

export const SelectAndRemove: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Editable case with a catalog controlled by the consumer: adding opens the popover, picking a person applies the chip, and removing with the chip's own `x` returns to the previous collection.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The Combobox popover renders in a portal, outside `canvasElement`.
    const body = within(canvasElement.ownerDocument.body)

    await esperarAvatarComAresta(canvasElement, 16)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Adicionar pessoa' }),
    )
    const option = await body.findByRole('option', { name: /Ana Souza/ })
    await esperarAvatarComAresta(option, 24)
    await userEvent.click(option)
    await expect(canvas.getByText('Ana Souza')).toBeInTheDocument()

    await userEvent.click(
      await canvas.findByRole('button', { name: 'Remover Bruno Lima' }),
    )
    await expect(canvas.queryByText('Bruno Lima')).not.toBeInTheDocument()
    await expect(canvas.getByText('Ana Souza')).toBeInTheDocument()
  },
}

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With no one applied the trigger explains itself: icon and label, not just the `+`.',
      },
    },
  },
  args: { value: [] },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: ['person-1', 'person-2'],
  },
}
