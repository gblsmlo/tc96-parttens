import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsProperty, type TagsPropertyOption } from '@tc96/parttens'
import { useState } from 'react'
import { expect } from 'storybook/test'
import {
  booleanArgType,
  propertyArgTypes,
} from '../../../test-utils/story-arg-types'

type ExampleTag = string

const initialOptions: TagsPropertyOption<ExampleTag>[] = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
  { label: 'Urgente', value: 'urgent' },
]

const meta = {
  argTypes: {
    ...propertyArgTypes,
    display: { control: 'inline-radio', options: ['chips', 'count'] },
    isLoading: booleanArgType,
  },
  component: TagsProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Propriedade neutra para coleções de tags com plain como variante padrão e badges secondary para os valores selecionados. O trigger de adição usa os ícones de tag e mais, permanece como último elemento e permite que os chips quebrem para novas linhas; o popover mantém largura própria e não acompanha a row.',
      },
    },
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/Properties/Display/Tags',
} satisfies Meta<typeof TagsProperty>

export default meta

type Story = StoryObj<typeof TagsProperty>

export const Trigger: Story = {
  play: async ({ canvas }) => {
    // O gatilho de adicionar tag é um quadrado de 24px — o mesmo pé da escala de badge.
    const gatilho = await canvas.findByRole('button', { name: 'Adicionar tag' })
    const medida = gatilho.getBoundingClientRect()

    await expect(medida.width).toBe(24)
    await expect(medida.height).toBe(24)
  },
  parameters: {
    docs: {
      description: {
        story: 'Caso editável com catálogo controlado pelo consumer.',
      },
    },
  },
  render: () => <TagsPropertyExample />,
}

export const Plain: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Superfície usada em SummaryProperty: preserva toda a interação sem introduzir um segundo campo visual dentro da linha.',
      },
    },
  },
  render: () => <TagsPropertyExample variant="plain" />,
}

/**
 * Numa linha de coleção a largura pertence às outras propriedades, então o valor
 * some e fica só a quantidade — o mesmo popover continua atrás do gatilho.
 */
export const Count: Story = {
  play: async ({ canvas }) => {
    const gatilho = await canvas.findByRole('button', { name: 'Tags' })

    await expect(gatilho.textContent).toContain('1')
    await expect(canvas.queryByText('Documentos')).toBe(null)
  },
  render: () => <TagsPropertyExample display="count" />,
}

export const ReadOnly: Story = {
  args: {
    options: initialOptions,
    readOnly: true,
    value: ['documents', 'urgent'],
    variant: 'plain',
  },
}

function TagsPropertyExample({
  display,
  variant = 'plain',
}: Readonly<{ display?: 'chips' | 'count'; variant?: 'badge' | 'plain' }>) {
  const options = initialOptions
  const [value, setValue] = useState<readonly string[]>(['documents'])

  return (
    <div className="max-w-sm p-4">
      <TagsProperty
        ariaLabel="Tags"
        display={display}
        onValueChange={setValue}
        options={options}
        value={value}
        variant={variant}
      />
    </div>
  )
}
