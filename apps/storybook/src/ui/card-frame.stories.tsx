import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Card,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from '@tc96/ui/card'
import { PlusIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'

const meta = {
  title: 'UI/Card/Frame',
  component: CardFrame,
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <CardFrame {...args}>
      <CardFrameHeader>
        <CardFrameTitle>Project</CardFrameTitle>
        <CardFrameDescription>
          Manage your project settings and configuration
        </CardFrameDescription>
        <CardFrameAction>
          <Button variant="outline">
            <PlusIcon aria-hidden="true" />
            Add
          </Button>
        </CardFrameAction>
      </CardFrameHeader>
      <Card>
        <CardPanel>Content</CardPanel>
      </Card>
    </CardFrame>
  ),
  tags: ['!autodocs'],
} satisfies Meta<typeof CardFrame>

export default meta
type Story = StoryObj<typeof meta>

export const WithHeaderAction: Story = {
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector(
      '[data-slot="card-frame"]',
    ) as HTMLElement
    const header = frame.querySelector(
      '[data-slot="card-frame-header"]',
    ) as HTMLElement
    await expect(
      within(header).getByRole('button', { name: 'Add' }),
    ).toBeVisible()
    await expect(
      header.querySelector('[data-slot="card-frame-action"]'),
    ).toBeInTheDocument()
    await expect(
      frame.querySelector(':scope > [data-slot="card"]'),
    ).toBeInTheDocument()
  },
}
