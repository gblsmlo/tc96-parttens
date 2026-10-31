import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ActionBar,
  type ActionBarGroup,
  type ActionBarProps,
} from '@tc96/parttens'
import { ArchiveIcon, SendIcon, Trash2Icon } from 'lucide-react'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'

const usage = `
import { ActionBar } from '@/components/patterns'

<ActionBar
  actions={[
    { items: [{ label: 'Arquivar', onSelect: archive }] },
    {
      items: [
        {
          label: 'Mais opções',
          submenu: [{ items: [{ label: 'Excluir', onSelect: remove, variant: 'destructive' }] }],
        },
      ],
    },
  ]}
  onClearSelection={clearSelection}
  selectedCount={selectedRows.length}
  selectedRows={selectedRows}
/>
`

const docs = {
  api: [
    {
      description:
        'A `role="toolbar"` that renders nothing while `selectedCount` is below 1. It shows the count as "N selecionado(s)", each group of `actions` with a divider between groups, and a clear button only when `onClearSelection` is set. Each `onSelect` receives `{ selectedCount, selectedRows }`.',
      name: 'ActionBar',
    },
    {
      description:
        'An action: `label`, optional `icon`, `shortcut`, `disabled` and `variant` (`default`, `primary`, `destructive`). With `submenu`, it opens its groups in a popover above the bar instead of calling `onSelect`.',
      name: 'ActionBarItem',
    },
    {
      description:
        'A group of items with an optional `label`, used both in `actions` and inside a `submenu`.',
      name: 'ActionBarGroup',
    },
  ],
  description: {
    component:
      'ActionBar contextual para rows selecionadas. Os grupos recebem dividers automaticamente e um item pode abrir suas opções em um popover acima da barra.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

type StoryArgs = ActionBarProps & { groupLabel: boolean }

const archive = fn()
const duplicate = fn()

function withoutGroupLabels(groups: ActionBarGroup[]): ActionBarGroup[] {
  return groups.map(({ label: _label, items, ...group }) => ({
    ...group,
    items: items.map((item) =>
      item.submenu
        ? { ...item, submenu: withoutGroupLabels(item.submenu) }
        : item,
    ),
  }))
}

const meta = {
  title: 'Patterns/ActionBar',
  component: ActionBar,
  parameters: {
    layout: 'centered',
    docs,
  },
  argTypes: {
    actions: { control: false },
    groupLabel: {
      control: 'boolean',
      description: 'Shows the `label` of the groups inside a submenu.',
    },
    onClearSelection: { control: false },
  },
  render: ({ actions, groupLabel, ...args }) => (
    <ActionBar
      {...args}
      actions={groupLabel ? actions : withoutGroupLabels(actions)}
    />
  ),
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    actions: [
      {
        items: [
          {
            icon: <SendIcon />,
            label: 'Enviar',
            onSelect: fn(),
            variant: 'primary',
          },
          {
            icon: <ArchiveIcon />,
            label: 'Arquivar',
            onSelect: archive,
          },
        ],
      },
      {
        items: [
          {
            label: 'Mais opções',
            submenu: [
              {
                label: 'Organizar',
                items: [
                  { label: 'Duplicar', onSelect: duplicate },
                  { label: 'Mover para…', onSelect: fn() },
                ],
              },
              {
                items: [
                  {
                    icon: <Trash2Icon />,
                    label: 'Excluir',
                    onSelect: fn(),
                    variant: 'destructive',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    groupLabel: false,
    onClearSelection: fn(),
    selectedCount: 1,
    selectedRows: [{ id: 'row-1' }],
  },
  play: async ({ canvasElement }) => {
    archive.mockClear()
    duplicate.mockClear()
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('toolbar', { name: 'Ações dos itens selecionados' }),
    ).toBeVisible()
    await expect(canvas.getByRole('separator')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Arquivar' }))
    await expect(archive).toHaveBeenCalledTimes(1)

    await userEvent.click(canvas.getByRole('button', { name: 'Mais opções' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' }),
    )
    await expect(duplicate).toHaveBeenCalledTimes(1)
  },
}

export const MultipleRows: Story = {
  args: {
    ...Default.args,
    selectedCount: 4,
  },
}

export const NoSelection: Story = {
  args: {
    ...Default.args,
    selectedCount: 0,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('toolbar')).toBeNull()
  },
}
