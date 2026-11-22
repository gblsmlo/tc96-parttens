import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextProperty } from '@tc96/parttens'
import { HashIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'
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
  render: () => (
    <dl className="grid w-96 grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">E-mail</dt>
      <dd>
        <TextProperty
          ariaLabel="E-mail"
          copyLabel="Copiar e-mail"
          icon={MailIcon}
          trailingVisibility="hover"
          value="mariana.rocha@exemplo.com"
          variant="plain"
        />
      </dd>
      <dt className="text-muted-foreground">Telefone</dt>
      <dd>
        <StatefulText
          ariaLabel="Telefone"
          fallback="Sem telefone"
          icon={PhoneIcon}
          initialValue={null}
          inputPlaceholder="+55 81 3333-0000"
          variant="plain"
        />
      </dd>
      <dt className="text-muted-foreground">Origem</dt>
      <dd>
        <TextProperty ariaLabel="Origem" value="Indicação" variant="plain" />
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
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="font-medium">Protocolar recurso no TRT</span>
      <TextProperty
        ariaLabel="ID"
        copyLabel="Copiar ID"
        icon={HashIcon}
        value="TASK-1042"
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
  render: () => (
    <div className="grid gap-2 text-sm">
      <span className="font-medium">Audiência de conciliação</span>
      <StatefulText
        ariaLabel="Local"
        editing="inline"
        fallback="Sem local"
        icon={MapPinIcon}
        initialValue="Sala 4, Fórum Central"
        variant="plain"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Local' }),
    ).toHaveValue('Sala 4, Fórum Central')
  },
}
