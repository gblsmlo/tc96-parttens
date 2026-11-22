import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectProperty, type SelectPropertyOption } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { CircleIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  esperarIndicadorADireita,
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { SelectCanvas } from './select-canvas.tsx'
import { activityOptions, groupActivities } from './select-data.ts'
import { StatefulSelect } from './select-layouts.tsx'

const options: SelectPropertyOption[] = [
  { label: 'Reunião', value: 'meeting' },
  { label: 'Ligação', value: 'call' },
  { label: 'Outro', value: 'other' },
]

const meta = {
  args: { ariaLabel: 'Tipo', options, value: 'call' },
  component: SelectProperty,
  decorators: [SelectCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Select/Behavior',
} satisfies Meta<typeof SelectProperty>

export default meta

type Story = StoryObj<typeof meta>

const surface = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="property-surface"]')

const closed = (trigger: HTMLElement) =>
  waitFor(() => {
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

const choose = async (trigger: HTMLElement, name: string) => {
  await userEvent.click(trigger)
  await userEvent.click(await screen.findByRole('option', { name }))
  await closed(trigger)
}

const closeList = async (trigger: HTMLElement) => {
  await userEvent.keyboard('{Escape}')
  await closed(trigger)
}

export const BadgeSurfaceIsFilled: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const PlainSurfaceHasNoFill: Story = {
  args: { readOnly: true, variant: 'plain' },
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
    await expect(canvasElement).toHaveTextContent('Ligação')
  },
}

export const WithoutHandlerIsNamedImage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('img', { name: 'Tipo: Ligação' }),
    ).toHaveAttribute('data-slot', 'property-surface')
    await expect(canvas.queryByRole('combobox')).toBeNull()
  },
}

export const ReadOnlyWinsOverHandler: Story = {
  args: { onValueChange: fn(), readOnly: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('img', { name: 'Tipo: Ligação' }),
    ).toBeInTheDocument()
    await expect(canvas.queryByRole('combobox')).toBeNull()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ActionAloneMakesItEditable: Story = {
  args: { action: fn() },
  play: async ({ args, canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Tipo: Ligação' }),
    ).toHaveAttribute('data-slot', 'property-surface')
    await expect(args.action).not.toHaveBeenCalled()
  },
}

export const ActionGetsChoiceAndPreviousValue: Story = {
  args: { action: fn(), onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await choose(
      within(canvasElement).getByRole('combobox', { name: 'Tipo: Ligação' }),
      'Outro',
    )

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith('other', {
      previousValue: 'call',
    })
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const PickingCurrentValueEmitsNothing: Story = {
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await choose(
      within(canvasElement).getByRole('combobox', { name: 'Tipo: Ligação' }),
      'Ligação',
    )

    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const KeyboardOpensListAndPicks: Story = {
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Tipo: Ligação',
    })

    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await screen.findByRole('listbox')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
    await closed(trigger)

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith('other')
  },
}

export const SelectedOptionCheckOnTheRight: Story = {
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Tipo: Ligação',
    })
    await userEvent.click(trigger)
    const option = await screen.findByRole('option', { name: 'Ligação' })
    await waitFor(() => expect(option).toBeVisible())

    await esperarIndicadorADireita(option)

    await closeList(trigger)
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const OptionIconIsPropertyIcon: Story = {
  args: {
    options: [{ icon: CircleIcon, label: 'Ligação', value: 'call' }],
    readOnly: true,
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('svg')?.getAttribute('data-slot'),
    ).toBe('property-icon')
  },
}

export const EmptyNamesPropertyAndIsMuted: Story = {
  args: { placeholder: 'Sem tipo', value: null },
  play: async ({ canvasElement }) => {
    await expect(surface(canvasElement)).toHaveAttribute('aria-label', 'Tipo')
    await expect(surface(canvasElement)).toHaveAttribute('data-empty', 'true')
    await expect(canvasElement).toHaveTextContent('Sem tipo')
  },
}

export const FallbackOutsideCatalog: Story = {
  args: { fallback: 'Não informado', value: 'desconhecido' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent('Não informado')
    await expect(surface(canvasElement)).toHaveAttribute(
      'aria-label',
      'Tipo: Não informado',
    )
    await expect(surface(canvasElement)).not.toHaveAttribute('data-empty')
  },
}

