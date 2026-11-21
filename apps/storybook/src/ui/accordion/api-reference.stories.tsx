import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@tc96/ui/accordion'
import { Slot } from '../../test-utils/anatomy-slot'
import { AccordionCanvas } from './accordion-frame.tsx'

const meta = {
  component: Accordion,
  decorators: [AccordionCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Accordion/API Reference',
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultValue: ['item'] },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item">
        <AccordionTrigger>
          <Slot name="AccordionTrigger" />
        </AccordionTrigger>
        <AccordionPanel>
          <Slot name="AccordionPanel" />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
}
