import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArchiveIcon, SendIcon, Trash2Icon } from 'lucide-react'
import { fn } from 'storybook/test'
import { ActionBar } from 'tc96/blocks'

const meta = {
  title: 'Patterns/ActionBar',
  component: ActionBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ActionBar contextual para rows selecionadas. Os grupos recebem dividers automaticamente e um item pode abrir suas opções em um popover acima da barra.',
      },
    },
  },
  argTypes: {
    actions: { control: false },
    onClearSelection: { control: false },
  },
} satisfies Meta<typeof ActionBar>

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
            onSelect: fn(),
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
                  { label: 'Duplicar', onSelect: fn() },
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
    onClearSelection: fn(),
    selectedCount: 1,
    selectedRows: [{ id: 'row-1' }],
  },
}

export const MultipleRows: Story = {
  args: {
    ...Default.args,
    selectedCount: 4,
  },
}
