import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { Label } from '@tc96/ui/label'
import { useId, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Checkbox/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const notifications = [
  {
    description: 'When someone mentions you or replies to your comment.',
    id: 'mentions',
    label: 'Mentions and replies',
    on: true,
  },
  {
    description: 'A summary of the activity in your projects, every Monday.',
    id: 'digest',
    label: 'Weekly digest',
    on: true,
  },
  {
    description: 'New features and changes to the product, about once a month.',
    id: 'product',
    label: 'Product updates',
    on: false,
  },
] as const

const files = [
  'Q3 board deck.pdf',
  'Revenue forecast.xlsx',
  'Hiring plan.docx',
  'Brand guidelines.pdf',
] as const

const TermsForm = () => {
  const [accepted, setAccepted] = useState(false)
  return (
    <form
      className="flex w-80 flex-col items-start gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <Label>
        <Checkbox checked={accepted} onCheckedChange={setAccepted} />I agree to
        the Terms of Service and Privacy Policy
      </Label>
      <Button disabled={!accepted} type="submit">
        Create account
      </Button>
    </form>
  )
}

const NotificationSettings = () => {
  const id = useId()
  return (
    <fieldset className="flex w-80 flex-col gap-4">
      <legend className="mb-3 font-semibold text-sm">
        Email notifications
      </legend>
      {notifications.map((item) => (
        <div className="flex items-start gap-2" key={item.id}>
          <Checkbox
            aria-describedby={`${id}-${item.id}-description`}
            defaultChecked={item.on}
            id={`${id}-${item.id}`}
            name={item.id}
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor={`${id}-${item.id}`}>{item.label}</Label>
            <p
              className="text-muted-foreground text-xs"
              id={`${id}-${item.id}-description`}
            >
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </fieldset>
  )
}

const FileSelection = () => {
  const [selected, setSelected] = useState<string[]>([files[0], files[2]])
  const allSelected = selected.length === files.length
  const someSelected = selected.length > 0 && !allSelected
  return (
    <div className="flex w-80 flex-col rounded-lg border">
      <Label className="border-b px-3 py-2">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={(checked) =>
            setSelected(checked && !someSelected ? [...files] : [])
          }
        />
        Select all files
      </Label>
      <ul className="flex flex-col">
        {files.map((file) => (
          <li className="px-3 py-2" key={file}>
            <Label className="font-normal">
              <Checkbox
                checked={selected.includes(file)}
                onCheckedChange={(checked) =>
                  setSelected((current) =>
                    checked
                      ? [...current, file]
                      : current.filter((name) => name !== file),
                  )
                }
              />
              {file}
            </Label>
          </li>
        ))}
      </ul>
    </div>
  )
}

const invoices = [
  { amount: '$1,250.00', customer: 'Northwind Traders', id: 'INV-1042' },
  { amount: '$480.00', customer: 'Contoso Ltd.', id: 'INV-1043' },
  { amount: '$3,900.00', customer: 'Fabrikam Inc.', id: 'INV-1044' },
] as const

const InvoiceTable = () => (
  <table className="w-96 text-sm">
    <thead>
      <tr className="border-b text-left text-muted-foreground">
        <th className="w-8 py-2 font-medium">
          <span className="sr-only">Selected</span>
        </th>
        <th className="py-2 font-medium">Invoice</th>
        <th className="py-2 font-medium">Customer</th>
        <th className="py-2 text-right font-medium">Amount</th>
      </tr>
    </thead>
    <tbody>
      {invoices.map((invoice) => (
        <tr className="border-b" key={invoice.id}>
          <td className="py-2">
            <Checkbox aria-label={`Select invoice ${invoice.id}`} />
          </td>
          <td className="py-2">{invoice.id}</td>
          <td className="py-2">{invoice.customer}</td>
          <td className="py-2 text-right tabular-nums">{invoice.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export const AcceptTerms: Story = {
  render: () => <TermsForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Create account' })
    await expect(submit).toBeDisabled()
    await userEvent.click(
      canvas.getByRole('checkbox', {
        name: 'I agree to the Terms of Service and Privacy Policy',
      }),
    )
    await expect(submit).toBeEnabled()
  },
}

export const EmailNotifications: Story = {
  render: () => <NotificationSettings />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Email notifications' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('checkbox', { name: 'Weekly digest' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      canvas.getByRole('checkbox', { name: 'Product updates' }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const SelectAllFiles: Story = {
  render: () => <FileSelection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const all = canvas.getByRole('checkbox', { name: 'Select all files' })
    await expect(all).toHaveAttribute('aria-checked', 'mixed')
    await userEvent.click(all)
    await expect(all).toHaveAttribute('aria-checked', 'false')
    await expect(
      canvas.getByRole('checkbox', { name: 'Q3 board deck.pdf' }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const InvoiceRows: Story = {
  render: () => <InvoiceTable />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getAllByRole('checkbox', {
        name: /^Select invoice/,
      }),
    ).toHaveLength(invoices.length)
  },
}
