import {
  EnvelopeSimpleIcon,
  HashIcon,
  MapPinIcon,
  PhoneIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { TextCanvas } from './text-canvas.tsx'
import { StatefulText } from './text-layouts.tsx'

const meta = {
  decorators: [TextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Text/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ContactDetails: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The details of a contact, on the [Default](?path=/story/patterns-properties-display-text-layouts--default) layout with `plain` surfaces: the e-mail copies on hover, the empty phone opens a field from its add button, and the source is read-only.',
      },
    },
  },
  render: () => (
    <dl className="grid w-96 grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">E-mail</dt>
      <dd>
        <TextProperty
          ariaLabel="E-mail"
          icon={EnvelopeSimpleIcon}
          trailingVisibility="hover"
          value="mariana.rocha@exemplo.com"
          variant="plain"
          copyable
          labels={{ ...ptBRPropertyLabels.text, copy: 'Copiar e-mail' }}
        />
      </dd>
      <dt className="text-muted-foreground">Telefone</dt>
      <dd>
        <StatefulText
          ariaLabel="Telefone"
          icon={PhoneIcon}
          initialValue={null}
          variant="plain"
          labels={{
            fallback: 'Sem telefone',
            inputPlaceholder: '+55 81 3333-0000',
          }}
        />
      </dd>
      <dt className="text-muted-foreground">Origem</dt>
      <dd>
        <TextProperty
          ariaLabel="Origem"
          value="Indicação"
          variant="plain"
          labels={ptBRPropertyLabels.text}
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('mariana.rocha@exemplo.com')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Sem telefone' }),
    ).toBeVisible()
  },
}

export const TaskId: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The id of a task beside its title, on the [Default](?path=/story/patterns-properties-display-text-layouts--default) layout, with a copy button.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="font-medium">Protocolar recurso no TRT</span>
      <TextProperty
        ariaLabel="ID"
        icon={HashIcon}
        value="TASK-1042"
        copyable
        labels={{ ...ptBRPropertyLabels.text, copy: 'Copiar ID' }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Copiar ID' }),
    ).toBeVisible()
  },
}

export const EventLocation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The location of a hearing under its title, on the [Inline Field](?path=/story/patterns-properties-display-text-layouts--inline-field) layout: the place is edited where it reads.',
      },
    },
  },
  render: () => (
    <div className="grid gap-2 text-sm">
      <span className="font-medium">Audiência de conciliação</span>
      <StatefulText
        ariaLabel="Local"
        editing="inline"
        icon={MapPinIcon}
        initialValue="Sala 4, Fórum Central"
        variant="plain"
        labels={{ fallback: 'Sem local' }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Local' }),
    ).toHaveValue('Sala 4, Fórum Central')
  },
}
