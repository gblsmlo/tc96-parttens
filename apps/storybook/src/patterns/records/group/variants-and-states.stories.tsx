import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { RecordGroupDemo } from './fixtures/group-demo'

const meta = {
  args: { title: 'Details' },
  component: RecordGroupDemo,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '`card` wraps the header and the rows in one flat muted card. `empty` starts the group closed and centers the content once it opens.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Variants and States',
} satisfies Meta<typeof RecordGroupDemo>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Card: Story = {
  args: { title: 'Details', variant: 'card' },
}

export const CardInteraction: Story = {
  ...Card,
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector(
      '[data-slot="record-group"]',
    ) as HTMLElement

    const surface = section.querySelector(
      ':scope > [data-slot="card"]',
    ) as HTMLElement

    expect(section).toHaveAttribute('data-variant', 'card')
    expect(surface).not.toBeNull()
    expect(getComputedStyle(surface).backgroundColor).not.toBe(
      'rgba(0, 0, 0, 0)',
    )
  },
  tags: interaction,
}

export const Empty: Story = {
  args: {
    empty: true,
    emptyMessage: 'No properties yet',
    footerLabel: 'Add property',
    title: 'Details',
  },
}

export const EmptyInteraction: Story = {
  ...Empty,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('button', { name: 'Details' })
    const section = canvasElement.querySelector(
      '[data-slot="record-group"]',
    ) as HTMLElement

    expect(section).toHaveAttribute('data-empty', 'true')
    expect(title).toHaveAttribute('aria-expanded', 'false')
    expect(canvas.queryByText('No properties yet')).toBeNull()

    await userEvent.click(title)
    await waitFor(() => expect(title).toHaveAttribute('aria-expanded', 'true'))

    const message = await canvas.findByText('No properties yet')
    const content = canvasElement.querySelector(
      '[data-slot="record-group-content"]',
    ) as HTMLElement
    const footer = await waitFor(() => {
      const found = canvasElement.querySelector(
        '[data-slot="record-group-footer"]',
      ) as HTMLElement
      expect(found).toBeVisible()
      return found
    })

    await waitFor(() => {
      const contentBox = content.getBoundingClientRect()
      const messageBox = message.getBoundingClientRect()
      expect(
        Math.abs(
          messageBox.left +
            messageBox.width / 2 -
            (contentBox.left + contentBox.width / 2),
        ),
      ).toBeLessThan(1)
      expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        contentBox.bottom - 0.5,
      )
    })
    expect(
      within(footer).getByRole('button', { name: 'Add property' }),
    ).toBeVisible()
  },
  tags: interaction,
}
