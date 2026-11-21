import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@tc96/ui/progress'
import { expect, within } from 'storybook/test'
import { ProgressCanvas } from './progress-frame.tsx'
import { UploadProgress } from './progress-layouts.tsx'

const meta = {
  decorators: [ProgressCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Progress/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ExportingContacts: Story = {
  render: () => (
    <Progress value={64}>
      <div className="flex items-center gap-2">
        <ProgressLabel>Exporting contacts</ProgressLabel>
        <ProgressValue className="ms-auto" />
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('progressbar', {
        name: 'Exporting contacts',
      }),
    ).toHaveAttribute('aria-valuetext', '64%')
  },
}

export const FileUpload: Story = {
  render: () => <UploadProgress />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('502 / 512 MB')).toBeVisible()
  },
}

export const PreparingWorkspace: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Progress value={null}>
        <ProgressLabel>Preparing your workspace</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <p className="text-muted-foreground text-sm">
        Copying your projects and members. This usually takes less than a
        minute.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('progressbar', {
        name: 'Preparing your workspace',
      }),
    ).not.toHaveAttribute('aria-valuenow')
  },
}

export const SyncRun: Story = {
  render: () => (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-medium text-sm">Nightly sync</p>
        <p className="text-muted-foreground text-sm">7 of 12 tables</p>
      </div>
      <Progress aria-label="Nightly sync: 7 of 12 tables" max={12} value={7} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('progressbar', {
        name: 'Nightly sync: 7 of 12 tables',
      }),
    ).toHaveAttribute('aria-valuenow', '7')
  },
}
