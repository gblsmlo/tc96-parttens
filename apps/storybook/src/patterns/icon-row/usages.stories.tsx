import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconRow } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { CheckboxGroup } from '@tc96/ui/checkbox-group'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import {
  BellRingIcon,
  BuildingIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  DownloadIcon,
  EllipsisIcon,
  FileImageIcon,
  FileSignatureIcon,
  FileTextIcon,
  type LucideIcon,
  MailIcon,
  MessageCircleIcon,
  PencilIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  SparklesIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { IconRowCanvas } from './icon-row-canvas.tsx'
import { dividedListClassName, IconRowChevron } from './icon-row-layouts.tsx'

const meta = {
  decorators: [IconRowCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/IconRow/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

interface Entry {
  color?: string
  description: string
  icon: LucideIcon
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
    icon: FileSignatureIcon,
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
      <DownloadIcon aria-hidden="true" />
    </Button>
    <Menu>
      <MenuTrigger
        aria-label={`Mais ações de ${name}`}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem>
          <PencilIcon aria-hidden="true" />
          Renomear
        </MenuItem>
        <MenuItem variant="destructive">
          <Trash2Icon aria-hidden="true" />
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
          'The attachments of a lawsuit, on the [Stacked Rows](?path=/story/patterns-iconrow-layouts--stacked-rows) layout: each file with Baixar and a menu to rename or delete it.',
      },
    },
  },
  render: () => (
    <ul aria-label="Anexos" className="flex flex-col gap-2">
      {attachments.map((file) => (
        <li key={file.id}>
          <IconRow
            actions={<AttachmentActions name={file.title} />}
            description={file.description}
            icon={<file.icon />}
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
    icon: CalendarDaysIcon,
    id: 'agenda',
    title: 'Agenda',
  },
  {
    color: '#16a34a',
    description: 'Avisos de andamento para o cliente',
    icon: MessageCircleIcon,
    id: 'mensagens',
    title: 'Mensagens',
  },
  {
    color: '#9333ea',
    description: 'Contratos e procurações assinados online',
    icon: FileSignatureIcon,
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
            <IconRow
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
              icon={<integration.icon />}
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
          'The integrations of an office, on the [Divided Rows](?path=/story/patterns-iconrow-layouts--divided-rows) layout: each service tinted with its color, with Conectar or Desconectar at the end.',
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
          'The sections of the account settings, on the [Link Rows](?path=/story/patterns-iconrow-layouts--link-rows) layout: each row opens its page.',
      },
    },
  },
  render: () => (
    <nav aria-label="Configurações">
      <ul className={dividedListClassName}>
        {settings.map((section) => (
          <li key={section.id}>
            <IconRow
              actions={<IconRowChevron />}
              description={section.description}
              icon={<section.icon />}
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
    icon: SparklesIcon,
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
          'The plan step of a sign-up, on the [Single Choice Rows](?path=/story/patterns-iconrow-layouts--single-choice-rows) layout: Profissional starts checked.',
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
        <IconRow
          actions={<Radio value={plan.id} />}
          description={plan.description}
          icon={<plan.icon />}
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
    icon: MailIcon,
    id: 'email',
    title: 'E-mail',
  },
  {
    description: 'Um aviso no celular quando um prazo vence hoje',
    icon: SmartphoneIcon,
    id: 'push',
    title: 'Notificação no celular',
  },
  {
    description: 'Um alerta na barra do app a cada nova intimação',
    icon: BellRingIcon,
    id: 'app',
    title: 'Alerta no app',
  },
]

export const NotificationChannels: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Where the deadline alerts reach a lawyer, on the [Multiple Choice Rows](?path=/story/patterns-iconrow-layouts--multiple-choice-rows) layout: E-mail and Alerta no app start checked.',
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
        <IconRow
          actions={<Checkbox value={channel.id} />}
          description={channel.description}
          icon={<channel.icon />}
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
