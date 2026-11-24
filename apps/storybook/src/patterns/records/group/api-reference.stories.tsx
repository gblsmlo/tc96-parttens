import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupItem,
  RecordGroupLink,
  RecordGroupMetric,
  RecordGroupMetrics,
  RecordGroupRow,
  RecordGroupSubgroup,
} from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import { IconSlot, Slot } from '../../../test-utils/anatomy-slot'
import { rowsOf } from './fixtures/group-dom'
import { RecordGroupCanvas } from './record-group-canvas.tsx'

const meta = {
  decorators: [RecordGroupCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Records/Group/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const slotsOf = (scope: Element, prefix: string) =>
  [...scope.querySelectorAll(`[data-slot^="${prefix}"]`)].map((node) =>
    node.getAttribute('data-slot'),
  )

const widthOf = (scope: HTMLElement, selector: string) =>
  (scope.querySelector(selector) as HTMLElement).getBoundingClientRect().width

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    await expect(slotsOf(canvasElement, 'record-group-')).toEqual([
      'record-group-header',
      'record-group-actions',
      'record-group-content',
      'record-group-footer',
    ])
    const footer = widthOf(canvasElement, '[data-slot="record-group-footer"]')
    await expect(footer).toBeCloseTo(
      widthOf(canvasElement, '[data-slot="record-group-header"]'),
      1,
    )
    await expect(footer).toBeCloseTo(
      widthOf(canvasElement, '[data-slot="collapsible-panel"] > :first-child'),
      1,
    )
  },
  render: () => (
    <RecordGroup
      actions={<Slot name="actions" />}
      footer={<Slot name="footer" />}
      title={<Slot name="title" />}
    >
      <Slot name="children" />
    </RecordGroup>
  ),
}

export const RowAnatomy: Story = {
  play: async ({ canvasElement }) => {
    for (const row of rowsOf(canvasElement)) {
      await expect(row.tagName).toBe('DL')
      await expect(
        [...row.querySelectorAll('[data-slot^="record-group-row-"]')].map(
          (node) => node.tagName,
        ),
      ).toEqual(['DT', 'DD'])
    }
  },
  render: () => (
    <RecordGroup title="RecordGroup">
      <RecordGroupRow label={<Slot name="label" />} leading={<IconSlot />}>
        <Slot name="children" />
      </RecordGroupRow>
      <RecordGroupRow align="between" label={<Slot name="label" />}>
        <Slot name="children" />
      </RecordGroupRow>
    </RecordGroup>
  ),
}

export const ItemAnatomy: Story = {
  play: async ({ canvasElement }) => {
    for (const item of canvasElement.querySelectorAll(
      '[data-slot="record-group-item"]',
    )) {
      await expect(slotsOf(item, 'record-group-item-')).toEqual([
        'record-group-item-title',
        'record-group-item-trailing',
      ])
    }
  },
  render: () => (
    <RecordGroup title="RecordGroup">
      {['first', 'second'].map((key) => (
        <RecordGroupItem
          key={key}
          leading={<IconSlot />}
          title={<Slot name="title" />}
        >
          <Slot name="children" />
        </RecordGroupItem>
      ))}
    </RecordGroup>
  ),
}

export const LinkAnatomy: Story = {
  play: async ({ canvasElement }) => {
    for (const link of canvasElement.querySelectorAll(
      '[data-slot="record-group-link"]',
    )) {
      await expect(slotsOf(link, 'record-group-link-')).toEqual([
        'record-group-link-name',
        'record-group-link-meta',
      ])
    }
  },
  render: () => (
    <RecordGroup title="RecordGroup">
      {['first', 'second'].map((key) => (
        <RecordGroupLink
          href={`#/${key}`}
          key={key}
          leading={<IconSlot />}
          meta={<Slot name="meta" />}
        >
          <Slot name="children" />
        </RecordGroupLink>
      ))}
    </RecordGroup>
  ),
}

export const SubgroupAnatomy: Story = {
  play: async ({ canvasElement }) => {
    await expect(slotsOf(canvasElement, 'record-group-subgroup')).toEqual([
      'record-group-subgroup',
      'record-group-subgroup-count',
      'record-group-subgroup-meta',
      'record-group-subgroup-content',
    ])
  },
  render: () => (
    <RecordGroup title="RecordGroup">
      <RecordGroupSubgroup
        count="count"
        defaultOpen
        meta={<Slot name="meta" />}
        title={<Slot name="title" />}
      >
        <Slot name="children" />
      </RecordGroupSubgroup>
    </RecordGroup>
  ),
}

export const MetricAnatomy: Story = {
  play: async ({ canvasElement }) => {
    for (const metric of canvasElement.querySelectorAll(
      '[data-slot="record-group-metric"]',
    )) {
      await expect(slotsOf(metric, 'record-group-metric-')).toEqual([
        'record-group-metric-value',
        'record-group-metric-target',
        'record-group-metric-progress',
      ])
    }
  },
  render: () => (
    <RecordGroup title="RecordGroup">
      <RecordGroupMetrics>
        {['First', 'Second'].map((name) => (
          <RecordGroupMetric
            icon={<IconSlot />}
            key={name}
            label={`${name} label`}
            progress={0.6}
            target={<Slot name="target" />}
            value={<Slot name="value" />}
          />
        ))}
      </RecordGroupMetrics>
    </RecordGroup>
  ),
}
