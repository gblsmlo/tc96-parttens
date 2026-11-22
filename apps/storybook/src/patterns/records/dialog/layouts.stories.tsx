import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  recordConfirmDialogControlArgs,
  recordDialogControlArgs,
} from './record-dialog-controls.ts'
import {
  ComposedRecordConfirmDialog,
  ComposedRecordDialog,
} from './record-dialog-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithDescription: Story = {
  render: () => (
    <ComposedRecordDialog
      {...recordDialogControlArgs}
      description="Projects group the issues of one initiative."
    />
  ),
}

export const WithActions: Story = {
  render: () => <ComposedRecordDialog {...recordDialogControlArgs} actions />,
}

export const WithCreateMore: Story = {
  render: () => (
    <ComposedRecordDialog {...recordDialogControlArgs} createMore />
  ),
}

export const WithErrorMessage: Story = {
  render: () => (
    <ComposedRecordDialog
      {...recordDialogControlArgs}
      errorMessage="Could not create the project. Try again."
    />
  ),
}

export const WithoutAncestor: Story = {
  render: () => (
    <ComposedRecordDialog {...recordDialogControlArgs} titleAncestor="" />
  ),
}

export const WithoutCancel: Story = {
  render: () => (
    <ComposedRecordDialog {...recordDialogControlArgs} cancelLabel="" />
  ),
}

export const TitleOnlyHeadline: Story = {
  render: () => (
    <ComposedRecordDialog
      {...recordDialogControlArgs}
      headlineDescription={false}
    />
  ),
}

export const WithoutBody: Story = {
  render: () => (
    <ComposedRecordDialog {...recordDialogControlArgs} headline={false} />
  ),
}

export const ConfirmWithBody: Story = {
  render: () => (
    <ComposedRecordConfirmDialog {...recordConfirmDialogControlArgs} body />
  ),
}

export const ConfirmWithErrorMessage: Story = {
  render: () => (
    <ComposedRecordConfirmDialog
      {...recordConfirmDialogControlArgs}
      errorMessage="Could not delete the project. Try again."
    />
  ),
}

export const ConfirmWithoutDescription: Story = {
  render: () => (
    <ComposedRecordConfirmDialog
      {...recordConfirmDialogControlArgs}
      description=""
    />
  ),
}
