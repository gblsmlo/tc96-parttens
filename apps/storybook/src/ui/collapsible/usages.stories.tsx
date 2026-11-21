import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { expect, userEvent, within } from 'storybook/test'
import { CollapsibleCanvas } from './collapsible-frame.tsx'
import { Chevron, collapsibleTriggerClassName } from './collapsible-layouts.tsx'

const recoveryKeys = ['4G8N-YT2P-Q7KD', 'M3XR-9BWL-C5HJ', 'T6VZ-2QFA-8NEP']

const orderItems = [
  { name: 'Linen shirt, size M', price: '$48.00' },
  { name: 'Canvas tote bag', price: '$22.00' },
  { name: 'Wool socks, 2 pairs', price: '$16.00' },
]

const meta = {
  decorators: [CollapsibleCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Collapsible/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const RecoveryKeys: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger className={collapsibleTriggerClassName}>
        Show recovery keys
        <Chevron />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <ul className="flex flex-col gap-1 py-2 text-muted-foreground text-sm">
          {recoveryKeys.map((key) => (
            <li className="rounded-sm bg-muted px-2 py-1 font-mono" key={key}>
              {key}
            </li>
          ))}
        </ul>
      </CollapsiblePanel>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show recovery keys' }),
    )
    await expect(await canvas.findAllByRole('listitem')).toHaveLength(
      recoveryKeys.length,
    )
  },
}

export const CloudAccessQuestion: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger className="group/trigger flex w-full items-center justify-between gap-2 text-start font-medium text-sm">
        Can I open my files from another device?
        <Chevron />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <p className="pt-2 text-muted-foreground text-sm">
          Yes. Every file you upload syncs to the cloud, so you can open it from
          any device signed in to your account.
        </p>
      </CollapsiblePanel>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Can I open my files from another device?',
      }),
    ).toBeVisible()
  },
}

export const OrderItems: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between font-medium">
        <span>Order #10482</span>
        <span>$86.00</span>
      </div>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className={collapsibleTriggerClassName}>
          3 items
          <Chevron />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <ul className="flex flex-col gap-1 pt-2 text-muted-foreground">
            {orderItems.map((item) => (
              <li className="flex justify-between" key={item.name}>
                <span>{item.name}</span>
                <span>{item.price}</span>
              </li>
            ))}
          </ul>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Canvas tote bag'),
    ).toBeVisible()
  },
}
