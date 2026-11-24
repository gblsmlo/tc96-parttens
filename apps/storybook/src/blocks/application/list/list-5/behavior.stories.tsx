import type { Meta, StoryObj } from '@storybook/react-vite'
import { List5 } from '@tc96/blocks/application/list/list-5'
import { expect, fn, userEvent, within } from 'storybook/test'
import { modules } from '../fixtures/list-5.ts'
import { type List5Controls, list5ControlArgs } from './list-5-controls.ts'
import { ComposedList5 } from './list-5-layouts.tsx'

const meta = {
  args: list5ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List5/Behavior',
} satisfies Meta<List5Controls>

export default meta

type Story = StoryObj<typeof meta>

export const EachRowShowsNameAndDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
    await expect(canvas.getByText('Relatórios')).toBeVisible()
    await expect(
      canvas.getByText('Organize equipes, cargos e permissões.'),
    ).toBeVisible()
  },
}

const onAdd = fn()

export const AddCallsOnAddWithTheId: Story = {
  render: () => <List5 modules={modules} onAdd={onAdd} />,
  play: async ({ canvasElement }) => {
    onAdd.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Adicionar Relatórios',
      }),
    )
    await expect(onAdd).toHaveBeenCalledWith('reports')
  },
}

export const EveryAddButtonIsNamedByItsModule: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getAllByRole('button', { name: /^Adicionar / }),
    ).toHaveLength(4)
  },
}

export const WithoutOnAddNoAddButtonRenders: Story = {
  args: { addable: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', {
        name: 'Adicionar Relatórios',
      }),
    ).toBeNull()
  },
}

const onBrowseMore = fn()

export const BrowseMoreCallsOnBrowseMore: Story = {
  render: () => <List5 modules={modules} onBrowseMore={onBrowseMore} />,
  play: async ({ canvasElement }) => {
    onBrowseMore.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ver mais' }),
    )
    await expect(onBrowseMore).toHaveBeenCalledTimes(1)
  },
}

export const WithoutOnBrowseMoreNoFooterRenders: Story = {
  args: { browsable: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Ver mais' }),
    ).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <List5
      labels={{
        add: (name) => `Incluir ${name}`,
        browseMore: 'Explorar',
        title: 'Módulos',
      }}
      modules={modules}
      onAdd={() => {}}
      onBrowseMore={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('list', { name: 'Módulos' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Incluir Relatórios' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Explorar' })).toBeVisible()
  },
}
