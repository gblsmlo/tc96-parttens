import { PaperclipIcon, TagIcon, UserPlusIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AttachmentsProperty,
  DateProperty,
  DateRangeProperty,
  EmailProperty,
  PeopleProperty,
  PropertyCollection,
  type PropertyCollectionItem,
  TagsProperty,
} from '@tc96/parttens'
import { useEffect, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { isIcon } from '../../test-utils/is-icon'
import { PlainPropertyColumn } from './properties-layouts'

interface BehaviorArgs {
  action: (value: unknown, context: unknown) => void
  onSelect: () => void
  onValueChange: (value: unknown) => void
  onVisibleChange: (visible: readonly string[]) => void
}

const meta = {
  args: {
    action: fn(),
    onSelect: fn(),
    onValueChange: fn(),
    onVisibleChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-96 items-start p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const ignore = () => undefined

const collectionItems: readonly PropertyCollectionItem[] = [
  {
    defaultVisible: true,
    id: 'status',
    label: 'Status',
    render: () => <span>Em progresso</span>,
  },
  {
    defaultVisible: true,
    id: 'assignee',
    label: 'Responsável',
    render: () => <span>Definir responsável</span>,
  },
  {
    id: 'tags',
    label: 'Etiquetas',
    render: () => <span>Adicionar etiqueta</span>,
  },
]

const openCollectionMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', {
      name: 'Ajustar propriedades',
    }),
  )
  return within(await screen.findByRole('menu'))
}

const closeCollectionMenu = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

export const CollectionShowsDefaultVisibleItems: Story = {
  render: () => (
    <PropertyCollection
      ariaLabel="Propriedades da Task"
      items={collectionItems}
    />
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Propriedades da Task',
    })

    await expect(group.textContent).toContain('Em progresso')
    await expect(group.textContent).toContain('Definir responsável')
    await expect(group.textContent).not.toContain('Adicionar etiqueta')
  },
}

export const CollectionContainerDefaultVisibleWins: Story = {
  render: () => (
    <PropertyCollection
      ariaLabel="Propriedades da Task"
      defaultVisible={['tags']}
      items={collectionItems}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Em progresso')).toBeNull()
    await expect(canvas.getByText('Adicionar etiqueta')).toBeVisible()
  },
}

export const CollectionWithoutDefaultsStartsEmpty: Story = {
  render: () => (
    <PropertyCollection
      ariaLabel="Propriedades"
      items={collectionItems.map(({ defaultVisible: _, ...item }) => item)}
    />
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Propriedades',
    })

    await expect(group.textContent).toBe('')

    const menu = await openCollectionMenu(canvasElement)
    await expect(
      menu
        .getAllByRole('menuitemcheckbox')
        .map((option) => option.getAttribute('aria-checked')),
    ).toEqual(['false', 'false', 'false'])
    await closeCollectionMenu()
  },
}

export const CollectionReadOnlyHidesTrigger: Story = {
  render: () => (
    <PropertyCollection
      ariaLabel="Propriedades da Task"
      items={collectionItems}
      readOnly
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Em progresso')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Ajustar propriedades' }),
    ).toBeNull()
  },
}

export const CollectionMenuListsCatalogWithVisibleChecked: Story = {
  render: () => (
    <PropertyCollection
      ariaLabel="Propriedades da Task"
      items={collectionItems}
    />
  ),
  play: async ({ canvasElement }) => {
    const menu = await openCollectionMenu(canvasElement)
    const options = menu.getAllByRole('menuitemcheckbox')

    await expect(options.map((option) => option.textContent)).toEqual([
      'Status',
      'Responsável',
      'Etiquetas',
    ])
    await expect(
      options.map((option) => option.getAttribute('aria-checked')),
    ).toEqual(['true', 'true', 'false'])
    await closeCollectionMenu()
  },
}

