import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type AccordionControls,
  accordionControlArgs,
  accordionControlArgTypes,
} from './accordion-controls.ts'
import { AccordionCanvas } from './accordion-frame.tsx'
import { ComposedAccordion } from './accordion-layouts.tsx'

const meta = {
  args: accordionControlArgs,
  argTypes: accordionControlArgTypes,
  decorators: [AccordionCanvas],
  parameters: {
    controls: { exclude: ['defaultValue'] },
    layout: 'centered',
  },
  render: (args) => <ComposedAccordion {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Accordion/Stories',
} satisfies Meta<AccordionControls>

export default meta

type Story = StoryObj<AccordionControls>

export const Default: Story = {}

export const ItemOpen: Story = {
  args: { defaultValue: 'first' },
  name: 'Item open',
}
