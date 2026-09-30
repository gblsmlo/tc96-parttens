import { EditableText } from 'tc96/components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'

const onCommit = fn()

const meta = {
  args: {
    ariaLabel: 'Título',
    onCommit,
    placeholder: 'Sem título',
    value: 'Conferir assinaturas do contrato',
  },
  argTypes: {
    multiline: booleanArgType,
    readOnly: booleanArgType,
    revertWhenEmpty: booleanArgType,
    size: { control: 'inline-radio', options: ['sm', 'base', 'lg', 'xl'] },
    type: { control: 'inline-radio', options: ['text', 'email'] },
  },
  component: EditableText,
  parameters: {
    docs: {
      description: {
        component:
          'Campo de texto editado no lugar. O contrato de teclado é `Enter` para confirmar (linha única), `Escape` para descartar o rascunho e `blur` para persistir. A escala do texto é `size`; peso, família e largura ficam com quem compõe.',
      },
    },
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/Properties/Views/Editable Text',
} satisfies Meta<typeof EditableText>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { size: 'sm' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    onCommit.mockClear()

    const field = canvas.getByLabelText<HTMLInputElement>('Título')
    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contrato assinado')
    await expect(onCommit).not.toHaveBeenCalled()

    await userEvent.tab()
    await expect(onCommit).toHaveBeenCalledWith('Contrato assinado')
  },
}

export const CommitsOnEnter: Story = {
  args: { size: 'sm' },
  parameters: {
    docs: {
      description: {
        story:
          '`Enter` tira o foco, e é o `blur` que persiste — o campo comita uma vez só, sem depender de o teclado e o ponteiro concordarem.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    onCommit.mockClear()

    const field = canvas.getByLabelText<HTMLInputElement>('Título')
    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contrato assinado{Enter}')

    await expect(onCommit).toHaveBeenCalledTimes(1)
    await expect(onCommit).toHaveBeenCalledWith('Contrato assinado')
  },
}

export const DiscardsOnEscape: Story = {
  args: { size: 'sm' },
  parameters: {
    docs: {
      description: {
        story:
          '`Escape` devolve o rascunho ao valor confirmado. Dentro de um diálogo, o evento só sobe quando não há rascunho a descartar: o primeiro `Escape` cancela a edição, o segundo fecha o diálogo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    onCommit.mockClear()

    const field = canvas.getByLabelText<HTMLInputElement>('Título')
    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Rascunho descartado{Escape}')

    await expect(field.value).toBe('Conferir assinaturas do contrato')
    await expect(onCommit).not.toHaveBeenCalled()
  },
}

export const Multiline: Story = {
  args: {
    ariaLabel: 'Descrição',
    className: 'max-w-prose leading-relaxed',
    multiline: true,
    size: 'sm',
    placeholder: 'Adicione uma descrição',
    value: 'O contrato precisa das duas assinaturas antes da reunião de terça.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cresce com o conteúdo por `field-sizing-content`, sem medir altura em JavaScript. `Enter` quebra a linha; o commit fica com o `blur`.',
      },
    },
  },
}

export const RevertWhenEmpty: Story = {
  args: {
    emptyValue: 'Sem título',
    revertWhenEmpty: true,
    size: 'lg',
    value: 'Sem título',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Para o campo que o contrato exige não-vazio: o rascunho vazio volta ao valor confirmado em vez de comitar `null`. `emptyValue` some ao focar, para não ser apagado caractere por caractere.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    onCommit.mockClear()

    const field = canvas.getByLabelText<HTMLInputElement>('Título')
    await userEvent.click(field)
    await expect(field.value).toBe('')

    await userEvent.tab()
    await expect(field.value).toBe('Sem título')
    await expect(onCommit).not.toHaveBeenCalled()
  },
}

export const ReadOnly: Story = {
  args: {
    ariaLabel: 'E-mail',
    placeholder: 'Sem e-mail',
    size: 'sm',
    readOnly: true,
    value: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sem permissão de escrita o campo não é oferecido: o valor vira texto, e o placeholder ocupa a ausência.',
      },
    },
  },
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A escala fecha os quatro degraus que as superfícies usam: `sm` na fileira de propriedades, `base` no corpo, `lg` e `xl` na identidade do registro.',
      },
    },
  },
  render: (args) => (
    <div className="space-y-4">
      {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
        <EditableText
          {...args}
          ariaLabel={`Título ${size}`}
          key={size}
          size={size}
          value={`Título em ${size}`}
        />
      ))}
    </div>
  ),
}
