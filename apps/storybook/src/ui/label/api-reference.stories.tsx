import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@tc96/ui/input'
import { Label } from '@tc96/ui/label'
import { useId } from 'react'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { LabelCanvas } from './label-frame.tsx'

const meta = {
  component: Label,
  decorators: [LabelCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Label/API Reference',
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

const AnatomyLabel = (props: Readonly<Story['args']>) => {
  const id = useId()
  return (
    <div className="flex flex-col items-start gap-2">
      <Label {...props} htmlFor={id}>
        <Slot name="Label" />
      </Label>
      <Input id={id} placeholder="Control" type="text" />
    </div>
  )
}

export const Anatomy: Story = {
  render: (args) => <AnatomyLabel {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Label')).toBeVisible()
    await expect(canvas.getByRole('textbox')).toHaveAccessibleName('Label')
  },
}
