import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupAction } from '@tc96/parttens'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'

const add = fn()

function DisableAfterFirstClick() {
  const [disabled, setDisabled] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <RecordGroupAction
        disabled={disabled}
        icon={PlusIcon}
        label="Add property"
        onClick={add}
      />
      <button onClick={() => setDisabled(true)} type="button">
        Disable action
      </button>
    </div>
  )
}

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Action',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const NamedByTheLabelOnly: Story = {
  render: () => <RecordGroupAction icon={PlusIcon} label="Add property" />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Add property',
    })

    await expect(button).toHaveAttribute('aria-label', 'Add property')
    await expect(button.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    await expect(button.textContent).toBe('')
  },
}

export const ClicksUnlessDisabled: Story = {
  render: () => <DisableAfterFirstClick />,
  play: async ({ canvasElement }) => {
    add.mockClear()
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Add property' })

    await userEvent.click(button)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Disable action' }),
    )
    fireEvent.click(canvas.getByRole('button', { name: 'Add property' }))

    await expect(add).toHaveBeenCalledTimes(1)
  },
}
