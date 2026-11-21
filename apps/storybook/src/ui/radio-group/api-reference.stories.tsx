import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '@tc96/ui/label'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/RadioGroup/API Reference',
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

const captionId = 'radio-group-anatomy-caption'

export const Anatomy: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div id={captionId}>
        <Slot name="caption" />
      </div>
      <RadioGroup {...args} aria-labelledby={captionId} defaultValue="first">
        <Label>
          <Radio value="first" />
          <Slot name="Label" />
        </Label>
        <Label>
          <Radio value="second" />
          <Slot name="Label" />
        </Label>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup', {
      name: 'caption',
    })
    await expect(group).toHaveAttribute('data-slot', 'radio-group')
    const radios = within(group).getAllByRole('radio')
    await expect(radios).toHaveLength(2)
    await expect(radios[0]).toHaveAttribute('data-slot', 'radio')
    await expect(
      radios[0]?.querySelector('[data-slot="radio-indicator"]'),
    ).not.toBeNull()
    await expect(within(group).getAllByText('Label')).toHaveLength(2)
  },
}
