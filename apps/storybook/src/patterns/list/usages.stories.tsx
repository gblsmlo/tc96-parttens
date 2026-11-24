import {
  BellRingingIcon,
  BuildingIcon,
  CalendarDotsIcon,
  ChatCircleIcon,
  CreditCardIcon,
  DeviceMobileIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  FileImageIcon,
  FileTextIcon,
  PencilSimpleIcon,
  type Icon as PhosphorIcon,
  ShieldCheckIcon,
  SignatureIcon,
  SparkleIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { List } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { CheckboxGroup } from '@tc96/ui/checkbox-group'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { ListCanvas } from './list-canvas.tsx'
import { dividedListClassName, ListChevron } from './list-layouts.tsx'

const meta = {
  decorators: [ListCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/List/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

interface Entry {
  color?: string
  description: string
  icon: PhosphorIcon
  id: string
  title: string
}

const attachments: readonly Entry[] = [
  {
    description: 'Enviado ontem por Marina Costa · 1,2 MB',
    icon: FileTextIcon,
    id: 'peticao',
    title: 'Petição inicial.pdf',
  },
  {
    description: 'Enviado em 12 de nov. por Rafael Lima · 340 KB',
    icon: SignatureIcon,
    id: 'procuracao',
    title: 'Procuração assinada.pdf',
  },
  {
    description: 'Enviado em 10 de nov. pelo cliente · 2,8 MB',
    icon: FileImageIcon,
    id: 'comprovante',
    title: 'Comprovante de residência.jpg',
  },
]

const AttachmentActions = ({ name }: Readonly<{ name: string }>) => (
  <>
    <Button aria-label={`Baixar ${name}`} size="icon-sm" variant="ghost">
      <DownloadSimpleIcon aria-hidden="true" />
    </Button>
    <Menu>
      <MenuTrigger
        aria-label={`Mais ações de ${name}`}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem>
          <PencilSimpleIcon aria-hidden="true" />
          Renomear
        </MenuItem>
        <MenuItem variant="destructive">
          <TrashIcon aria-hidden="true" />
          Excluir
        </MenuItem>
      </MenuPopup>
    </Menu>
  </>
)

export const Attachments: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The attachments of a lawsuit, on the [Stacked Rows](?path=/story/patterns-list-layouts--stacked-rows) layout: each file with Baixar and a menu to rename or delete it.',
      },
    },
  },
  render: () => (
    <ul aria-label="Anexos" className="flex flex-col gap-2">
      {attachments.map((file) => (
        <li key={file.id}>
          <List
            actions={<AttachmentActions name={file.title} />}
            description={file.description}
            icon={<file.icon aria-hidden="true" />}
            title={file.title}
          />
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Anexos' })

    await expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    await expect(
      within(list).getByRole('button', { name: 'Baixar Petição inicial.pdf' }),
    ).toBeVisible()
  },
}

const integrations: readonly Entry[] = [
  {
    color: '#2563eb',
    description: 'Audiências e prazos na agenda do escritório',
    icon: CalendarDotsIcon,
    id: 'agenda',
    title: 'Agenda',
  },
  {
    color: '#16a34a',
    description: 'Avisos de andamento para o cliente',
    icon: ChatCircleIcon,
    id: 'mensagens',
    title: 'Mensagens',
  },
  {
    color: '#9333ea',
    description: 'Contratos e procurações assinados online',
    icon: SignatureIcon,
    id: 'assinatura',
    title: 'Assinatura eletrônica',
  },
]

function IntegrationsList() {
  const [connected, setConnected] = useState<readonly string[]>(['agenda'])
  const toggle = (id: string) =>
    setConnected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )

  return (
    <ul aria-label="Integrações" className={dividedListClassName}>
      {integrations.map((integration) => {
        const isConnected = connected.includes(integration.id)

        return (
          <li key={integration.id}>
            <List
              actions={
                <Button
                  aria-label={`${isConnected ? 'Desconectar' : 'Conectar'} ${integration.title}`}
                  onClick={() => toggle(integration.id)}
                  size="sm"
                  variant={isConnected ? 'ghost' : 'outline'}
                >
                  {isConnected ? 'Desconectar' : 'Conectar'}
                </Button>
              }
              description={integration.description}
              icon={<integration.icon aria-hidden="true" />}
              iconColor={integration.color}
              title={integration.title}
              variant="plain"
            />
          </li>
        )
      })}
    </ul>
  )
}

export const Integrations: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The integrations of an office, on the [Divided Rows](?path=/story/patterns-list-layouts--divided-rows) layout: each service tinted with its color, with Conectar or Desconectar at the end.',
      },
    },
  },
  render: () => <IntegrationsList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Desconectar Agenda' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Conectar Mensagens' }),
    ).toBeVisible()
  },
}

