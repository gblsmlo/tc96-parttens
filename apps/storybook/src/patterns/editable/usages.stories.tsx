import type { Meta, StoryObj } from '@storybook/react-vite'
import {
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
import { expect, within } from 'storybook/test'
import { EditableCanvas } from './editable-canvas.tsx'
import { StatefulEditable } from './editable-layouts.tsx'

const meta = {
  decorators: [EditableCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/Editable/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ProjectName: Story = {
  render: () => (
    <StatefulEditable
      initialValue="Q4 launch plan"
      maxLength={60}
      placeholder="Name the project"
      required
    >
      <EditableLabel>Project name</EditableLabel>
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
      <EditableTrigger>Rename</EditableTrigger>
      <EditableToolbar>
        <EditableSubmit>Save</EditableSubmit>
        <EditableCancel>Cancel</EditableCancel>
      </EditableToolbar>
    </StatefulEditable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Q4 launch plan' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Rename' })).toBeVisible()
  },
}

export const FileName: Story = {
  render: () => (
    <StatefulEditable
      autosize
      initialValue="signed-contract-v2.pdf"
      triggerMode="dblclick"
    >
      <EditableLabel className="sr-only">File name</EditableLabel>
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
    </StatefulEditable>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'signed-contract-v2.pdf',
      }),
    ).toBeVisible()
  },
}

export const DocumentTitle: Story = {
  render: () => (
    <StatefulEditable
      initialValue="Untitled document"
      placeholder="Untitled document"
    >
      <EditableField
        aria-label="Document title"
        className="font-semibold text-2xl"
        emptyValue="Untitled document"
      />
    </StatefulEditable>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Document title' }),
    ).toHaveValue('Untitled document')
  },
}

export const MeetingNotes: Story = {
  render: () => (
    <StatefulEditable
      initialValue="Bring the signed contract and the Q3 revenue numbers to Thursday's review."
      placeholder="Add notes for the meeting"
    >
      <EditableLabel>Notes</EditableLabel>
      <EditableField className="text-sm" multiline />
    </StatefulEditable>
  ),
  play: async ({ canvasElement }) => {
    const notes = within(canvasElement).getByRole('textbox', { name: 'Notes' })
    await expect(notes.tagName).toBe('TEXTAREA')
    await expect(notes).toHaveValue(
      "Bring the signed contract and the Q3 revenue numbers to Thursday's review.",
    )
  },
}

export const ArchivedProject: Story = {
  render: () => (
    <StatefulEditable initialValue="Q3 launch plan" readOnly>
      <EditableLabel>Project name</EditableLabel>
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
      <EditableTrigger>Rename</EditableTrigger>
    </StatefulEditable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Project name' }),
    ).toHaveAttribute('readonly')
    await expect(canvas.queryByRole('button', { name: 'Rename' })).toBeNull()
  },
}
