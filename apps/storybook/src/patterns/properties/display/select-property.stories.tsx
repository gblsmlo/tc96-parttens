import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectProperty, type SelectPropertyOption } from '@tc96/parttens'
import { CircleDotIcon, MailIcon, PhoneIcon, UsersIcon } from 'lucide-react'
import { useState } from 'react'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../test-utils/property-surface'
import { propertyArgTypes } from '../../../test-utils/story-arg-types'

// O catálogo é do consumer: aqui ele imita uma enumeração de domínio qualquer.
const opcoes: SelectPropertyOption[] = [
  { icon: UsersIcon, label: 'Reunião', tone: 'info', value: 'meeting' },
  { icon: PhoneIcon, label: 'Ligação', tone: 'success', value: 'call' },
  { icon: MailIcon, label: 'E-mail', tone: 'neutral', value: 'email' },
  { icon: CircleDotIcon, label: 'Outro', tone: 'neutral', value: 'other' },
]

const meta = {
  argTypes: {
    ...propertyArgTypes,
    value: { control: 'select', options: opcoes.map((opcao) => opcao.value) },
  },
  args: { ariaLabel: 'Tipo', options: opcoes },
  component: SelectProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Propriedade de catálogo fechado definido pelo consumer. `Status` e `Prioridade` trazem o próprio vocabulário porque ele é delas; aqui as opções vêm de fora, para o pattern servir qualquer enumeração de domínio sem carregá-la (Decisão 030). Ícone e tom são opcionais por opção, e `ariaLabel` é obrigatório — sem domínio próprio não há rótulo a derivar.',
      },
    },
  },
  tags: ['autodocs'],
  title: 'Patterns/Properties/Display/Select',
} satisfies Meta<typeof SelectProperty>

export default meta

type Story = StoryObj<typeof SelectProperty>

export const Default: Story = {
  args: { readOnly: true, value: 'meeting' },
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const Plain: Story = {
  args: { readOnly: true, value: 'meeting', variant: 'plain' },
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
  },
}

export const Dropdown: Story = {
  render: (args) => <SelectDropdownExample {...args} />,
}

export const SemIcone: Story = {
  args: {
    options: opcoes.map(({ label, value }) => ({ label, value })),
    readOnly: true,
    value: 'call',
  },
}

export const SemValor: Story = {
  args: { placeholder: 'Tipo', readOnly: true, value: null },
}

export const LimparValor: Story = {
  render: (args) => (
    <SelectDropdownExample
      {...args}
      emptyOptionLabel="Sem tipo"
      placeholder="Tipo"
    />
  ),
}

export const ForaDoCatalogo: Story = {
  args: { fallback: 'Não informado', readOnly: true, value: 'inexistente' },
}

export const Agrupado: Story = {
  args: {
    ariaLabel: 'Modelo',
    emptyOptionLabel: 'Sem modelo',
    groups: [
      {
        label: 'Reuniões',
        options: [
          { icon: UsersIcon, label: 'Reunião inicial', value: 'meeting_first' },
          {
            icon: UsersIcon,
            label: 'Reunião de retorno',
            value: 'meeting_return',
          },
        ],
      },
      {
        label: 'Contato remoto',
        options: [
          { icon: PhoneIcon, label: 'Ligação', value: 'call' },
          { icon: MailIcon, label: 'E-mail', value: 'email' },
        ],
      },
    ],
    options: undefined,
    placeholder: 'Sem modelo',
    value: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Com `groups` o catálogo chega repartido em seções nomeadas, para a lista que precisa dizer de onde as opções vêm. `options` e `groups` são exclusivos — o catálogo é plano ou repartido, nunca os dois. A opção de valor ausente fica fora das seções, porque não pertence a nenhuma.',
      },
    },
  },
}

export const Disabled: Story = {
  args: { disabled: true, value: 'other', onValueChange: () => undefined },
}

function SelectDropdownExample(
  args: React.ComponentProps<typeof SelectProperty>,
) {
  const [value, setValue] = useState<string | null>('meeting')

  return <SelectProperty {...args} onValueChange={setValue} value={value} />
}