export const CollectionMenuOpensByKeyboard: Story = {
  render: ({ onVisibleChange }) => (
    <PropertyCollection
      ariaLabel="Propriedades da Task"
      items={collectionItems}
      onVisibleChange={onVisibleChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Ajustar propriedades',
    })

    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')

    const menu = within(await screen.findByRole('menu'))
    await waitFor(() =>
      expect(
        menu.getByRole('menuitemcheckbox', { name: 'Status' }),
      ).toHaveFocus(),
    )
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    await expect(args.onVisibleChange).toHaveBeenLastCalledWith([
      'status',
      'assignee',
      'tags',
    ])
    await closeCollectionMenu()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const CollectionToggleReportsCatalogOrder: Story = {
  render: ({ onVisibleChange }) => (
    <PropertyCollection
      ariaLabel="Propriedades da Task"
      items={collectionItems}
      onVisibleChange={onVisibleChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const menu = await openCollectionMenu(canvasElement)

    await userEvent.click(
      menu.getByRole('menuitemcheckbox', { name: 'Etiquetas' }),
    )

    await expect(args.onVisibleChange).toHaveBeenCalledTimes(1)
    await expect(args.onVisibleChange).toHaveBeenLastCalledWith([
      'status',
      'assignee',
      'tags',
    ])
    await expect(canvas.getByText('Adicionar etiqueta')).toBeVisible()

    await userEvent.click(
      menu.getByRole('menuitemcheckbox', { name: 'Status' }),
    )

    await expect(args.onVisibleChange).toHaveBeenLastCalledWith([
      'assignee',
      'tags',
    ])
    await expect(canvas.queryByText('Em progresso')).toBeNull()
    await closeCollectionMenu()
  },
}

export const CollectionControlledVisibilityOnlyReports: Story = {
  render: ({ onVisibleChange }) => (
    <PropertyCollection
      ariaLabel="Propriedades da Task"
      items={collectionItems}
      onVisibleChange={onVisibleChange}
      visible={['tags']}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Adicionar etiqueta')).toBeVisible()
    await expect(canvas.queryByText('Em progresso')).toBeNull()

    const menu = await openCollectionMenu(canvasElement)
    await userEvent.click(
      menu.getByRole('menuitemcheckbox', { name: 'Status' }),
    )

    await expect(args.onVisibleChange).toHaveBeenCalledOnce()
    await expect(args.onVisibleChange).toHaveBeenLastCalledWith([
      'status',
      'tags',
    ])
    await expect(canvas.queryByText('Em progresso')).toBeNull()
    await closeCollectionMenu()
  },
}

const TRANSPARENT = 'rgba(0, 0, 0, 0)'
const HOVER = /(?<!\\):hover/g

const resolveBackground = (canvasElement: HTMLElement, value: string) => {
  const probe = document.createElement('span')
  probe.style.backgroundColor = value
  canvasElement.append(probe)
  const color = getComputedStyle(probe).backgroundColor
  probe.remove()
  return color
}

const secondaryBackground = (canvasElement: HTMLElement) =>
  resolveBackground(canvasElement, 'var(--secondary)')

const backgroundOf = (element: HTMLElement) =>
  getComputedStyle(element).backgroundColor

const matchesWithoutHover = (element: HTMLElement, selector: string) => {
  try {
    return element.matches(selector.replace(HOVER, ''))
  } catch {
    return false
  }
}

const rulesOf = (sheet: CSSStyleSheet): CSSRule[] => {
  try {
    return Array.from(sheet.cssRules)
  } catch {
    return []
  }
}

const hoverStylesOf = (element: HTMLElement) => {
  const styles: CSSStyleDeclaration[] = []
  const visit = (rules: readonly CSSRule[]) => {
    for (const rule of rules) {
      if (
        rule instanceof CSSStyleRule &&
        new RegExp(HOVER.source).test(rule.selectorText) &&
        matchesWithoutHover(element, rule.selectorText)
      ) {
        styles.push(rule.style)
      }
      if ('cssRules' in rule) {
        visit(Array.from((rule as CSSGroupingRule).cssRules))
      }
    }
  }
  for (const sheet of Array.from(document.styleSheets)) visit(rulesOf(sheet))
  return styles
}

const hoverBackgroundOf = (
  canvasElement: HTMLElement,
  element: HTMLElement,
) => {
  const declared = hoverStylesOf(element)
    .map((style) => style.getPropertyValue('background-color'))
    .filter(Boolean)
    .at(-1)
  return declared ? resolveBackground(canvasElement, declared) : null
}

const hoverPropertiesOf = (element: HTMLElement) =>
  new Set(hoverStylesOf(element).flatMap((style) => Array.from(style)))

const columnSurfaces = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)
  return {
    interactive: canvas.getByRole('combobox', { name: 'Status: In progress' }),
    readOnly: canvas.getByRole('img', { name: 'Priority: High' }),
  }
}

const rowOfValue = (canvasElement: HTMLElement, row: string) => {
  const found = canvasElement.querySelector<HTMLElement>(`[data-row="${row}"]`)
  if (!found) throw new Error(`No [data-row="${row}"] rendered.`)
  return found
}

const contentLeft = (surface: HTMLElement) =>
  surface.firstElementChild?.getBoundingClientRect().left

export const SurfacePlainHoverShowsSecondary: Story = {
  render: () => <PlainPropertyColumn />,
  play: async ({ canvasElement }) => {
    const secondary = secondaryBackground(canvasElement)
    const { interactive } = columnSurfaces(canvasElement)

    await expect(secondary).not.toBe(TRANSPARENT)
    await expect(backgroundOf(interactive)).toBe(TRANSPARENT)
    await expect(hoverBackgroundOf(canvasElement, interactive)).toBe(secondary)
  },
}

export const SurfacePlainMutedTriggerShowsSecondaryOnHover: Story = {
  render: () => <PlainPropertyColumn />,
  play: async ({ canvasElement }) => {
    const secondary = secondaryBackground(canvasElement)
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Due date: Set due date',
    })

    await expect(trigger.dataset.empty).toBe('true')
    await expect(backgroundOf(trigger)).toBe(TRANSPARENT)
    await expect(hoverBackgroundOf(canvasElement, trigger)).toBe(secondary)
  },
}

export const SurfacePlainKeyboardFocusShowsSecondary: Story = {
  render: () => <PlainPropertyColumn />,
  play: async ({ canvasElement }) => {
    const secondary = secondaryBackground(canvasElement)
    const { interactive } = columnSurfaces(canvasElement)

    await expect(secondary).not.toBe(TRANSPARENT)
    await userEvent.tab()

    await expect(interactive).toHaveFocus()
    await waitFor(() => expect(backgroundOf(interactive)).toBe(secondary))
  },
}

