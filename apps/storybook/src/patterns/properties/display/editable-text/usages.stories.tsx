import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { EditableTextCanvas } from './editable-text-canvas.tsx'
import { StatefulEditableText } from './editable-text-layouts.tsx'

const meta = {
  decorators: [EditableTextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/EditableText/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TaskTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The title of a task in a list, on the [Default](?path=/story/patterns-properties-display-editabletext-layouts--default) layout at the `sm` size.',
      },
    },
  },
  render: () => (
    <StatefulEditableText
      ariaLabel="Título da tarefa"
      placeholder="Tarefa sem título"
      size="sm"
      value="Conferir as assinaturas do contrato"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Título da tarefa' }),
    ).toHaveValue('Conferir as assinaturas do contrato')
  },
}

export const RecordTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The title of a new record, on the [Default](?path=/story/patterns-properties-display-editabletext-layouts--default) layout at the `lg` size. "Sem título" is the `emptyValue`: focus clears it, and an empty draft puts it back.',
      },
    },
  },
  render: () => (
    <StatefulEditableText
      ariaLabel="Título do registro"
      className="font-semibold"
      emptyValue="Sem título"
      revertWhenEmpty
      size="lg"
      value="Sem título"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', {
        name: 'Título do registro',
      }),
    ).toHaveValue('Sem título')
  },
}

export const Description: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The description of a task, on the [Multiline](?path=/story/patterns-properties-display-editabletext-layouts--multiline) layout.',
      },
    },
  },
  render: () => (
    <StatefulEditableText
      ariaLabel="Descrição"
      className="leading-relaxed"
      multiline
      placeholder="Adicionar uma descrição"
      size="sm"
      value="O contrato precisa das duas assinaturas antes da reunião de terça, e o financeiro ainda tem que aprovar as condições de pagamento."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Descrição' }),
    ).toBeVisible()
  },
}

export const ContactEmail: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The e-mail of a contact the user cannot edit, on the [Default](?path=/story/patterns-properties-display-editabletext-layouts--default) layout with `readOnly`: the placeholder shows as text, with no field.',
      },
    },
  },
  render: () => (
    <StatefulEditableText
      ariaLabel="E-mail"
      placeholder="Sem e-mail"
      readOnly
      size="sm"
      value={null}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Sem e-mail')).toBeVisible()
  },
}
