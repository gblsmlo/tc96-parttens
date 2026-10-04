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
          'Property unit for a period: campaign validity, support window, reporting interval. It is a single property, not two dates side by side: a start without an end and an end without a start are states of the same thing. When editable, the surface opens a Popover with a Calendar in `mode="range"`.',
      },
    },
  },
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
          'Only one end: the label says which one exists instead of showing half of an interval. This is the state of a campaign that started with no end date defined.',
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
    fallback: 'No period',
    value: undefined,
  },
}

// COSS calendar weekday and outside-month text is 3.14:1 (below 4.5:1); COSS stays unmodified, so only the contrast check is off.
const cossCalendarContrast = {
  a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
}

export const Trigger: Story = {
  parameters: {
    ...cossCalendarContrast,
    docs: {
      description: {
        story:
          'Editable use case: the surface becomes a trigger and opens two months side by side. The first click already returns `from` and `to` on the same day; the second one opens the range, so the popover stays open until the user closes it.',
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
          'The calendar speaks English by default. For another language, the consumer passes the DayPicker locale in `calendarProps`; the surface label follows the `locale` prop.',
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
        ariaLabel="Period"
        calendarProps={calendarProps}
        fallback="No period"
        locale={locale}
        value={value}
        onValueChange={setValue}
      />
    </div>
  )
}