export const SurfacePlainOpenPopupKeepsSecondary: Story = {
  render: () => <PlainPropertyColumn />,
  play: async ({ canvasElement }) => {
    const secondary = secondaryBackground(canvasElement)
    const { interactive } = columnSurfaces(canvasElement)

    await expect(secondary).not.toBe(TRANSPARENT)
    await userEvent.click(interactive)
    await screen.findByRole('listbox')

    await waitFor(() => expect(interactive).toHaveAttribute('data-popup-open'))
    await userEvent.unhover(interactive)
    await waitFor(() =>
      expect(interactive.matches(':hover, :focus-visible')).toBe(false),
    )
    await waitFor(() => expect(backgroundOf(interactive)).toBe(secondary))

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const SurfacePlainReadOnlyHasNoBackground: Story = {
  render: () => <PlainPropertyColumn />,
  play: async ({ canvasElement }) => {
    const { readOnly } = columnSurfaces(canvasElement)

    await expect(backgroundOf(readOnly)).toBe(TRANSPARENT)
    await expect(hoverBackgroundOf(canvasElement, readOnly)).toBeNull()
    await expect(readOnly.tabIndex).toBe(-1)
  },
}

export const SurfacePlainTextKeepsItsX: Story = {
  render: () => <PlainPropertyColumn />,
  play: async ({ canvasElement }) => {
    const { interactive, readOnly } = columnSurfaces(canvasElement)
    const restingX = contentLeft(readOnly)

    await expect(restingX).toBeDefined()
    await expect(contentLeft(interactive)).toBe(restingX)
    await expect([...hoverPropertiesOf(interactive)].sort()).toEqual([
      'background-color',
      'color',
    ])
  },
}

export const SurfacePlainRowHeightHolds: Story = {
  render: () => <PlainPropertyColumn />,
  play: async ({ canvasElement }) => {
    const { interactive } = columnSurfaces(canvasElement)
    const interactiveRow = rowOfValue(canvasElement, 'status')
    const readOnlyRow = rowOfValue(canvasElement, 'priority')
    const restingHeight = interactiveRow.getBoundingClientRect().height

    await expect(interactive.getBoundingClientRect().height).toBe(24)
    await expect(restingHeight).toBe(readOnlyRow.getBoundingClientRect().height)

    await userEvent.click(interactive)
    await screen.findByRole('listbox')

    await expect(interactiveRow.getBoundingClientRect().height).toBe(
      restingHeight,
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

const tagOptions = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
] as const

const rowOf = (
  canvasElement: HTMLElement,
  slot: string,
): HTMLFieldSetElement => {
  const found = canvasElement.querySelector<HTMLFieldSetElement>(
    `fieldset[data-slot="${slot}"]`,
  )
  if (!found) throw new Error(`No fieldset[data-slot="${slot}"] rendered.`)
  return found
}

export const RowNamesFieldsetWithSlotAndVariant: Story = {
  render: () => (
    <TagsProperty
      ariaLabel="Tags"
      options={tagOptions}
      readOnly
      value={['documents', 'return']}
      variant="plain"
    />
  ),
  play: async ({ canvasElement }) => {
    const fieldset = rowOf(canvasElement, 'tags-property')

    await expect(fieldset.getAttribute('aria-label')).toBe('Tags')
    await expect(fieldset.dataset.slot).toBe('tags-property')
    await expect(fieldset.dataset.variant).toBe('plain')
    await expect(fieldset.textContent).toBe('DocumentosRetorno')
  },
}

export const RowResetsChromeAndKeepsLayout: Story = {
  render: () => (
    <TagsProperty
      ariaLabel="Tags"
      options={tagOptions}
      readOnly
      value={['documents']}
    />
  ),
  play: async ({ canvasElement }) => {
    const fieldset = rowOf(canvasElement, 'tags-property')
    const style = getComputedStyle(fieldset)

    for (const token of [
      'm-0',
      'min-w-0',
      'border-0',
      'p-0',
      'flex',
      'gap-1',
    ]) {
      await expect(fieldset.classList.contains(token)).toBe(true)
    }
    await expect(style.margin).toBe('0px')
    await expect(style.minWidth).toBe('0px')
    await expect(style.borderWidth).toBe('0px')
    await expect(style.padding).toBe('0px')
    await expect(style.display).toBe('flex')
    await expect(style.columnGap).toBe('4px')
  },
}

export const RowCallerOverridesReset: Story = {
  render: () => (
    <TagsProperty
      ariaLabel="Tags"
      className="min-w-fit"
      options={tagOptions}
      readOnly
      value={['documents']}
    />
  ),
  play: async ({ canvasElement }) => {
    const fieldset = rowOf(canvasElement, 'tags-property')

    await expect(fieldset.classList.contains('min-w-fit')).toBe(true)
    await expect(fieldset.classList.contains('min-w-0')).toBe(false)
    await expect(getComputedStyle(fieldset).minWidth).toBe('fit-content')
  },
}

export const RowOmitsVariantAndLabel: Story = {
  render: () => (
    <PropertyCollection
      items={[
        {
          defaultVisible: true,
          id: 'status',
          label: 'Status',
          render: () => <span>Em progresso</span>,
        },
      ]}
      readOnly
    />
  ),
  play: async ({ canvasElement }) => {
    const fieldset = rowOf(canvasElement, 'property-collection')

    await expect(fieldset.hasAttribute('data-variant')).toBe(false)
    await expect(fieldset.hasAttribute('aria-label')).toBe(false)
  },
}

export const RowPassesDataAttributes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <TagsProperty
        display="count"
        options={tagOptions}
        readOnly
        value={['documents']}
      />
      <EmailProperty
        editing="inline"
        onValueChange={ignore}
        value={['ana@example.com']}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(rowOf(canvasElement, 'tags-property').dataset.display).toBe(
      'count',
    )
    await expect(rowOf(canvasElement, 'email-property').dataset.editing).toBe(
      'inline',
    )
  },
}

const glyphSize = (glyph: SVGElement | null | undefined) => {
  const box = glyph?.getBoundingClientRect()
  return { height: box?.height, width: box?.width }
}

export const AddTriggerEmptyShowsPlaceholderAndNamesAction: Story = {
  render: () => <EmailProperty onValueChange={ignore} value={[]} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.textContent).toBe('Sem e-mail')
    await expect(trigger.getAttribute('data-empty')).toBe('true')
    await expect(trigger.querySelector('svg')).not.toBeNull()
  },
}

