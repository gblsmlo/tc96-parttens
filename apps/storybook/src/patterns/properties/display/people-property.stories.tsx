import { PeopleProperty, type PeoplePropertyOption } from 'tc96/components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { propertyArgTypes } from '../../../test-utils/story-arg-types'

type ExamplePerson = string

const initialOptions: PeoplePropertyOption<ExamplePerson>[] = [
  { imageUrl: undefined, label: 'Bruno Lima', value: 'person-1' },
  { imageUrl: undefined, label: 'Ana Souza', value: 'person-2' },
  { imageUrl: undefined, label: 'Carla Dias', value: 'person-3' },
]

const meta = {
  argTypes: propertyArgTypes,
  component: PeopleProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Coleção de pessoas na anatomia de chip que `TagsProperty` já fixa — cada chip aqui carrega avatar e nome, como `PersonProperty` já desenha para o valor único. O gatilho de adicionar fica como último elemento, e vira só o `+` quando já há alguém aplicado.',
      },
    },
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/Properties/Display/People',
} satisfies Meta<typeof PeopleProperty>

export default meta

type Story = StoryObj<typeof PeopleProperty>

export const SelectAndRemove: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Caso editável com catálogo controlado pelo consumer: adicionar abre o popover, escolher uma pessoa aplica o chip, e remover pelo `x` do próprio chip devolve à coleção anterior.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // O popover do Combobox sai em portal — vive fora de `canvasElement`.
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(
      await canvas.findByRole('button', { name: 'Adicionar pessoa' }),
    )
    await userEvent.click(
      await body.findByRole('option', { name: /Ana Souza/ }),
    )
    await expect(canvas.getByText('Ana Souza')).toBeInTheDocument()

    await userEvent.click(
      await canvas.findByRole('button', { name: 'Remover Bruno Lima' }),
    )
    await expect(canvas.queryByText('Bruno Lima')).not.toBeInTheDocument()
    await expect(canvas.getByText('Ana Souza')).toBeInTheDocument()
  },
  render: () => <PeoplePropertyExample />,
}

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Sem ninguém aplicado o gatilho se explica: ícone e rótulo, não só o `+`.',
      },
    },
  },
  render: () => <PeoplePropertyExample initial={[]} />,
}

export const ReadOnly: Story = {
  args: {
    options: initialOptions,
    readOnly: true,
    value: ['person-1', 'person-2'],
  },
}

function PeoplePropertyExample({
  initial = ['person-1'],
}: Readonly<{ initial?: readonly ExamplePerson[] }>) {
  const [value, setValue] = useState<readonly ExamplePerson[]>(initial)

  return (
    <div className="max-w-sm p-4">
      <PeopleProperty
        ariaLabel="Participantes"
        onValueChange={setValue}
        options={initialOptions}
        value={value}
      />
    </div>
  )
}
