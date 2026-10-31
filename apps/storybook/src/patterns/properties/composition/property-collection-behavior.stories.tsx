import type { Meta, StoryObj } from '@storybook/react-vite'
import { PropertyCollection, type PropertyCollectionItem } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const items: readonly PropertyCollectionItem[] = [
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

const openMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', {
      name: 'Ajustar propriedades',
    }),
  )
  return within(await screen.findByRole('menu'))
}

const closeMenu = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const meta = {
  args: { ariaLabel: 'Propriedades da Task', items },
  component: PropertyCollection,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Groups/Behavior',
} satisfies Meta<typeof PropertyCollection>

export default meta

type Story = StoryObj<typeof meta>

export const DefaultVisibleInCatalogOrder: Story = {
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Propriedades da Task',
    })

    await expect(group.textContent).toContain('Em progresso')
    await expect(group.textContent).toContain('Definir responsável')
    await expect(group.textContent).not.toContain('Adicionar etiqueta')
  },
}

export const ContainerDefaultVisibleWins: Story = {
  args: { defaultVisible: ['tags'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Em progresso')).toBeNull()
    await expect(canvas.getByText('Adicionar etiqueta')).toBeVisible()
  },
}

export const ReadOnlyHidesTrigger: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', {
        name: 'Ajustar propriedades',
      }),
    ).toBeNull()
  },
}

export const MenuListsCatalogWithVisibleChecked: Story = {
  play: async ({ canvasElement }) => {
    const menu = await openMenu(canvasElement)
    const options = menu.getAllByRole('menuitemcheckbox')

    await expect(options.map((option) => option.textContent)).toEqual([
      'Status',
      'Responsável',
      'Etiquetas',
    ])
    await expect(
      options.map((option) => option.getAttribute('aria-checked')),
    ).toEqual(['true', 'true', 'false'])
    await closeMenu()
  },
}

export const ToggleReportsCatalogOrder: Story = {
  args: { onVisibleChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const menu = await openMenu(canvasElement)

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
    await closeMenu()
  },
}

export const ControlledVisibilityIgnoresInternalState: Story = {
  args: { visible: ['tags'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Adicionar etiqueta')).toBeVisible()
    await expect(canvas.queryByText('Em progresso')).toBeNull()

    const menu = await openMenu(canvasElement)
    await userEvent.click(
      menu.getByRole('menuitemcheckbox', { name: 'Status' }),
    )

    await expect(canvas.queryByText('Em progresso')).toBeNull()
    await closeMenu()
  },
}
