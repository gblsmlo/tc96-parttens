import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionDefinition,
  ListRow,
  ListRowAction,
  ListRowBody,
  ListRowContent,
  ListRowDescription,
  ListRowField,
  ListRowFooter,
  ListRowHeader,
  ListRowLeading,
  ListRowSkeleton,
  ListRowTitle,
  ListRowTitleTrigger,
  ListRowTrailing,
  ListView,
} from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { ListCanvas } from './list-canvas.tsx'

interface AnatomyRecord {
  group: string
  id: string
}

const anatomyCollection: CollectionDefinition<AnatomyRecord> = {
  getKey: (record) => record.id,
  getLabel: (record) => record.id,
  groupings: [
    {
      getGroupId: (record) => record.group,
      id: 'status',
      label: 'Group',
      options: [
        { id: 'first', label: 'Group' },
        { id: 'second', label: 'Empty group' },
      ],
    },
  ],
  records: [
    { group: 'first', id: 'record-1' },
    { group: 'first', id: 'record-2' },
  ],
}

const ignore = () => undefined

const meta = {
  args: {
    collection: anatomyCollection,
    emptyGroupLabel: <Slot name="emptyGroupLabel" />,
    getGroupActions: () => ({ onAddRecord: ignore }),
    grouping: 'status',
    renderGroupTitle: (group) => <Slot name={group.label} />,
    renderRecord: () => (
      <ListRow interactive={false}>
        <ListRowBody>
          <ListRowTitle>
            <Slot name="renderRecord" />
          </ListRowTitle>
        </ListRowBody>
      </ListRow>
    ),
  },
  component: ListView<AnatomyRecord>,
  decorators: [ListCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/ListView/API Reference',
} satisfies Meta<typeof ListView<AnatomyRecord>>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-group"]'),
    ).toHaveLength(2)
    await expect(
      canvasElement.querySelector('[data-slot="list-group-header"]'),
    ).not.toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="list-group-count"]'),
    ).not.toBeNull()
  },
}

export const RowAnatomy: Story = {
  render: () => (
    <ListRow>
      <ListRowLeading>
        <Slot name="Leading" />
      </ListRowLeading>
      <ListRowBody className="gap-1">
        <ListRowTitle>
          <ListRowTitleTrigger>
            <Slot name="TitleTrigger" />
          </ListRowTitleTrigger>
        </ListRowTitle>
        <ListRowDescription>
          <Slot name="Description" />
        </ListRowDescription>
      </ListRowBody>
      <ListRowTrailing>
        <ListRowField always>
          <Slot name="Field" />
        </ListRowField>
        <ListRowAction>
          <Slot name="Action" />
        </ListRowAction>
      </ListRowTrailing>
    </ListRow>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      [...canvasElement.querySelectorAll('[data-slot^="list-row-"]')].map(
        (node) => node.getAttribute('data-slot'),
      ),
    ).toEqual([
      'list-row-leading',
      'list-row-body',
      'list-row-title',
      'list-row-title-trigger',
      'list-row-description',
      'list-row-trailing',
      'list-row-field',
      'list-row-action',
    ])
  },
}

export const SingleLineRowAnatomy: Story = {
  render: () => (
    <ListRow>
      <ListRowHeader>
        <ListRowTitle>
          <Slot name="Title" />
        </ListRowTitle>
        <ListRowContent>
          <Slot name="Content" />
        </ListRowContent>
      </ListRowHeader>
      <ListRowFooter>
        <Slot name="Footer" />
      </ListRowFooter>
    </ListRow>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      [...canvasElement.querySelectorAll('[data-slot^="list-row-"]')].map(
        (node) => node.getAttribute('data-slot'),
      ),
    ).toEqual([
      'list-row-header',
      'list-row-title',
      'list-row-content',
      'list-row-footer',
    ])
  },
}

export const SkeletonAnatomy: Story = {
  render: () => <ListRowSkeleton media="avatar" pills={2} />,
}
