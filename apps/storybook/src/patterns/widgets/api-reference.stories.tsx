import type { Meta, StoryObj } from '@storybook/react-vite'
import { CardPanel } from '@tc96/ui/card'
import {
  Amount,
  ExpandableList,
  TrendIndicator,
  WidgetPeriodToggle,
  WidgetShell,
} from '@tc96/ui/patterns'
import { Slot } from '../../test-utils/anatomy-slot.tsx'
import { periodOptions } from './widgets-data.ts'

const meta = {
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Widgets/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <WidgetShell aria-label="WidgetShell">
      <CardPanel className="grid gap-4 p-5">
        <div className="flex items-center gap-3">
          <Slot name="Amount" />
          <Amount value={1234.5} />
        </div>
        <div className="flex items-center gap-3">
          <Slot name="TrendIndicator" />
          <TrendIndicator value={0.12} />
        </div>
        <div className="flex items-center gap-3">
          <Slot name="WidgetPeriodToggle" />
          <WidgetPeriodToggle options={periodOptions} value="month" />
        </div>
        <ExpandableList items={['item']}>
          {() => <Slot name="ExpandableList" />}
        </ExpandableList>
      </CardPanel>
    </WidgetShell>
  ),
}
