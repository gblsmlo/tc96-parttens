import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroup, RecordGroupRow } from '@tc96/parttens'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const variants = ['card', 'inset', 'plain'] as const

const titles = { card: 'Card', inset: 'Inset', plain: 'Plain' } as const

const regionOf = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('region', { name })

const slotIn = (element: HTMLElement, slot: string) =>
  element.querySelector(`[data-slot="${slot}"]`) as HTMLElement

const classesOf = (element: HTMLElement) => element.className.split(' ')

function EveryVariant({ empty = false }: Readonly<{ empty?: boolean }>) {
  return (
    <div className="flex w-96 flex-col gap-4">
      {variants.map((variant) => (
        <RecordGroup
          empty={empty}
          key={variant}
          title={titles[variant]}
          variant={variant}
        >
          <p>Body</p>
        </RecordGroup>
      ))}
    </div>
  )
}

const meta = {
  args: { title: 'Details' },
  component: RecordGroup,
  render: (args) => (
    <RecordGroup {...args}>
      <p>Body</p>
    </RecordGroup>
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Group Layout',
} satisfies Meta<typeof RecordGroup>

export default meta
type Story = StoryObj<typeof meta>

export const RegionNamedByTitle: Story = {
  play: async ({ canvasElement }) => {
    const region = regionOf(canvasElement, 'Details')

    await expect(region.tagName).toBe('SECTION')
    await expect(region).toHaveAttribute('data-slot', 'record-group')
    await expect(region.querySelector('h2')?.textContent).toBe('Details')
  },
}

export const ActionsAndFooterOnlyWhenPassed: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <RecordGroup title="Details">
        <p>Body</p>
      </RecordGroup>
      <RecordGroup
        actions={<button type="button">Add</button>}
        footer={<p>Footer</p>}
        title="With slots"
      >
        <p>Body</p>
      </RecordGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const bare = regionOf(canvasElement, 'Details')
    const full = regionOf(canvasElement, 'With slots')

    await expect(slotIn(bare, 'record-group-actions')).toBeNull()
    await expect(slotIn(bare, 'record-group-footer')).toBeNull()
    await expect(slotIn(full, 'record-group-actions')).not.toBeNull()
    await expect(slotIn(full, 'record-group-footer')?.textContent).toBe(
      'Footer',
    )
  },
}

export const ActionsSpreadToTheEndByDefault: Story = {
  args: { actions: <button type="button">Add</button> },
  play: async ({ canvasElement }) => {
    const header = slotIn(canvasElement, 'record-group-header')

    await expect(header).toHaveAttribute('data-actions-align', 'between')
    await expect(classesOf(header)).toContain('justify-between')
  },
}

export const ActionsRightAfterTheTitleAtStart: Story = {
  args: { actions: <button type="button">Add</button>, actionsAlign: 'start' },
  play: async ({ canvasElement }) => {
    const header = slotIn(canvasElement, 'record-group-header')
    const classes = classesOf(header)

    await expect(header).toHaveAttribute('data-actions-align', 'start')
    await expect(classes).toContain('justify-start')
    await expect(classes).toContain('gap-2')
    await expect(classes).not.toContain('justify-between')
    await expect([...header.children].map((child) => child.tagName)).toEqual([
      'H2',
      'DIV',
    ])
  },
}

export const FooterAfterTheRowsInsideThePanel: Story = {
  args: { footer: <p>Footer</p> },
  play: async ({ canvasElement }) => {
    const panel = slotIn(canvasElement, 'collapsible-panel')

    await expect(
      [...panel.children].map((child) => child.getAttribute('data-slot')),
    ).toEqual(['record-group-content', 'record-group-footer'])
  },
}

export const PlainByDefaultWithDataVariant: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <RecordGroup title="Details">
        <p>Body</p>
      </RecordGroup>
      <RecordGroup title="Card details" variant="card">
        <p>Body</p>
      </RecordGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(regionOf(canvasElement, 'Details')).toHaveAttribute(
      'data-variant',
      'plain',
    )
    await expect(regionOf(canvasElement, 'Card details')).toHaveAttribute(
      'data-variant',
      'card',
    )
  },
}

export const CardWrapsHeaderContentAndFooter: Story = {
  args: { footer: <p>Footer</p>, variant: 'card' },
  play: async ({ canvasElement }) => {
    const region = regionOf(canvasElement, 'Details')
    const card = region.firstElementChild as HTMLElement

    await expect(region).toHaveAttribute('data-slot', 'record-group')
    await expect(region.children).toHaveLength(1)
    await expect(card).toHaveAttribute('data-slot', 'card')
    for (const slot of [
      'record-group-header',
      'record-group-content',
      'record-group-footer',
    ]) {
      await expect(slotIn(card, slot)).not.toBeNull()
    }
  },
}

export const OnlyInsetKeepsTheHeaderGap: Story = {
  render: () => <EveryVariant />,
  play: async ({ canvasElement }) => {
    for (const variant of variants) {
      await expect(
        classesOf(regionOf(canvasElement, titles[variant])).includes('gap-1'),
      ).toBe(variant === 'inset')
    }
  },
}

export const OnlyInsetPadsTheHeader: Story = {
  render: () => <EveryVariant />,
  play: async ({ canvasElement }) => {
    for (const variant of variants) {
      const header = slotIn(
        regionOf(canvasElement, titles[variant]),
        'record-group-header',
      )

      await expect(classesOf(header).includes('px-1')).toBe(variant === 'inset')
    }
  },
}

export const OnlyPlainDropsTheTriggerPadding: Story = {
  render: () => <EveryVariant />,
  play: async ({ canvasElement }) => {
    for (const variant of variants) {
      const trigger = within(canvasElement).getByRole('button', {
        name: titles[variant],
      })

      await expect(classesOf(trigger).includes('px-1')).toBe(
        variant !== 'plain',
      )
    }
  },
}

