import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@tc96/ui/accordion'
import { Checkbox } from '@tc96/ui/checkbox'
import { Label } from '@tc96/ui/label'
import { expect, within } from 'storybook/test'
import { AccordionCanvas } from './accordion-frame.tsx'

const billingQuestions = [
  {
    answer:
      'Yes. Switch plans from Settings → Billing at any time. An upgrade starts today and is prorated; a downgrade starts on your next billing date.',
    question: 'Can I change my plan later?',
    value: 'change-plan',
  },
  {
    answer:
      'Your workspace moves to the Free plan. Nothing is deleted, but projects beyond the first three become read-only until you upgrade.',
    question: 'What happens when my trial ends?',
    value: 'trial-end',
  },
  {
    answer:
      'Annual plans are refunded in full within 30 days of purchase. Monthly plans are not refunded, but you can cancel before the next charge.',
    question: 'Do you offer refunds?',
    value: 'refunds',
  },
]

const productSections = [
  {
    content:
      'A relaxed shirt cut from washed linen, with a camp collar, a chest pocket and a straight hem you can wear untucked.',
    title: 'Description',
    value: 'description',
  },
  {
    content:
      '100% European linen. Machine wash cold on a gentle cycle and hang to dry; iron while slightly damp.',
    title: 'Materials and care',
    value: 'materials',
  },
  {
    content:
      'Free standard shipping on orders over $75, delivered in 3 to 5 business days. Returns are free within 30 days.',
    title: 'Shipping and returns',
    value: 'shipping',
  },
]

const filterGroups = [
  {
    options: ['Shirts', 'Trousers', 'Jackets', 'Knitwear'],
    title: 'Category',
    value: 'category',
  },
  { options: ['XS', 'S', 'M', 'L', 'XL'], title: 'Size', value: 'size' },
  {
    options: ['Black', 'Navy', 'Olive', 'Sand'],
    title: 'Color',
    value: 'color',
  },
]

const meta = {
  decorators: [AccordionCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Accordion/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const BillingFaq: Story = {
  render: () => (
    <Accordion defaultValue={['change-plan']}>
      {billingQuestions.map(({ answer, question, value }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionPanel>{answer}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getAllByRole('button', { expanded: false }),
    ).toHaveLength(billingQuestions.length - 1)
    await expect(
      canvas.getByRole('region', { name: 'Can I change my plan later?' }),
    ).toBeVisible()
  },
}

export const ProductDetails: Story = {
  render: () => (
    <Accordion defaultValue={['description', 'materials']} multiple>
      {productSections.map(({ content, title, value }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionPanel>{content}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/100% European linen/)).toBeVisible()
    await expect(canvas.getAllByRole('region')).toHaveLength(2)
  },
}

export const ShopFilters: Story = {
  render: () => (
    <Accordion defaultValue={['category', 'size']} multiple>
      {filterGroups.map(({ options, title, value }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionPanel>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">{title}</legend>
              {options.map((option) => (
                <Label className="font-normal" key={option}>
                  <Checkbox defaultChecked={option === 'M'} />
                  {option}
                </Label>
              ))}
            </fieldset>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('checkbox', { name: 'M' })).toBeChecked()
    await expect(canvas.getByRole('button', { name: 'Color' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  },
}