export const DisabledTriggerCannotOpen: Story = {
  args: { disabled: true, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Tipo: Ligação',
    })

    await expect(trigger).toBeDisabled()
    await expect(screen.queryByRole('listbox')).toBeNull()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const GroupsNameTheirSections: Story = {
  args: {
    emptyOptionLabel: 'Sem tipo',
    groups: groupActivities(activityOptions),
    onValueChange: fn(),
    options: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Tipo: Ligação',
    })
    await userEvent.click(trigger)
    const remote = await screen.findByRole('group', { name: 'Remoto' })

    await expect(
      within(remote)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['Ligação', 'E-mail'])
    await expect(
      screen.getByRole('option', { name: 'Sem tipo' }).closest('[role=group]'),
    ).toBeNull()

    await closeList(trigger)
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const EmptyOptionReportsNull: Story = {
  args: { action: fn(), emptyOptionLabel: 'Sem tipo' },
  play: async ({ args, canvasElement }) => {
    await choose(
      within(canvasElement).getByRole('combobox', { name: 'Tipo: Ligação' }),
      'Sem tipo',
    )

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith(null, {
      previousValue: 'call',
    })
  },
}

export const EmptyOptionHasNoIconWhenCatalogHasNone: Story = {
  render: () => (
    <StatefulSelect
      ariaLabel="Frequência"
      emptyOptionLabel="Não repete"
      initialValue="daily"
      options={[{ label: 'Diariamente', value: 'daily' }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Frequência: Diariamente',
    })
    await userEvent.click(trigger)
    const empty = await screen.findByRole('option', { name: 'Não repete' })

    await expect(empty.querySelector('[data-slot="property-icon"]')).toBeNull()
    await userEvent.click(empty)
    await closed(trigger)

    await expect(trigger).toHaveAccessibleName('Frequência: Não repete')
    await expect(trigger.querySelector('svg')).toBeNull()
  },
}

export const EmptyOptionShowsDashedIconWhenCatalogHasIcons: Story = {
  render: () => (
    <StatefulSelect
      ariaLabel="Tipo"
      emptyOptionLabel="Sem tipo"
      initialValue="call"
      options={activityOptions}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Tipo: Ligação',
    })

    await choose(trigger, 'Sem tipo')

    await expect(trigger).toHaveAccessibleName('Tipo: Sem tipo')
    await expect(
      trigger.querySelector('[data-slot="property-icon"]'),
    ).toHaveClass('lucide-circle-dashed')
  },
}

export const FilledAfterPickingEmptyOverNull: Story = {
  args: {
    ariaLabel: 'Prioridade',
    emptyOptionLabel: 'Sem prioridade',
    onValueChange: fn(),
    placeholder: 'Prioridade',
    value: null,
  },
  play: async ({ args, canvasElement }) => {
    await expect(surface(canvasElement)).toHaveAttribute('data-empty', 'true')

    await choose(
      within(canvasElement).getByRole('combobox', { name: 'Prioridade' }),
      'Sem prioridade',
    )

    await waitFor(() =>
      expect(surface(canvasElement)).not.toHaveAttribute('data-empty'),
    )
    await expect(surface(canvasElement)).toHaveAttribute(
      'aria-label',
      'Prioridade: Sem prioridade',
    )
    await expect(canvasElement).toHaveTextContent('Sem prioridade')
    await expect(surface(canvasElement)?.querySelector('svg')).toBeNull()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const FilledAfterMovingFromValueToEmpty: Story = {
  render: () => (
    <StatefulSelect
      ariaLabel="Prioridade"
      emptyOptionLabel="Sem prioridade"
      initialValue="call"
      options={options}
      placeholder="Prioridade"
    />
  ),
  play: async ({ canvasElement }) => {
    await choose(
      within(canvasElement).getByRole('combobox', {
        name: 'Prioridade: Ligação',
      }),
      'Sem prioridade',
    )

    await waitFor(() =>
      expect(surface(canvasElement)).toHaveAttribute(
        'aria-label',
        'Prioridade: Sem prioridade',
      ),
    )
    await expect(surface(canvasElement)).not.toHaveAttribute('data-empty')
  },
}

function ValueFromOutside() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-2">
      <SelectProperty
        ariaLabel="Prioridade"
        emptyOptionLabel="Sem prioridade"
        onValueChange={() => undefined}
        options={options}
        placeholder="Prioridade"
        value={value}
      />
      <Button onClick={() => setValue('call')} variant="outline">
        Receber Ligação
      </Button>
      <Button onClick={() => setValue(null)} variant="outline">
        Receber vazio
      </Button>
    </div>
  )
}

export const AbsentAgainWhenNullReturnsFromOutside: Story = {
  render: () => <ValueFromOutside />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await choose(
      canvas.getByRole('combobox', { name: 'Prioridade' }),
      'Sem prioridade',
    )
    await waitFor(() =>
      expect(surface(canvasElement)).not.toHaveAttribute('data-empty'),
    )

    await userEvent.click(
      canvas.getByRole('button', { name: 'Receber Ligação' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Receber vazio' }))

    await expect(surface(canvasElement)).toHaveAttribute('data-empty', 'true')
    await expect(surface(canvasElement)).toHaveAttribute(
      'aria-label',
      'Prioridade',
    )
  },
}
