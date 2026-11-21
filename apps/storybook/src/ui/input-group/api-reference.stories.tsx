import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@tc96/ui/input-group'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { InputGroupAnatomyCanvas } from './input-group-frame.tsx'

const meta = {
  component: InputGroup,
  decorators: [InputGroupAnatomyCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/InputGroup/API Reference',
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput
        aria-label="InputGroupInput"
        placeholder="InputGroupInput"
      />
      <InputGroupAddon>
        <InputGroupText>
          <Slot name="InputGroupText" />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Slot name="InputGroupAddon" />
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const part of ['InputGroupText', 'InputGroupAddon']) {
      await expect(canvas.getByText(part)).toBeVisible()
    }
    await expect(
      canvas.getByRole('textbox', { name: 'InputGroupInput' }),
    ).toBeVisible()
  },
}

export const TextareaAnatomy: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupTextarea
        aria-label="InputGroupTextarea"
        placeholder="InputGroupTextarea"
      />
      <InputGroupAddon align="block-end">
        <InputGroupText>
          <Slot name="InputGroupText" />
        </InputGroupText>
        <span className="ml-auto">
          <Slot name="InputGroupAddon" />
        </span>
      </InputGroupAddon>
    </InputGroup>
  ),
}
