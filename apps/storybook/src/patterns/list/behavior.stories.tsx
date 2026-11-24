import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  expect,
  fn,
  isInaccessible,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { ListCanvas } from './list-canvas.tsx'
import { listControlArgs } from './list-controls.ts'
import {
  ComposedList,
  LinkRowsFormation,
  MultipleChoiceRowsFormation,
  SingleChoiceRowsFormation,
} from './list-layouts.tsx'

interface BehaviorArgs {
  onDownload: () => void
  onValueChange: (value: unknown) => void
}

const meta = {
  decorators: [ListCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/List/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const slot = (root: HTMLElement, name: string) =>
  root.querySelector<HTMLElement>(`[data-slot="${name}"]`)

const rowOf = (element: HTMLElement) => {
  const row = element.closest<HTMLElement>('[data-slot="list"]')
  if (!row) throw new Error('No icon row around the element')
  return row
}

export const IconIsHiddenFromAssistiveTechnology: Story = {
  render: () => <ComposedList {...listControlArgs} />,
  play: async ({ canvasElement }) => {
    const frame = slot(canvasElement, 'icon-frame')

    await expect(frame).not.toBeNull()
    await expect(isInaccessible(frame as HTMLElement)).toBe(true)
  },
}

export const LongTitleTruncatesAndActionsKeepTheirWidth: Story = {
  render: () => (
    <ComposedList
      {...listControlArgs}
      title="Quarterly report for the board meeting with every regional appendix"
    />
  ),
  play: async ({ canvasElement }) => {
    const row = slot(canvasElement, 'list') as HTMLElement
    const title = slot(canvasElement, 'list-title') as HTMLElement
    const download = within(canvasElement).getByRole('button', {
      name: /^Download/,
    })

    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth)
    await expect(download.getBoundingClientRect().width).toBe(28)
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
  },
}

export const LongDescriptionClampsAtTwoLines: Story = {
  render: () => (
    <ComposedList
      {...listControlArgs}
      description="Updated 2 hours ago by Anna, who added the regional appendix, the new revenue chart and the notes from the finance review"
    />
  ),
  play: async ({ canvasElement }) => {
    const description = slot(canvasElement, 'list-description') as HTMLElement
    const lineHeight = Number.parseFloat(
      getComputedStyle(description).lineHeight,
    )

    await expect(description.scrollHeight).toBeGreaterThan(
      description.clientHeight,
    )
    await expect(description.clientHeight).toBeCloseTo(lineHeight * 2, 0)
  },
}

export const NoDescriptionWithoutDescription: Story = {
  render: () => <ComposedList {...listControlArgs} description="" />,
  play: async ({ canvasElement }) => {
    await expect(slot(canvasElement, 'list-title')).toHaveTextContent(
      'Quarterly report',
    )
    await expect(slot(canvasElement, 'list-description')).toBeNull()
  },
}

export const NoActionsWithoutActions: Story = {
  render: () => <ComposedList {...listControlArgs} actions={false} />,
  play: async ({ canvasElement }) => {
    await expect(slot(canvasElement, 'list-actions')).toBeNull()
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const ActionsAreReachedByKeyboard: Story = {
  args: { onDownload: fn() },
  render: (args) => (
    <ComposedList {...listControlArgs} onDownload={args.onDownload} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const download = canvas.getByRole('button', {
      name: 'Download Quarterly report',
    })
    const more = canvas.getByRole('button', {
      name: 'More actions for Quarterly report',
    })

    await userEvent.tab()
    await expect(download).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onDownload).toHaveBeenCalledOnce()
    await userEvent.tab()
    await expect(more).toHaveFocus()
  },
}

export const PlainVariantDropsTheBorder: Story = {
  render: () => <ComposedList {...listControlArgs} variant="plain" />,
  play: async ({ canvasElement }) => {
    const row = slot(canvasElement, 'list') as HTMLElement
    const style = getComputedStyle(row)

    await expect(row).toHaveAttribute('data-variant', 'plain')
    await expect(style.borderTopWidth).toBe('0px')
    await expect(style.borderTopLeftRadius).toBe('0px')
  },
}

export const OutlineVariantDrawsTheBorder: Story = {
  render: () => <ComposedList {...listControlArgs} />,
  play: async ({ canvasElement }) => {
    const row = slot(canvasElement, 'list') as HTMLElement
    const style = getComputedStyle(row)

    await expect(row).toHaveAttribute('data-variant', 'outline')
    await expect(style.borderTopWidth).toBe('1px')
    await expect(style.borderTopLeftRadius).not.toBe('0px')
  },
}

export const IconColorTintsTheFrame: Story = {
  render: () => <ComposedList {...listControlArgs} iconColor="#2563eb" />,
  play: async ({ canvasElement }) => {
    const frame = slot(canvasElement, 'icon-frame') as HTMLElement

    await expect(getComputedStyle(frame).color).toBe('rgb(37, 99, 235)')
  },
}

export const ButtonRowFillsTheWidthWithTextAtTheStart: Story = {
  render: () => <ComposedList {...listControlArgs} element="button" />,
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByRole('button', {
      name: /^Quarterly report/,
    })
    const frame = row.parentElement as HTMLElement

    await expect(row.tagName).toBe('BUTTON')
    await expect(row).toHaveAttribute('data-slot', 'list')
    await expect(row.getBoundingClientRect().width).toBe(
      frame.getBoundingClientRect().width,
    )
    await expect(getComputedStyle(row).textAlign).toBe('start')
  },
}

export const LinkRowIsOneLinkWithNoInnerControl: Story = {
  render: () => <LinkRowsFormation />,
  play: async ({ canvasElement }) => {
    const links = within(canvasElement).getAllByRole('link')
    const [members] = links

    await expect(links).toHaveLength(3)
    await expect(members).toHaveAccessibleName(/^Members/)
    await expect(members).toHaveAttribute('href', '#members')
    await expect(members).toHaveAttribute('data-slot', 'list')
    await expect(
      within(members as HTMLElement).queryAllByRole('button'),
    ).toHaveLength(0)
    await userEvent.tab()
    await expect(members).toHaveFocus()
  },
}

export const SingleChoiceChecksTheClickedRow: Story = {
  args: { onValueChange: fn() },
  render: (args) => (
    <SingleChoiceRowsFormation onValueChange={args.onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const email = canvas.getByRole('radio', { name: /^Email/ })
    const sms = canvas.getByRole('radio', { name: /^SMS/ })

    await expect(email).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(canvas.getByText('A text message to your phone'))
    await waitFor(() => expect(sms).toHaveAttribute('aria-checked', 'true'))
    await expect(email).toHaveAttribute('aria-checked', 'false')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      'sms',
      expect.anything(),
    )
  },
}

export const CheckedChoiceRowChangesItsBorder: Story = {
  render: () => <SingleChoiceRowsFormation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const emailRow = rowOf(canvas.getByRole('radio', { name: /^Email/ }))
    const smsRow = rowOf(canvas.getByRole('radio', { name: /^SMS/ }))
    const checkedBorder = getComputedStyle(emailRow).borderTopColor
    const uncheckedBorder = getComputedStyle(smsRow).borderTopColor

    await expect(checkedBorder).not.toBe(uncheckedBorder)
    await userEvent.click(smsRow)
    await waitFor(() =>
      expect(getComputedStyle(smsRow).borderTopColor).toBe(checkedBorder),
    )
    await expect(getComputedStyle(emailRow).borderTopColor).toBe(
      uncheckedBorder,
    )
  },
}

export const MultipleChoiceTogglesEachRow: Story = {
  args: { onValueChange: fn() },
  render: (args) => (
    <MultipleChoiceRowsFormation onValueChange={args.onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const onValueChange = args.onValueChange
    const email = canvas.getByRole('checkbox', { name: /^Email/ })
    const push = canvas.getByRole('checkbox', { name: /^Push/ })

    await userEvent.click(rowOf(push))
    await waitFor(() => expect(push).toHaveAttribute('aria-checked', 'true'))
    await expect(email).toHaveAttribute('aria-checked', 'true')
    await expect(onValueChange).toHaveBeenLastCalledWith(
      ['email', 'push'],
      expect.anything(),
    )
    await userEvent.click(rowOf(email))
    await waitFor(() => expect(email).toHaveAttribute('aria-checked', 'false'))
    await expect(onValueChange).toHaveBeenLastCalledWith(
      ['push'],
      expect.anything(),
    )
  },
}
