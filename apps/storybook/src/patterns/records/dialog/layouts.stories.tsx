import type { Meta, StoryObj } from '@storybook/react-vite'
import { recordDialogControlArgs } from './record-dialog-controls.ts'
import {
  ComposedRecordDialog,
  DescriptionOverBodyFormation,
  InlinePropertiesFormation,
  PropertyBarOverBodyFormation,
  RowPropertiesFormation,
} from './record-dialog-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/RecordDialog/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedRecordDialog {...recordDialogControlArgs} />,
}

export const InlineProperties: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The headline, then the properties as chips pinned to the bottom of the popup. For quick capture, when the properties are few and optional.',
      },
    },
  },
  render: () => (
    <ComposedRecordDialog {...recordDialogControlArgs} stretchBody>
      <InlinePropertiesFormation />
    </ComposedRecordDialog>
  ),
}

export const RowProperties: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The headline, then one row per property, with the label on the start and the value on the end. For records whose properties need their name in view.',
      },
    },
  },
  render: () => (
    <ComposedRecordDialog {...recordDialogControlArgs}>
      <RowPropertiesFormation />
    </ComposedRecordDialog>
  ),
}

export const PropertyBarOverBody: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The title without a description, a bar of `plain` property chips 8px under it, and a free body 24px below that fills a large popup, all in the readable column. For records whose content is long text or any body of its own.',
      },
    },
  },
  render: () => (
    <ComposedRecordDialog
      {...recordDialogControlArgs}
      bodyWidth="readable"
      headlineDescription={false}
      size="large"
      stretchBody
    >
      <PropertyBarOverBodyFormation />
    </ComposedRecordDialog>
  ),
}

export const DescriptionOverBody: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'No headline: the trail with the dialog description under it, and the body free for content, here one row per property. For bodies whose content is not a record title, such as a group of properties.',
      },
    },
  },
  render: () => (
    <ComposedRecordDialog
      {...recordDialogControlArgs}
      description="Fill in the project before it goes live."
      headline={false}
    >
      <DescriptionOverBodyFormation />
    </ComposedRecordDialog>
  ),
}
