import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@tc96/ui/progress'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { progressControlArgs } from './progress-controls.ts'
import { ProgressCanvas } from './progress-frame.tsx'
import {
  AdvancingProgress,
  ComposedProgress,
  UploadProgress,
} from './progress-layouts.tsx'

const meta = {
  decorators: [ProgressCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Progress/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const partIn = (container: HTMLElement, slot: string) => {
  const part = container.querySelector(`[data-slot="${slot}"]`)
  if (!(part instanceof HTMLElement))
    throw new Error(`The part ${slot} did not render.`)
  return part
}

const statuses = ['data-progressing', 'data-complete', 'data-indeterminate']

export const NamedByLabel: Story = {
  render: () => <ComposedProgress {...progressControlArgs} />,
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', {
      name: 'Label text',
    })
    const label = partIn(canvasElement, 'progress-label')
    await expect(bar).toHaveAttribute('aria-labelledby', label.id)
  },
}

export const ValueAttributes: Story = {
  render: () => <ComposedProgress {...progressControlArgs} />,
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar')
    await expect(bar).toHaveAttribute('aria-valuemin', '0')
    await expect(bar).toHaveAttribute('aria-valuemax', '100')
    await expect(bar).toHaveAttribute('aria-valuenow', '40')
    await expect(bar).toHaveAttribute('aria-valuetext', '40%')
    const value = partIn(canvasElement, 'progress-value')
    await expect(value).toHaveTextContent('40%')
    await expect(value).toHaveAttribute('aria-hidden', 'true')
  },
}

export const ScalesToRange: Story = {
  render: () => (
    <ComposedProgress {...progressControlArgs} max={60} value={30} />
  ),
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar')
    await expect(bar).toHaveAttribute('aria-valuenow', '30')
    await expect(bar).toHaveAttribute('aria-valuemax', '60')
    await expect(partIn(canvasElement, 'progress-indicator').style.width).toBe(
      '50%',
    )
    await expect(partIn(canvasElement, 'progress-value')).toHaveTextContent(
      '50%',
    )
  },
}

export const ClampsToRange: Story = {
  render: () => <ComposedProgress {...progressControlArgs} value={150} />,
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar')
    await expect(bar).toHaveAttribute('aria-valuenow', '100')
    await expect(bar).toHaveAttribute('aria-valuetext', '100%')
    await expect(bar).toHaveAttribute('data-complete')
    await expect(partIn(canvasElement, 'progress-indicator').style.width).toBe(
      '100%',
    )
  },
}

export const StatusAttributes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ComposedProgress {...progressControlArgs} label="Progressing" />
      <ComposedProgress {...progressControlArgs} label="Complete" value={100} />
      <ComposedProgress
        {...progressControlArgs}
        indeterminate
        label="Indeterminate"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const expected = [
      ['Progressing', 'data-progressing'],
      ['Complete', 'data-complete'],
      ['Indeterminate', 'data-indeterminate'],
    ] as const
    for (const [name, status] of expected) {
      const bar = canvas.getByRole('progressbar', { name })
      const parts = [bar, ...bar.querySelectorAll('[data-slot^="progress-"]')]
      await expect(parts).toHaveLength(5)
      for (const part of parts) {
        for (const attribute of statuses) {
          if (attribute === status)
            await expect(part).toHaveAttribute(attribute)
          else await expect(part).not.toHaveAttribute(attribute)
        }
      }
    }
  },
}

export const Indeterminate: Story = {
  render: () => <ComposedProgress {...progressControlArgs} indeterminate />,
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar')
    await expect(bar).not.toHaveAttribute('aria-valuenow')
    await expect(bar).toHaveAttribute(
      'aria-valuetext',
      'indeterminate progress',
    )
    await expect(partIn(canvasElement, 'progress-value')).toHaveTextContent('')
    const indicator = partIn(canvasElement, 'progress-indicator')
    await expect(indicator.style.width).toBe('')
    await expect(indicator.getBoundingClientRect().height).toBe(0)
  },
}

export const BuiltInTrack: Story = {
  render: () => <Progress aria-label="Label text" value={40} />,
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', {
      name: 'Label text',
    })
    const track = partIn(bar, 'progress-track')
    const indicator = partIn(track, 'progress-indicator')
    await expect(indicator.style.width).toBe('40%')
    await expect(track.getBoundingClientRect().height).toBe(6)
  },
}

export const FormatsValue: Story = {
  render: () => (
    <Progress
      format={{ style: 'unit', unit: 'megabyte' }}
      locale="en-US"
      max={512}
      value={502}
    >
      <div className="flex items-center gap-2">
        <ProgressLabel>Label text</ProgressLabel>
        <ProgressValue className="ms-auto" />
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  ),
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar')
    await expect(bar).toHaveAttribute('aria-valuetext', '502 MB')
    await expect(partIn(canvasElement, 'progress-value')).toHaveTextContent(
      '502 MB',
    )
  },
}

export const CustomValueText: Story = {
  render: () => <UploadProgress />,
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', {
      name: 'Uploading quarterly-report.pdf',
    })
    await expect(bar).toHaveAttribute(
      'aria-valuetext',
      '502 of 512 MB uploaded',
    )
    await expect(partIn(canvasElement, 'progress-value')).toHaveTextContent(
      '502 / 512 MB',
    )
  },
}

export const FollowsValue: Story = {
  render: () => <AdvancingProgress />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Next step' }))
    const bar = canvas.getByRole('progressbar', { name: 'Profile setup' })
    await expect(bar).toHaveAttribute('aria-valuenow', '50')
    const track = partIn(bar, 'progress-track').getBoundingClientRect()
    const indicator = partIn(bar, 'progress-indicator')
    await expect(indicator.style.width).toBe('50%')
    await waitFor(() =>
      expect(indicator.getBoundingClientRect().width).toBeCloseTo(
        track.width / 2,
        0,
      ),
    )
  },
}