const settings: readonly Entry[] = [
  {
    description: 'Nome, foto e senha',
    icon: UserIcon,
    id: 'perfil',
    title: 'Perfil',
  },
  {
    description: 'Razão social, CNPJ e endereço',
    icon: BuildingIcon,
    id: 'escritorio',
    title: 'Dados do escritório',
  },
  {
    description: 'Convide a equipe e defina o que cada um vê',
    icon: UsersIcon,
    id: 'usuarios',
    title: 'Usuários e permissões',
  },
  {
    description: 'Plano, faturas e forma de pagamento',
    icon: CreditCardIcon,
    id: 'faturamento',
    title: 'Faturamento',
  },
]

export const AccountSettings: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The sections of the account settings, on the [Link Rows](?path=/story/patterns-list-layouts--link-rows) layout: each row opens its page.',
      },
    },
  },
  render: () => (
    <nav aria-label="Configurações">
      <ul className={dividedListClassName}>
        {settings.map((section) => (
          <li key={section.id}>
            <List
              actions={<ListChevron />}
              description={section.description}
              icon={<section.icon aria-hidden="true" />}
              render={(props) => <a {...props} href={`#${section.id}`} />}
              title={section.title}
              variant="plain"
            />
          </li>
        ))}
      </ul>
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'Configurações',
    })

    await expect(within(nav).getAllByRole('link')).toHaveLength(4)
  },
}

const plans: readonly Entry[] = [
  {
    description: 'R$ 49 por mês · até 3 usuários',
    icon: ShieldCheckIcon,
    id: 'essencial',
    title: 'Essencial',
  },
  {
    description: 'R$ 129 por mês · até 10 usuários e automações',
    icon: SparkleIcon,
    id: 'profissional',
    title: 'Profissional',
  },
  {
    description: 'R$ 349 por mês · usuários ilimitados e suporte dedicado',
    icon: BuildingIcon,
    id: 'escritorio',
    title: 'Escritório',
  },
]

export const ChoosePlan: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The plan step of a sign-up, on the [Single Choice Rows](?path=/story/patterns-list-layouts--single-choice-rows) layout: Profissional starts checked.',
      },
    },
  },
  render: () => (
    <RadioGroup
      aria-label="Plano"
      className="gap-2"
      defaultValue="profissional"
    >
      {plans.map((plan) => (
        <List
          actions={<Radio value={plan.id} />}
          description={plan.description}
          icon={<plan.icon aria-hidden="true" />}
          key={plan.id}
          render={(props) => (
            // biome-ignore lint/a11y/noLabelWithoutControl: the Radio in actions is the control
            <label {...props} />
          )}
          title={plan.title}
        />
      ))}
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('radio')).toHaveLength(3)
    await expect(
      canvas.getByRole('radio', { name: /^Profissional/ }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}

const channels: readonly Entry[] = [
  {
    description: 'Um resumo diário na sua caixa de entrada',
    icon: EnvelopeSimpleIcon,
    id: 'email',
    title: 'E-mail',
  },
  {
    description: 'Um aviso no celular quando um prazo vence hoje',
    icon: DeviceMobileIcon,
    id: 'push',
    title: 'Notificação no celular',
  },
  {
    description: 'Um alerta na barra do app a cada nova intimação',
    icon: BellRingingIcon,
    id: 'app',
    title: 'Alerta no app',
  },
]

export const NotificationChannels: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Where the deadline alerts reach a lawyer, on the [Multiple Choice Rows](?path=/story/patterns-list-layouts--multiple-choice-rows) layout: E-mail and Alerta no app start checked.',
      },
    },
  },
  render: () => (
    <CheckboxGroup
      aria-label="Canais de aviso"
      className="items-stretch gap-2"
      defaultValue={['email', 'app']}
    >
      {channels.map((channel) => (
        <List
          actions={<Checkbox value={channel.id} />}
          description={channel.description}
          icon={<channel.icon aria-hidden="true" />}
          key={channel.id}
          render={(props) => (
            // biome-ignore lint/a11y/noLabelWithoutControl: the Checkbox in actions is the control
            <label {...props} />
          )}
          title={channel.title}
        />
      ))}
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('checkbox')).toHaveLength(3)
    await expect(
      canvas.getByRole('checkbox', { name: /^E-mail/ }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}
