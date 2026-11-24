import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Editable,
  EditableArea,
  EditableCancel,
  EditableField,
  EditableInput,
  EditableLabel,
  EditablePreview,
  EditableSubmit,
  EditableToolbar,
  EditableTrigger,
} from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { EditableCanvas } from './editable-canvas.tsx'

const meta = {
  component: Editable,
  decorators: [EditableCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Editable/API Reference',
} satisfies Meta<typeof Editable>

export default meta

type Story = StoryObj<typeof meta>

const expectSlots = async (canvasElement: HTMLElement, slots: string[]) => {
  for (const slot of slots) {
    await expect(
      canvasElement.querySelector(`[data-slot="${slot}"]`),
    ).not.toBeNull()
  }
}

export const Anatomy: Story = {
  render: (args) => (
    <Editable {...args} defaultValue="EditablePreview">
      <EditableLabel>
        <Slot name="EditableLabel" />
      </EditableLabel>
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
      <EditableTrigger>
        <Slot name="EditableTrigger" />
      </EditableTrigger>
      <EditableToolbar>
        <EditableSubmit>EditableSubmit</EditableSubmit>
        <EditableCancel>EditableCancel</EditableCancel>
      </EditableToolbar>
    </Editable>
  ),
  play: async ({ canvasElement }) => {
    await expectSlots(canvasElement, [
      'editable',
      'editable-label',
      'editable-area',
      'editable-preview',
      'editable-trigger',
    ])
  },
}

export const EditingAnatomy: Story = {
  render: (args) => (
    <Editable {...args} defaultEditing defaultValue="EditableInput">
      <EditableLabel>
        <Slot name="EditableLabel" />
      </EditableLabel>
      <EditableArea>
        <EditablePreview />
        <EditableInput readOnly />
      </EditableArea>
      <EditableTrigger>
        <Slot name="EditableTrigger" />
      </EditableTrigger>
      <EditableToolbar>
        <EditableSubmit>EditableSubmit</EditableSubmit>
        <EditableCancel>EditableCancel</EditableCancel>
      </EditableToolbar>
    </Editable>
  ),
  play: async ({ canvasElement }) => {
    await expectSlots(canvasElement, [
      'editable',
      'editable-label',
      'editable-area',
      'editable-input',
      'editable-toolbar',
      'editable-submit',
      'editable-cancel',
    ])
  },
}

export const FieldAnatomy: Story = {
  render: (args) => (
    <Editable {...args} defaultValue="EditableField">
      <EditableLabel>
        <Slot name="EditableLabel" />
      </EditableLabel>
      <EditableField />
    </Editable>
  ),
  play: async ({ canvasElement }) => {
    await expectSlots(canvasElement, [
      'editable',
      'editable-label',
      'editable-field',
    ])
  },
}
