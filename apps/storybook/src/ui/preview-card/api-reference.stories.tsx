import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from '@tc96/ui/preview-card'
import { expect, screen, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: PreviewCard,
  parameters: {
    docs: { story: { iframeHeight: '200px', inline: false } },
    layout: 'padded',
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/PreviewCard/API Reference',
} satisfies Meta<typeof PreviewCard>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <div className="flex justify-center">
      <PreviewCard {...args}>
        <PreviewCardTrigger href="#anatomy">
          <Slot name="PreviewCardTrigger" />
        </PreviewCardTrigger>
        <PreviewCardPopup>
          <Slot name="PreviewCardPopup" />
        </PreviewCardPopup>
      </PreviewCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('link', {
      name: 'PreviewCardTrigger',
    })
    await expect(trigger).toHaveAttribute('data-slot', 'preview-card-trigger')
    const slot = await screen.findByText('PreviewCardPopup')
    const popup = slot.closest('[data-slot="preview-card-content"]')
    await expect(popup).toBeVisible()
    await expect(
      popup?.closest('[data-slot="preview-card-positioner"]'),
    ).not.toBeNull()
  },
}