export const AddTriggerEmptyGlyphMatchesEmptyChips: Story = {
  render: () => <EmailProperty onValueChange={ignore} value={[]} />,
  play: async ({ canvasElement }) => {
    const glyph = within(canvasElement)
      .getByRole('button', { name: 'Adicionar e-mail' })
      .querySelector('svg')

    await expect(glyph?.classList.contains('size-4')).toBe(true)
    await expect(glyph?.classList.contains('size-3.5')).toBe(false)
    await expect(glyphSize(glyph)).toEqual({ height: 16, width: 16 })
  },
}

export const AddTriggerWithValueCollapsesToSign: Story = {
  render: () => (
    <EmailProperty onValueChange={ignore} value={['ana@example.com']} />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.textContent).toBe('')
    await expect(trigger.getAttribute('data-empty')).toBeNull()
    await expect(trigger.querySelectorAll('svg')).toHaveLength(1)
    await expect(glyphSize(trigger.querySelector('svg'))).toEqual({
      height: 16,
      width: 16,
    })
  },
}

export const AddTriggerMutedCanBeOverridden: Story = {
  render: () => (
    <AttachmentsProperty
      action={{ icon: PaperclipIcon, label: 'Anexar', onSelect: ignore }}
      ariaLabel="Anexos"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getByRole('button', { name: 'Anexar' })
        .getAttribute('data-empty'),
    ).toBeNull()
  },
}

export const AddTriggerForwardsTriggerProps: Story = {
  render: () => <EmailProperty onValueChange={ignore} value={[]} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar e-mail',
    })

    await expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    await expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog', {
      name: 'Adicionar e-mail',
    })
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(trigger.getAttribute('aria-expanded')).toBe('true')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const AddTriggerRunsOnClickUnlessDisabled: Story = {
  render: ({ onSelect }) => (
    <div className="flex flex-col gap-2">
      <AttachmentsProperty
        action={{ icon: PaperclipIcon, label: 'Anexar arquivo', onSelect }}
        ariaLabel="Anexos"
      />
      <AttachmentsProperty
        action={{
          disabled: true,
          icon: PaperclipIcon,
          label: 'Anexar link',
          onSelect,
        }}
        ariaLabel="Links"
      />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Anexar arquivo' }),
    )
    await expect(args.onSelect).toHaveBeenCalledTimes(1)

    const disabled = canvas.getByRole('button', { name: 'Anexar link' })
    await expect(disabled).toBeDisabled()
    await userEvent.click(disabled, { pointerEventsCheck: 0 })
    await expect(args.onSelect).toHaveBeenCalledTimes(1)
  },
}

const DATE = '2026-06-19T12:00:00.000Z'
const RANGE = {
  from: new Date(2026, 5, 19),
  to: new Date(2026, 5, 23),
}

const openCalendar = async (
  canvasElement: HTMLElement,
  name: string | RegExp,
) => {
  const trigger = within(canvasElement).getByRole('button', { name })
  await userEvent.click(trigger)
  await screen.findByRole('dialog')
  return trigger
}

const closeDialog = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const positionerAlign = (slot: string) =>
  document.querySelector<HTMLElement>(`[data-slot="${slot}"]`)?.dataset.align

export const CalendarPopoverNamesTriggerAfterPropertyAndLabel: Story = {
  render: () => (
    <DateProperty
      ariaLabel="Prazo"
      onValueChange={ignore}
      timeZone="UTC"
      value={DATE}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Prazo: Jun 19',
    })
    const icon = trigger.querySelector('svg')

    await expect(trigger.textContent).toBe('Jun 19')
    await expect(icon?.classList.contains('size-4')).toBe(true)
    await expect(icon?.getBoundingClientRect().width).toBe(16)
    await expect(trigger.querySelector('.truncate')?.textContent).toBe('Jun 19')
    await expect(trigger.hasAttribute('data-empty')).toBe(false)
  },
}

export const CalendarPopoverAbsentValueIsMuted: Story = {
  render: () => (
    <DateProperty ariaLabel="Prazo" onValueChange={ignore} value={null} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Prazo: Sem data' })
        .dataset.empty,
    ).toBe('true')
  },
}

export const CalendarPopoverOpensNamedDialog: Story = {
  render: () => (
    <DateProperty
      ariaLabel="Prazo"
      onValueChange={ignore}
      timeZone="UTC"
      value={DATE}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = await openCalendar(canvasElement, 'Prazo: Jun 19')
    const dialog = screen.getByRole('dialog', { name: 'Prazo' })

    await waitFor(() => expect(within(dialog).getByRole('grid')).toBeVisible())
    await expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    await expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await closeDialog()
  },
}

