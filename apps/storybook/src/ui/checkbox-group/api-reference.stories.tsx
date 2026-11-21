import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '@tc96/ui/checkbox'
import { CheckboxGroup } from '@tc96/ui/checkbox-group'
import { Label } from '@tc96/ui/label'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: CheckboxGroup,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/CheckboxGroup/API Reference',
} satisfies Meta<typeof CheckboxGroup>

export default meta

type Story = StoryObj<typeof meta>

const captionId = 'checkbox-group-anatomy-caption'

export const Anatomy: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div id={captionId}>
        <Slot name="caption" />
      </div>
      <CheckboxGroup
        {...args}
        aria-labelledby={captionId}
        defaultValue={['first']}
      >
        <Label>
          <Checkbox value="first" />
          <Slot name="Label" />
        </Label>
        <Label>
          <Checkbox value="second" />
          <Slot name="Label" />
        </Label>
      </CheckboxGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'caption' })
    await expect(within(group).getAllByRole('checkbox')).toHaveLength(2)
    await expect(within(group).getAllByText('Label')).toHaveLength(2)
  },
}
