import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionSearchField,
  type CollectionSearchFieldProps,
  CollectionToolbar,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

const commit = fn()

function ExternalValue() {
  const [value, setValue] = useState('ana')

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => setValue('bruno')}>
        Voltar para a busca salva
      </Button>
      <CollectionToolbar
        startSlot={
          <CollectionSearchField
            label="Buscar contatos"
            onCommit={(next) => {
              commit(next)
              setValue(next)
            }}
            value={value}
          />
        }
      />
    </div>
  )
}

const meta = {
  args: {
    label: 'Buscar contatos',
    onCommit: commit,
    placeholder: 'Buscar contatos',
  },
  parameters: { layout: 'padded' },
  render: (args: CollectionSearchFieldProps) => (
    <CollectionToolbar startSlot={<CollectionSearchField {...args} />} />
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Shared/Search Field',
} satisfies Meta<CollectionSearchFieldProps>

export default meta
type Story = StoryObj<typeof meta>

export const CommitsOnSubmit: Story = {
  play: async ({ canvasElement }) => {
    commit.mockClear()
    const field = within(canvasElement).getByRole('searchbox', {
      name: 'Buscar contatos',
    })

    await userEvent.type(field, 'ana')
    await expect(commit).not.toHaveBeenCalled()

    await userEvent.keyboard('{Enter}')
    await expect(commit).toHaveBeenCalledWith('ana')
  },
}

export const EmptyingCommitsImmediately: Story = {
  args: { value: 'ana' },
  play: async ({ canvasElement }) => {
    commit.mockClear()
    const field = within(canvasElement).getByRole('searchbox', {
      name: 'Buscar contatos',
    })

    await userEvent.clear(field)
    await expect(commit).toHaveBeenCalledWith('')
  },
}

export const DraftFollowsConfirmedValue: Story = {
  parameters: { layout: 'padded' },
  render: () => <ExternalValue />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('searchbox', { name: 'Buscar contatos' })

    await expect(field).toHaveValue('ana')
    await userEvent.type(field, 'x', {
      initialSelectionEnd: 3,
      initialSelectionStart: 3,
    })
    await expect(field).toHaveValue('anax')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Voltar para a busca salva' }),
    )
    await expect(field).toHaveValue('bruno')
  },
}