export const CalendarPopoverClearFooterOnlyWithClearAction: Story = {
  render: ({ onValueChange }) => (
    <div className="flex gap-2">
      <DateProperty
        allowClear={false}
        ariaLabel="Início"
        onValueChange={onValueChange}
        timeZone="UTC"
        value={DATE}
      />
      <DateProperty
        ariaLabel="Prazo"
        onValueChange={onValueChange}
        timeZone="UTC"
        value={DATE}
      />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    await openCalendar(canvasElement, 'Início: Jun 19')
    await expect(
      screen.queryByRole('button', { name: 'Limpar data' }),
    ).toBeNull()
    await closeDialog()

    await openCalendar(canvasElement, 'Prazo: Jun 19')
    await userEvent.click(
      await screen.findByRole('button', { name: 'Limpar data' }),
    )

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith(null)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const CalendarPopoverAlignsToStartByDefault: Story = {
  render: () => (
    <DateProperty
      ariaLabel="Prazo"
      onValueChange={ignore}
      timeZone="UTC"
      value={DATE}
    />
  ),
  play: async ({ canvasElement }) => {
    await openCalendar(canvasElement, 'Prazo: Jun 19')
    await expect(positionerAlign('popover-positioner')).toBe('start')
    await closeDialog()
  },
}

export const CalendarPopoverAlignOverridesStart: Story = {
  render: () => (
    <DateRangeProperty
      ariaLabel="Período"
      onValueChange={ignore}
      value={RANGE}
    />
  ),
  play: async ({ canvasElement }) => {
    await openCalendar(canvasElement, /^Período: /)
    await expect(positionerAlign('popover-positioner')).toBe('center')
    await closeDialog()
  },
}

export const CalendarPopoverPlacementWinsOverAlign: Story = {
  render: () => (
    <div className="flex w-full justify-end">
      <DateRangeProperty
        ariaLabel="Período"
        dropdownPlacement={{ align: 'end' }}
        onValueChange={ignore}
        value={RANGE}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await openCalendar(canvasElement, /^Período: /)
    await expect(positionerAlign('popover-positioner')).toBe('end')
    await closeDialog()
  },
}

export const CalendarPopoverDisabledDoesNotOpen: Story = {
  render: () => (
    <DateProperty
      ariaLabel="Prazo"
      disabled
      onValueChange={ignore}
      timeZone="UTC"
      value={DATE}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Prazo: Jun 19' }),
      { pointerEventsCheck: 0 },
    )

    await expect(screen.queryByRole('dialog')).toBeNull()
  },
}

const ANA = 'ana@example.com'
const BIA = 'bia@example.com'
const CAIO = 'caio@example.com'
const INVALID = 'Informe um e-mail válido.'

const openEntryForm = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Adicionar e-mail' }),
  )
  return within(await screen.findByRole('dialog', { name: 'Adicionar e-mail' }))
}

export const EntryFormLabelsEachEntry: Story = {
  render: () => <EmailProperty onValueChange={ignore} value={[ANA]} />,
  play: async ({ canvasElement }) => {
    const form = await openEntryForm(canvasElement)

    await expect(form.getByText('Principal')).toBeInTheDocument()
    await expect(
      form.getByRole('textbox', { name: 'Principal' }),
    ).toBeInTheDocument()
    await closeDialog()
  },
}

export const EntryFormSingleLabelHidesEntryLabel: Story = {
  render: () => (
    <EmailProperty
      entryLabels={['Principal']}
      onValueChange={ignore}
      value={[ANA]}
    />
  ),
  play: async ({ canvasElement }) => {
    const form = await openEntryForm(canvasElement)

    await expect(
      form.getByRole('textbox', { name: 'Principal' }),
    ).toBeInTheDocument()
    await expect(form.queryByText('Principal')).toBeNull()
    await closeDialog()
  },
}

export const EntryFormFallsBackPastTheLabels: Story = {
  render: () => (
    <EmailProperty
      onValueChange={ignore}
      value={['a@example.com', 'b@example.com', 'c@example.com']}
    />
  ),
  play: async ({ canvasElement }) => {
    const form = await openEntryForm(canvasElement)
    const fields = form.getAllByRole('textbox')

    await expect(form.getByText('3')).toBeInTheDocument()
    await expect(fields).toHaveLength(3)
    await expect(fields[2]?.getAttribute('aria-label')).toBe('Adicionar e-mail')
    await closeDialog()
  },
}

export const EntryFormNoRemoveWithSingleDraft: Story = {
  render: () => <EmailProperty onValueChange={ignore} value={[ANA]} />,
  play: async ({ canvasElement }) => {
    const form = await openEntryForm(canvasElement)

    await expect(form.queryByRole('button', { name: /Remover/ })).toBeNull()
    await closeDialog()
  },
}

