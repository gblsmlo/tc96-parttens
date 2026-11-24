import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupFilter } from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const filterOptions = [
  { label: 'Tarefas', value: 'task' },
  { label: 'Prazos', value: 'deadline' },
  { label: 'Eventos', value: 'event' },
]

const sortOptions = [
  { label: 'Mais próximo', value: 'asc' },
  { label: 'Mais distante', value: 'desc' },
]

const onFilterChange = fn()
const onSortChange = fn()

function ControlledFilter() {
  const [filterValue, setFilterValue] = useState(['task', 'event'])
  const [sortValue, setSortValue] = useState('asc')

  return (
    <RecordGroupFilter
      filterLabel="Tipo"
      filterOptions={filterOptions}
      filterValue={filterValue}
      label="Filtrar"
      onFilterChange={(next) => {
        onFilterChange(next)
        setFilterValue(next)
      }}
      onSortChange={(next) => {
        onSortChange(next)
        setSortValue(next)
      }}
      sortLabel="Ordenar por"
      sortOptions={sortOptions}
      sortValue={sortValue}
    />
  )
}

const openPopup = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Filtrar' }),
  )
  const menu = await screen.findByRole('menu')
  await waitFor(() => expect(menu).toBeVisible())
  return within(menu)
}

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Behavior',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const FilterTriggerNamedByLabelOnly: Story = {
  render: () => <RecordGroupFilter label="Filtrar" />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Filtrar',
    })

    await expect(trigger.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}

export const FilterSectionsOnlyWhenOptionsArePassed: Story = {
  render: () => (
    <RecordGroupFilter
      label="Filtrar"
      sortLabel="Ordenar por"
      sortOptions={sortOptions}
      sortValue="asc"
    />
  ),
  play: async ({ canvasElement }) => {
    const popup = await openPopup(canvasElement)

    await expect(screen.getByRole('menu', { name: 'Filtrar' })).toBeVisible()
    await expect(popup.queryAllByRole('menuitemcheckbox')).toHaveLength(0)
    await expect(
      popup.getByRole('group', { name: 'Ordenar por' }),
    ).toBeVisible()
    await expect(popup.getAllByRole('menuitemradio')).toHaveLength(2)
    await userEvent.keyboard('{Escape}')
  },
}

export const FilterReportsValuesInOptionOrder: Story = {
  render: () => <ControlledFilter />,
  play: async ({ canvasElement }) => {
    const popup = await openPopup(canvasElement)

    await expect(popup.getByRole('group', { name: 'Tipo' })).toBeVisible()
    await expect(
      popup.getByRole('menuitemcheckbox', { name: 'Tarefas' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      popup.getByRole('menuitemcheckbox', { name: 'Prazos' }),
    ).toHaveAttribute('aria-checked', 'false')

    onFilterChange.mockClear()
    await userEvent.click(
      popup.getByRole('menuitemcheckbox', { name: 'Prazos' }),
    )
    await expect(onFilterChange).toHaveBeenLastCalledWith([
      'task',
      'deadline',
      'event',
    ])
    await expect(screen.getByRole('menu')).toBeVisible()
    await userEvent.click(
      popup.getByRole('menuitemcheckbox', { name: 'Tarefas' }),
    )
    await expect(onFilterChange).toHaveBeenLastCalledWith(['deadline', 'event'])

    onSortChange.mockClear()
    await userEvent.click(
      popup.getByRole('menuitemradio', { name: 'Mais distante' }),
    )
    await expect(onSortChange).toHaveBeenCalledWith('desc')
    await expect(
      popup.getByRole('menuitemradio', { name: 'Mais distante' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(screen.getByRole('menu')).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(
      within(canvasElement).getByRole('button', { name: 'Filtrar' }),
    ).toHaveFocus()
  },
}

function TwoSectionsFilter() {
  const [modalities, setModalities] = useState(['video', 'phone'])
  const [periods, setPeriods] = useState(['upcoming'])

  return (
    <RecordGroupFilter
      label="Filtrar"
      sections={[
        {
          label: 'Modalidade',
          onChange: (next) => {
            onFilterChange(next)
            setModalities(next)
          },
          options: [
            { label: 'Vídeo', value: 'video' },
            { label: 'Telefone', value: 'phone' },
          ],
          value: modalities,
        },
        {
          label: 'Período',
          onChange: setPeriods,
          options: [
            { label: 'Próximos', value: 'upcoming' },
            { label: 'Passados', value: 'past' },
          ],
          value: periods,
        },
      ]}
    />
  )
}

export const FilterOneGroupPerSection: Story = {
  render: () => <TwoSectionsFilter />,
  play: async ({ canvasElement }) => {
    const popup = await openPopup(canvasElement)
    const modality = within(popup.getByRole('group', { name: 'Modalidade' }))
    const period = within(popup.getByRole('group', { name: 'Período' }))

    await expect(popup.getAllByRole('group')).toHaveLength(2)
    await expect(modality.getAllByRole('menuitemcheckbox')).toHaveLength(2)
    await expect(
      period.getByRole('menuitemcheckbox', { name: 'Passados' }),
    ).toHaveAttribute('aria-checked', 'false')

    onFilterChange.mockClear()
    await userEvent.click(
      modality.getByRole('menuitemcheckbox', { name: 'Vídeo' }),
    )
    await expect(onFilterChange).toHaveBeenLastCalledWith(['phone'])
    await userEvent.click(
      period.getByRole('menuitemcheckbox', { name: 'Passados' }),
    )
    await expect(
      period.getByRole('menuitemcheckbox', { name: 'Passados' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      modality.getByRole('menuitemcheckbox', { name: 'Telefone' }),
    ).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('{Escape}')
  },
}
