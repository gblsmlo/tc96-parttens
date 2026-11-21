import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { Slot } from '../../test-utils/anatomy-slot'
import { TableCanvas } from './table-frame.tsx'

const meta = {
  component: Table,
  decorators: [TableCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Table/API Reference',
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>
        <span className="inline-flex">
          <Slot name="TableCaption" />
        </span>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Slot name="TableHead" />
          </TableHead>
          <TableHead>
            <Slot name="TableHead" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Slot name="TableCell" />
          </TableCell>
          <TableCell>
            <Slot name="TableCell" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Slot name="TableCell" />
          </TableCell>
          <TableCell>
            <Slot name="TableCell" />
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            <Slot name="TableCell" />
          </TableCell>
          <TableCell>
            <Slot name="TableCell" />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}