export const EntryFormRemovesTheDraftAtItsIndex: Story = {
  render: ({ onValueChange }) => (
    <EmailProperty onValueChange={onValueChange} value={[ANA, BIA]} />
  ),
  play: async ({ args, canvasElement }) => {
    const form = await openEntryForm(canvasElement)

    await userEvent.click(
      form.getByRole('button', { name: 'Remover Secundário e-mail' }),
    )

    await expect(form.getAllByRole('textbox')).toHaveLength(1)
    await expect(form.getByRole('textbox', { name: 'Principal' })).toHaveValue(
      ANA,
    )

    await userEvent.click(form.getByRole('button', { name: 'Salvar' }))
    await expect(args.onValueChange).toHaveBeenCalledWith([ANA])
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const EntryFormForwardsTypingWithTheFieldIndex: Story = {
  render: ({ onValueChange }) => (
    <EmailProperty onValueChange={onValueChange} value={[ANA, BIA]} />
  ),
  play: async ({ args, canvasElement }) => {
    const form = await openEntryForm(canvasElement)
    const second = form.getByRole('textbox', { name: 'Secundário' })

    await userEvent.clear(second)
    await userEvent.type(second, 'novo@example.com')

    await expect(second).toHaveValue('novo@example.com')
    await expect(form.getByRole('textbox', { name: 'Principal' })).toHaveValue(
      ANA,
    )

    await userEvent.click(form.getByRole('button', { name: 'Salvar' }))
    await expect(args.onValueChange).toHaveBeenCalledWith([
      ANA,
      'novo@example.com',
    ])
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const EntryFormSavesOnEnterWithoutReachingThePopup: Story = {
  render: ({ onValueChange }) => (
    <EmailProperty onValueChange={onValueChange} value={[ANA]} />
  ),
  play: async ({ args, canvasElement }) => {
    const form = await openEntryForm(canvasElement)
    const field = form.getByRole('textbox', { name: 'Principal' })
    const outer = fn()
    document.addEventListener('keydown', outer)

    await userEvent.type(field, '{Enter}')
    document.removeEventListener('keydown', outer)

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(outer).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const EntryFormIgnoresOtherKeys: Story = {
  render: ({ onValueChange }) => (
    <EmailProperty onValueChange={onValueChange} value={[ANA]} />
  ),
  play: async ({ args, canvasElement }) => {
    const form = await openEntryForm(canvasElement)

    await userEvent.type(form.getByRole('textbox', { name: 'Principal' }), 'a')

    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(screen.getByRole('dialog')).toBeInTheDocument()
    await closeDialog()
  },
}

export const EntryFormSavesThroughSubmitWithoutNativeValidation: Story = {
  render: ({ onValueChange }) => (
    <EmailProperty onValueChange={onValueChange} value={[ANA]} />
  ),
  play: async ({ args, canvasElement }) => {
    const form = await openEntryForm(canvasElement)

    await expect(
      form.getByRole('button', { name: 'Salvar' }).closest('form')?.noValidate,
    ).toBe(true)

    await userEvent.click(form.getByRole('button', { name: 'Salvar' }))

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const EntryFormAddAnotherDisabledWhenNotAllowed: Story = {
  render: () => <EmailProperty onValueChange={ignore} value={[ANA, BIA]} />,
  play: async ({ canvasElement }) => {
    const form = await openEntryForm(canvasElement)

    await expect(
      form.getByRole('button', { name: 'Adicionar outro' }),
    ).toBeDisabled()
    await closeDialog()
  },
}

export const EntryFormAddAnotherAddsAnEntry: Story = {
  render: () => <EmailProperty onValueChange={ignore} value={[ANA]} />,
  play: async ({ canvasElement }) => {
    const form = await openEntryForm(canvasElement)

    await userEvent.click(form.getByRole('button', { name: 'Adicionar outro' }))

    await expect(form.getAllByRole('textbox')).toHaveLength(2)
    await expect(form.getByRole('textbox', { name: 'Secundário' })).toHaveValue(
      '',
    )
    await closeDialog()
  },
}

export const EntryFormAnnouncesFieldErrorsAndConsumerRefusal: Story = {
  render: ({ onValueChange }) => (
    <EmailProperty
      errorMessage="Já existe no workspace."
      onValueChange={onValueChange}
      value={[]}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const form = await openEntryForm(canvasElement)
    const field = form.getByRole('textbox', { name: 'Principal' })

    await userEvent.type(field, 'ana')
    await userEvent.click(form.getByRole('button', { name: 'Salvar' }))

    const alerts = await form.findAllByRole('alert')
    await expect(alerts.map((alert) => alert.textContent)).toEqual([
      'Informe um e-mail válido.',
      'Já existe no workspace.',
    ])
    await expect(field.getAttribute('aria-invalid')).toBe('true')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await closeDialog()
  },
}

const documents = { label: 'Documentos', value: 'documents' }
const returns = { label: 'Retorno', value: 'return' }
const multiOptions = [documents, returns]

const multiPeople = [
  { fallback: 'AM', label: 'Ana Martins', value: 'ana' },
  { fallback: 'GM', label: 'Gabriel Melo', value: 'gabriel' },
]

const closeList = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

export const MultiSelectEmptyAddChipNamesItselfWithPlaceholder: Story = {
  render: () => (
    <PeopleProperty
      onValueChange={ignore}
      options={multiPeople}
      placeholder="Adicionar responsável"
      value={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar responsável',
    })
    const icon = trigger.querySelector('svg')

    await expect(trigger.textContent).toBe('Adicionar responsável')
    await expect(isIcon(icon, UserPlusIcon)).toBe(true)
    await expect(trigger.getAttribute('data-slot')).toBe('property-surface')
    await expect(trigger.getAttribute('data-empty')).toBe('true')
    await expect(icon?.classList.contains('size-4')).toBe(true)
    await expect(icon?.getBoundingClientRect().width).toBe(16)
    await expect(
      canvasElement
        .querySelector('[data-slot="combobox-chips"]')
        ?.classList.contains('focus-within:ring-0'),
    ).toBe(true)
  },
}

export const MultiSelectEmptyAddChipShowsAddIcon: Story = {
  render: () => (
    <TagsProperty onValueChange={ignore} options={multiOptions} value={[]} />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Adicionar tag',
    })

    await expect(trigger.textContent).toBe('Adicionar tag')
    await expect(isIcon(trigger.querySelector('svg'), TagIcon)).toBe(true)
  },
}

export const MultiSelectValuesNameRemovalAndCollapseAddChip: Story = {
  render: () => (
    <TagsProperty
      onValueChange={ignore}
      options={multiOptions}
      value={['documents']}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Remover tag Documentos' }),
    ).toBeVisible()
    const trigger = canvas.getByRole('button', { name: 'Adicionar tag' })
    await expect(trigger.textContent).toBe('')
    await expect(trigger.className).toContain('w-6')
    await expect(trigger.getBoundingClientRect().width).toBe(24)
    await expect(trigger.hasAttribute('data-empty')).toBe(false)
  },
}

export const MultiSelectReportsAddedOption: Story = {
  render: ({ action }) => (
    <TagsProperty
      action={action}
      options={multiOptions}
      value={['documents']}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Retorno' }),
    )

    await expect(args.action).toHaveBeenCalledTimes(1)
    await expect(args.action).toHaveBeenCalledWith(['documents', 'return'], {
      added: returns,
      previousValue: ['documents'],
      removed: null,
    })
    await closeList()
  },
}

export const MultiSelectReportsRemovedOption: Story = {
  render: ({ action }) => (
    <TagsProperty
      action={action}
      options={multiOptions}
      value={['documents', 'return']}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Remover tag Retorno',
      }),
    )

    await expect(args.action).toHaveBeenCalledTimes(1)
    await expect(args.action).toHaveBeenCalledWith(['documents'], {
      added: null,
      previousValue: ['documents', 'return'],
      removed: returns,
    })
  },
}

