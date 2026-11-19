import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupFilter } from '@tc96/parttens'
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
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => expect(dialog).toBeVisible())
  return within(dialog)
}

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Filter',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TriggerNamedByLabelOnly: Story = {
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

export const SectionsOnlyWhenOptionsArePassed: Story = {
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

    await expect(screen.getByRole('dialog', { name: 'Filtrar' })).toBeVisible()
    await expect(popup.queryByRole('group')).toBeNull()
    await expect(popup.queryAllByRole('checkbox')).toHaveLength(0)
    await expect(
      popup.getByRole('radiogroup', { name: 'Ordenar por' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
  },
}

export const ReportsValuesInOptionOrder: Story = {
  render: () => <ControlledFilter />,
  play: async ({ canvasElement }) => {
    const popup = await openPopup(canvasElement)

    await expect(popup.getByRole('group', { name: 'Tipo' })).toBeVisible()
    await expect(popup.getByRole('checkbox', { name: 'Tarefas' })).toBeChecked()
    await expect(
      popup.getByRole('checkbox', { name: 'Prazos' }),
    ).not.toBeChecked()

    onFilterChange.mockClear()
    await userEvent.click(popup.getByRole('checkbox', { name: 'Prazos' }))
    await expect(onFilterChange).toHaveBeenLastCalledWith([
      'task',
      'deadline',
      'event',
    ])
    await userEvent.click(popup.getByRole('checkbox', { name: 'Tarefas' }))
    await expect(onFilterChange).toHaveBeenLastCalledWith(['deadline', 'event'])

    onSortChange.mockClear()
    await userEvent.click(popup.getByRole('radio', { name: 'Mais distante' }))
    await expect(onSortChange).toHaveBeenCalledWith('desc')
    await expect(
      popup.getByRole('radio', { name: 'Mais distante' }),
    ).toBeChecked()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
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

export const OneFieldsetPerSection: Story = {
  render: () => <TwoSectionsFilter />,
  play: async ({ canvasElement }) => {
    const popup = await openPopup(canvasElement)
    const modality = within(popup.getByRole('group', { name: 'Modalidade' }))
    const period = within(popup.getByRole('group', { name: 'Período' }))

    await expect(popup.getAllByRole('group')).toHaveLength(2)
    await expect(modality.getAllByRole('checkbox')).toHaveLength(2)
    await expect(
      period.getByRole('checkbox', { name: 'Passados' }),
    ).not.toBeChecked()

    onFilterChange.mockClear()
    await userEvent.click(modality.getByRole('checkbox', { name: 'Vídeo' }))
    await expect(onFilterChange).toHaveBeenLastCalledWith(['phone'])
    await userEvent.click(period.getByRole('checkbox', { name: 'Passados' }))
    await expect(
      period.getByRole('checkbox', { name: 'Passados' }),
    ).toBeChecked()
    await expect(
      modality.getByRole('checkbox', { name: 'Telefone' }),
    ).toBeChecked()
    await userEvent.keyboard('{Escape}')
  },
}
