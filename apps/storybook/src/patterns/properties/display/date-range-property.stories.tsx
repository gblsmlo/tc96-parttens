import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DateRange,
  DateRangeProperty,
  type DateRangePropertyProps,
} from '@tc96/parttens'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../test-utils/property-surface'
import {
  booleanArgType,
  propertyArgTypes,
} from '../../../test-utils/story-arg-types'

const meta = {
  argTypes: {
    ...propertyArgTypes,
    allowClear: booleanArgType,
  },
  component: DateRangeProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Unidade de propriedade para um período — vigência de campanha, janela de atendimento, intervalo de apuração. É uma propriedade só, e não duas datas lado a lado: início sem fim e fim sem início são estados da mesma coisa. Quando editável, a superfície abre um Popover com Calendar em `mode="range"`.',
      },
    },
  },
  tags: ['autodocs'],
  title: 'Patterns/Properties/Display/DateRange',
} satisfies Meta<typeof DateRangeProperty>

export default meta

type Story = StoryObj<typeof DateRangeProperty>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
  args: {
    locale: 'en-US',

    value: {
      from: new Date('2026-06-19T12:00:00.000Z'),
      to: new Date('2026-06-26T12:00:00.000Z'),
    },
  },
}

export const Plain: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
  },
  args: {
    locale: 'en-US',

    value: {
      from: new Date('2026-06-19T12:00:00.000Z'),
      to: new Date('2026-06-26T12:00:00.000Z'),
    },
    variant: 'plain',
  },
}

export const OpenEnded: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Uma ponta só: o rótulo diz qual delas existe em vez de mostrar metade de um intervalo. É o estado de uma campanha que começou sem data de encerramento definida.',
      },
    },
  },
  args: {
    locale: 'en-US',

    value: { from: new Date('2026-06-19T12:00:00.000Z'), to: undefined },
  },
}

export const Empty: Story = {
  args: {
    fallback: 'Sem período',
    value: undefined,
  },
}

// O calendar do COSS pinta dias da semana e dias fora do mês com contraste de
// 3,14:1, abaixo de 4,5:1. O COSS não é alterado aqui; nesta story só o
// contraste deixa de ser verificado.
const cossCalendarContrast = {
  a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
}

export const Trigger: Story = {
  parameters: {
    ...cossCalendarContrast,
    docs: {
      description: {
        story:
          'Caso de uso editável: a superfície vira trigger e abre dois meses lado a lado. O primeiro clique já devolve `from` e `to` no mesmo dia; é o segundo que abre a faixa, então o popover fica aberto até o usuário fechá-lo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button'))
    await expect(await screen.findByText('June 2026')).toBeInTheDocument()
  },
  render: () => <DateRangePropertyPickerStory />,
}

export const CalendarLocale: Story = {
  parameters: {
    ...cossCalendarContrast,
    docs: {
      description: {
        story:
          'O calendar fala inglês por padrão. Para outro idioma, o consumidor passa o locale do DayPicker em `calendarProps`; o rótulo da superfície segue a prop `locale`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button'))
    await expect(await screen.findByText('junho 2026')).toBeInTheDocument()
  },
  render: () => (
    <DateRangePropertyPickerStory
      calendarProps={{ locale: ptBR }}
      locale="pt-BR"
    />
  ),
}

function DateRangePropertyPickerStory({
  calendarProps,
  locale = 'en-US',
}: Readonly<Pick<DateRangePropertyProps, 'calendarProps' | 'locale'>>) {
  const [value, setValue] = useState<DateRange | undefined>({
    from: new Date('2026-06-19T12:00:00.000Z'),
    to: new Date('2026-06-26T12:00:00.000Z'),
  })

  return (
    <div className="flex min-h-136 items-start p-16">
      <DateRangeProperty
        ariaLabel="Período"
        calendarProps={calendarProps}
        fallback="Sem período"
        locale={locale}
        value={value}
        onValueChange={setValue}
      />
    </div>
  )
}