export const MultiSelectCustomTriggerReplacesChips: Story = {
  render: () => (
    <TagsProperty
      display="count"
      onValueChange={ignore}
      options={multiOptions}
      value={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('button', { name: 'Adicionar tag' }),
    ).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Tags: 0 Tags' }))

    await expect(
      await screen.findByRole('option', { name: 'Documentos' }),
    ).toBeInTheDocument()
    await closeList()
  },
}

export const MultiSelectAlignsToEndByDefault: Story = {
  render: () => (
    <div className="flex w-full justify-end">
      <TagsProperty
        className="w-auto"
        onValueChange={ignore}
        options={multiOptions}
        value={[]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )
    await screen.findByRole('option', { name: 'Documentos' })

    await expect(positionerAlign('combobox-positioner')).toBe('end')
    await closeList()
  },
}

export const MultiSelectPlacementOverridesAlign: Story = {
  render: () => (
    <TagsProperty
      dropdownPlacement={{ align: 'start' }}
      onValueChange={ignore}
      options={multiOptions}
      value={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )
    await screen.findByRole('option', { name: 'Documentos' })

    await expect(positionerAlign('combobox-positioner')).toBe('start')
    await closeList()
  },
}

export const MultiSelectLoadingAndEmptyLabels: Story = {
  render: () => (
    <TagsProperty isLoading onValueChange={ignore} options={[]} value={[]} />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar tag' }),
    )

    await expect(
      await screen.findByText('Carregando tags…'),
    ).toBeInTheDocument()
    await expect(
      screen.getByText('Nenhuma tag encontrada.'),
    ).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByText('Carregando tags…')).toBeNull(),
    )
  },
}

const externalValue: { set?: (next: readonly string[]) => void } = {}

function ExternalValue() {
  const [value, setValue] = useState<readonly string[]>([ANA])

  useEffect(() => {
    externalValue.set = setValue
    return () => {
      externalValue.set = undefined
    }
  }, [])

  return <EmailProperty onValueChange={setValue} value={value} />
}

const draftsOf = () =>
  within(screen.getByRole('dialog'))
    .getAllByRole<HTMLInputElement>('textbox')
    .map((field) => field.value)

const replaceText = async (field: HTMLElement, text: string) => {
  await userEvent.clear(field)
  if (text) await userEvent.type(field, text)
}

export const EntryListOpensWithTheValueAsDrafts: Story = {
  render: () => <EmailProperty action={ignore} value={[ANA, BIA]} />,
  play: async ({ canvasElement }) => {
    await openEntryForm(canvasElement)

    await expect(draftsOf()).toEqual([ANA, BIA])
    await closeDialog()
  },
}

export const EntryListOpensWithOneBlankDraftWhenEmpty: Story = {
  render: () => <EmailProperty action={ignore} value={[]} />,
  play: async ({ canvasElement }) => {
    const editor = await openEntryForm(canvasElement)

    await expect(draftsOf()).toEqual([''])
    await expect(editor.queryByRole('alert')).toBeNull()
    await closeDialog()
  },
}

export const EntryListReopeningDiscardsTyping: Story = {
  render: () => <EmailProperty action={ignore} value={[ANA]} />,
  play: async ({ canvasElement }) => {
    const editor = await openEntryForm(canvasElement)
    await replaceText(
      editor.getByRole('textbox', { name: 'Principal' }),
      'xyz@example.com',
    )
    await closeDialog()

    await openEntryForm(canvasElement)

    await expect(draftsOf()).toEqual([ANA])
    await closeDialog()
  },
}

export const EntryListNewValueWhileOpenKeepsDrafts: Story = {
  render: () => <ExternalValue />,
  play: async ({ canvasElement }) => {
    const editor = await openEntryForm(canvasElement)
    await replaceText(
      editor.getByRole('textbox', { name: 'Principal' }),
      'typing@example.com',
    )

    externalValue.set?.([BIA])

    await expect(await within(canvasElement).findByText(BIA)).toBeVisible()
    await expect(draftsOf()).toEqual(['typing@example.com'])
    await closeDialog()
  },
}