export const OnlyPlainPacksTheRows: Story = {
  render: () => <EveryVariant />,
  play: async ({ canvasElement }) => {
    const roomy = ['px-1', '[--record-group-row-gap:calc(var(--spacing)*0.5)]']
    const hoverOffset = '[--record-group-hover-offset:calc(var(--spacing)*2)]'
    const rowHeight = '[--record-group-row-height:calc(var(--spacing)*8)]'

    for (const variant of variants) {
      const classes = classesOf(
        slotIn(
          regionOf(canvasElement, titles[variant]),
          'record-group-content',
        ),
      )

      for (const roomyClass of roomy) {
        await expect(classes.includes(roomyClass)).toBe(variant !== 'plain')
      }
      await expect(
        classes.some((name) => name.includes('--record-group-row-padding')),
      ).toBe(false)
      await expect(classes).toContain(hoverOffset)
      await expect(classes).toContain(rowHeight)
      await expect(classes).toContain('gap-[var(--record-group-row-gap,0px)]')
    }
  },
}

export const InsetAndCardShareTheRowBox: Story = {
  render: () => <EveryVariant />,
  play: async ({ canvasElement }) => {
    const contentClasses = (variant: 'card' | 'inset') =>
      classesOf(
        slotIn(
          regionOf(canvasElement, titles[variant]),
          'record-group-content',
        ),
      ).sort()

    await expect(contentClasses('inset')).toEqual(contentClasses('card'))
  },
}

export const PlainDrawsNoCard: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="card"]')).toBeNull()
  },
}

export const CardAndInsetShellsAreFlatMutedPanels: Story = {
  render: () => <EveryVariant />,
  play: async ({ canvasElement }) => {
    for (const variant of ['card', 'inset'] as const) {
      const classes = classesOf(
        slotIn(regionOf(canvasElement, titles[variant]), 'card'),
      )

      for (const shellClass of [
        'bg-muted/72',
        'p-3',
        'shadow-none',
        'before:hidden',
      ]) {
        await expect(classes).toContain(shellClass)
      }
      for (const cardClass of ['bg-card', 'shadow-xs/5']) {
        await expect(classes).not.toContain(cardClass)
      }
    }
  },
}

export const InsetFramesOnlyTheContent: Story = {
  args: { footer: <p>Footer</p>, variant: 'inset' },
  play: async ({ canvasElement }) => {
    const region = regionOf(canvasElement, 'Details')
    const content = slotIn(region, 'record-group-content')
    const header = slotIn(region, 'record-group-header')

    await expect(region).toHaveAttribute('data-variant', 'inset')
    await expect(region.className).not.toContain('border')
    const card = content.parentElement as HTMLElement
    const footer = slotIn(region, 'record-group-footer')

    await expect(card).toHaveAttribute('data-slot', 'card')
    await expect(region.querySelectorAll('[data-slot="card"]')).toHaveLength(1)
    await expect(card.children).toHaveLength(1)
    await expect(card.firstElementChild).toBe(content)
    await expect(card.contains(header)).toBe(false)
    await expect(card.contains(footer)).toBe(false)
    await expect(region.contains(footer)).toBe(true)
    await expect(content.className).not.toContain('rounded')
    await expect(content.className).not.toContain('divide')
    await expect(content.className).not.toContain('after:')
  },
}

export const EmptyDropsPaddingAndCentering: Story = {
  render: () => <EveryVariant empty />,
  play: async ({ canvasElement }) => {
    for (const variant of variants) {
      const region = regionOf(canvasElement, titles[variant])

      await userEvent.click(
        within(region).getByRole('button', { name: titles[variant] }),
      )
      const content = await waitFor(() => {
        const found = slotIn(region, 'record-group-content')
        expect(found).not.toBeNull()
        return found
      })

      const classes = classesOf(content)
      for (const removed of [
        'py-1',
        'py-6',
        'items-center',
        'justify-center',
        'text-center',
      ]) {
        await expect(classes).not.toContain(removed)
      }
    }
  },
}

export const FullTitleNamesRegionAndTrigger: Story = {
  args: {
    title:
      'A title long enough that it wraps in the header instead of being cut',
  },
  play: async ({ canvasElement }) => {
    const title =
      'A title long enough that it wraps in the header instead of being cut'
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('region', { name: title })).not.toBeNull()
    await expect(canvas.getByRole('button', { name: title })).not.toBeNull()
  },
}

export const EachRowIsItsOwnDescriptionList: Story = {
  render: () => (
    <RecordGroup title="Details">
      <RecordGroupRow label="Owner">Mariana Souza</RecordGroupRow>
      <RecordGroupRow label="Type">Request</RecordGroupRow>
    </RecordGroup>
  ),
  play: async ({ canvasElement }) => {
    const content = slotIn(canvasElement, 'record-group-content')

    await expect(content.tagName).toBe('DIV')
    await expect([...content.children].map((child) => child.tagName)).toEqual([
      'DL',
      'DL',
    ])
    await expect(
      [...content.children].every(
        (child) =>
          child.getAttribute('data-slot') === 'record-group-row' &&
          child.firstElementChild?.tagName === 'DT' &&
          child.lastElementChild?.tagName === 'DD',
      ),
    ).toBe(true)
  },
}

export const EmptyBodyIsAPlainContainer: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Details' }),
    )
    await waitFor(() =>
      expect(within(canvasElement).queryByText('Body')).not.toBeNull(),
    )

    const content = slotIn(canvasElement, 'record-group-content')

    await expect(content.tagName).toBe('DIV')
    await expect(content.querySelector('p')?.textContent).toBe('Body')
  },
}
