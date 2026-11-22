import type { Meta, StoryObj } from '@storybook/react-vite'
import { accordionControlArgs } from './accordion-controls.ts'
import { AccordionCanvas } from './accordion-frame.tsx'
import { ComposedAccordion } from './accordion-layouts.tsx'

const meta = {
  decorators: [AccordionCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Accordion/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithIcons: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} icons />,
}

export const SingleItem: Story = {
  render: () => <ComposedAccordion {...accordionControlArgs} itemCount={1} />,
}

export const RichPanel: Story = {
  render: () => (
    <ComposedAccordion
      {...accordionControlArgs}
      defaultValue="first"
      richPanels
    />
  ),
}
