import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateProperty, DateRangeProperty } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const VALUE = '2026-06-19T12:00:00.000Z'
const RANGE = {
  from: new Date(2026, 5, 19),
  to: new Date(2026, 5, 23),
}

const onValueChange = fn()

const triggerOf = (canvasElement: HTMLElement, name: string | RegExp) =>
  within(canvasElement).getByRole('button', { name })

const openPopup = async (canvasElement: HTMLElement, name: string | RegExp) => {
  const trigger = triggerOf(canvasElement, name)
  await userEvent.click(trigger)
  await screen.findByRole('dialog')
  return trigger
}

const closePopup = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const positionerAlign = () =>
  document.querySelector<HTMLElement>('[data-slot="popover-positioner"]')
    ?.dataset.align

const meta = {
  decorators: [
    (Story) => (
      <div className="flex min-h-96 items-start p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Shared/Calendar Popover',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const NamesTriggerAfterPropertyAndLabel: Story = {
  render: () => (
    <DateProperty
      ariaLabel="Prazo"
      onValueChange={() => undefined}
      timeZone="UTC"
      value={VALUE}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = triggerOf(canvasElement, 'Prazo: Jun 19')
    const icon = trigger.querySelector('svg')

    await expect(trigger.textContent).toBe('Jun 19')
    await expect(icon?.classList.contains('size-3')).toBe(true)
    await expect(icon?.getBoundingClientRect().width).toBe(12)
    await expect(trigger.querySelector('.truncate')?.textContent).toBe('Jun 19')
    await expect(trigger.hasAttribute('data-empty')).toBe(false)
  },
}

export const AbsentValueIsMuted: Story = {
  render: () => (
    <DateProperty
      ariaLabel="Prazo"
      onValueChange={() => undefined}
      value={null}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      triggerOf(canvasElement, 'Prazo: Sem data').dataset.empty,
    ).toBe('true')
  },
}

export const OpensNamedDialog: Story = {
  render: () => (
    <DateProperty
      ariaLabel="Prazo"
      onValueChange={() => undefined}
      timeZone="UTC"
      value={VALUE}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = await openPopup(canvasElement, 'Prazo: Jun 19')
    const dialog = screen.getByRole('dialog', { name: 'Prazo' })

    await waitFor(() => expect(within(dialog).getByRole('grid')).toBeVisible())
    await expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    await expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await closePopup()
  },
}

export const ClearFooterOnlyWithClearAction: Story = {
  render: () => (
    <div className="flex gap-2">
      <DateProperty
        allowClear={false}
        ariaLabel="Início"
        onValueChange={onValueChange}
        timeZone="UTC"
        value={VALUE}
      />
      <DateProperty
        ariaLabel="Prazo"
        onValueChange={onValueChange}
        timeZone="UTC"
        value={VALUE}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    onValueChange.mockClear()

    await openPopup(canvasElement, 'Início: Jun 19')
    await expect(
      screen.queryByRole('button', { name: 'Limpar data' }),
    ).toBeNull()
    await closePopup()

    await openPopup(canvasElement, 'Prazo: Jun 19')
    await userEvent.click(
      await screen.findByRole('button', { name: 'Limpar data' }),
    )

    await expect(onValueChange).toHaveBeenCalledTimes(1)
    await expect(onValueChange).toHaveBeenCalledWith(null)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const AlignsToStartByDefault: Story = {
  render: () => (
    <DateProperty
      ariaLabel="Prazo"
      onValueChange={() => undefined}
      timeZone="UTC"
      value={VALUE}
    />
  ),
  play: async ({ canvasElement }) => {
    await openPopup(canvasElement, 'Prazo: Jun 19')
    await expect(positionerAlign()).toBe('start')
    await closePopup()
  },
}

export const AlignOverridesStart: Story = {
  render: () => (
    <DateRangeProperty
      ariaLabel="Período"
      onValueChange={() => undefined}
      value={RANGE}
    />
  ),
  play: async ({ canvasElement }) => {
    await openPopup(canvasElement, /^Período: /)
    await expect(positionerAlign()).toBe('center')
    await closePopup()
  },
}

export const PlacementWinsOverAlign: Story = {
  render: () => (
    <div className="flex w-full justify-end">
      <DateRangeProperty
        ariaLabel="Período"
        dropdownPlacement={{ align: 'end' }}
        onValueChange={() => undefined}
        value={RANGE}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await openPopup(canvasElement, /^Período: /)
    await expect(positionerAlign()).toBe('end')
    await closePopup()
  },
}

export const DisabledDoesNotOpen: Story = {
  render: () => (
    <DateProperty
      ariaLabel="Prazo"
      disabled
      onValueChange={() => undefined}
      timeZone="UTC"
      value={VALUE}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(triggerOf(canvasElement, 'Prazo: Jun 19'), {
      pointerEventsCheck: 0,
    })

    await expect(screen.queryByRole('dialog')).toBeNull()
  },
}