export const EntryListEditingADraftClearsOnlyItsError: Story = {
  render: ({ action }) => <EmailProperty action={action} value={[ANA, BIA]} />,
  play: async ({ args, canvasElement }) => {
    const editor = await openEntryForm(canvasElement)
    const first = editor.getByRole('textbox', { name: 'Principal' })
    const second = editor.getByRole('textbox', { name: 'Secundário' })

    await replaceText(first, 'ab')
    await replaceText(second, 'cd')
    await userEvent.click(editor.getByRole('button', { name: 'Salvar' }))

    await expect(
      editor.getAllByRole('alert').map((alert) => alert.textContent),
    ).toEqual([INVALID, INVALID])

    await userEvent.type(first, 'c@example.com')

    await expect(
      editor.getAllByRole('alert').map((alert) => alert.textContent),
    ).toEqual([INVALID])
    await expect(first.getAttribute('aria-invalid')).toBeNull()
    await expect(second.getAttribute('aria-invalid')).toBe('true')
    await expect(args.action).not.toHaveBeenCalled()
    await closeDialog()
  },
}

export const EntryListAddsAndRemovesDrafts: Story = {
  render: () => <EmailProperty action={ignore} value={[ANA]} />,
  play: async ({ canvasElement }) => {
    const editor = await openEntryForm(canvasElement)

    await userEvent.click(
      editor.getByRole('button', { name: 'Adicionar outro' }),
    )
    await expect(draftsOf()).toEqual([ANA, ''])

    await userEvent.click(
      editor.getByRole('button', { name: 'Remover Principal e-mail' }),
    )

    await expect(draftsOf()).toEqual([''])
    await closeDialog()
  },
}

export const EntryListAddAnotherOnlyWhileValidAndUnderLimit: Story = {
  render: () => <EmailProperty action={ignore} value={[ANA]} />,
  play: async ({ canvasElement }) => {
    const editor = await openEntryForm(canvasElement)
    const addAnother = editor.getByRole('button', { name: 'Adicionar outro' })
    const first = editor.getByRole('textbox', { name: 'Principal' })

    await expect(addAnother).toBeEnabled()

    await replaceText(first, 'ab')
    await expect(addAnother).toBeDisabled()

    await replaceText(first, ANA)
    await expect(addAnother).toBeEnabled()
    await userEvent.click(addAnother)

    await expect(draftsOf()).toHaveLength(2)
    await userEvent.type(
      editor.getByRole('textbox', { name: 'Secundário' }),
      BIA,
    )
    await expect(addAnother).toBeDisabled()
    await closeDialog()
  },
}

export const EntryListSavesParsedDraftsWithTheDiff: Story = {
  render: ({ action }) => (
    <EmailProperty
      action={action}
      entryLabels={['Principal', 'Secundário', 'Terciário']}
      value={[ANA, BIA]}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const editor = await openEntryForm(canvasElement)

    await userEvent.click(
      editor.getByRole('button', { name: 'Adicionar outro' }),
    )
    await userEvent.type(
      editor.getByRole('textbox', { name: 'Terciário' }),
      CAIO,
    )
    await replaceText(
      editor.getByRole('textbox', { name: 'Principal' }),
      `  ${ANA}  `,
    )
    await replaceText(editor.getByRole('textbox', { name: 'Secundário' }), '')

    await userEvent.click(editor.getByRole('button', { name: 'Salvar' }))

    await expect(args.action).toHaveBeenCalledTimes(1)
    await expect(args.action).toHaveBeenCalledWith([ANA, CAIO], {
      added: CAIO,
      previousValue: [ANA, BIA],
      removed: BIA,
    })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const EntryListInvalidDraftKeepsThePopupOpen: Story = {
  render: ({ action }) => <EmailProperty action={action} value={[]} />,
  play: async ({ args, canvasElement }) => {
    const editor = await openEntryForm(canvasElement)

    await userEvent.type(
      editor.getByRole('textbox', { name: 'Principal' }),
      'ab',
    )
    await userEvent.click(editor.getByRole('button', { name: 'Salvar' }))

    await expect(args.action).not.toHaveBeenCalled()
    await expect(
      editor.getAllByRole('alert').map((alert) => alert.textContent),
    ).toEqual([INVALID])
    await expect(screen.getByRole('dialog')).toBeInTheDocument()
    await closeDialog()
  },
}

export const EntryListDuplicateReportedOnTheSecondDraft: Story = {
  render: ({ action }) => <EmailProperty action={action} value={[]} />,
  play: async ({ args, canvasElement }) => {
    const editor = await openEntryForm(canvasElement)

    await userEvent.type(
      editor.getByRole('textbox', { name: 'Principal' }),
      ANA,
    )
    await userEvent.click(
      editor.getByRole('button', { name: 'Adicionar outro' }),
    )
    await userEvent.type(
      editor.getByRole('textbox', { name: 'Secundário' }),
      ANA,
    )
    await userEvent.click(editor.getByRole('button', { name: 'Salvar' }))

    await expect(args.action).not.toHaveBeenCalled()
    await expect(
      editor.getAllByRole('alert').map((alert) => alert.textContent),
    ).toEqual(['Este e-mail já está na lista.'])
    await expect(
      editor
        .getByRole('textbox', { name: 'Principal' })
        .getAttribute('aria-invalid'),
    ).toBeNull()
    await expect(
      editor
        .getByRole('textbox', { name: 'Secundário' })
        .getAttribute('aria-invalid'),
    ).toBe('true')
    await closeDialog()
  },
}
