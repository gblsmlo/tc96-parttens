import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@tc96/ui/card'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '@tc96/ui/meter'
import { InfoIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'
import { CardCanvas } from './card-canvas.tsx'
import { TeamMembersFrame } from './card-layouts.tsx'

const meta = {
  decorators: [CardCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Card/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const usage = [
  { label: 'Seats', max: 10, value: 7, unit: 'seats' },
  { label: 'Storage', max: 100, value: 42, unit: 'GB' },
]

export const CreateProject: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle
          id="create-project-title"
          render={(props) => <h2 {...props} />}
        >
          Create project
        </CardTitle>
        <CardDescription>
          Deploy a new project from a Git repository.
        </CardDescription>
      </CardHeader>
      <CardPanel>
        <Form
          aria-labelledby="create-project-title"
          className="flex flex-col gap-4"
          onFormSubmit={() => undefined}
        >
          <Field name="name">
            <FieldLabel>Project name</FieldLabel>
            <Input placeholder="northwind-web" required />
          </Field>
          <Field name="repository">
            <FieldLabel>Repository</FieldLabel>
            <Input placeholder="github.com/northwind/web" required />
            <FieldDescription>
              The default branch deploys to production.
            </FieldDescription>
          </Field>
          <Button className="self-start" type="submit">
            Deploy
          </Button>
        </Form>
      </CardPanel>
      <CardFooter className="gap-2">
        <InfoIcon aria-hidden="true" className="size-4 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          The first deploy takes about a minute.
        </p>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole('form', {
      name: 'Create project',
    })
    await expect(
      within(form).getByRole('textbox', { name: 'Project name' }),
    ).toBeRequired()
    await expect(
      within(form).getByRole('button', { name: 'Deploy' }),
    ).toBeVisible()
  },
}

export const CurrentPlan: Story = {
  render: () => (
    <Card aria-labelledby="current-plan-title" render={<section />}>
      <CardHeader className="border-b">
        <CardTitle
          id="current-plan-title"
          render={(props) => <h2 {...props} />}
        >
          Team plan
        </CardTitle>
        <CardDescription>
          $24 per seat a month, renews on Dec 1, 2026.
        </CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Change plan
          </Button>
        </CardAction>
      </CardHeader>
      <CardPanel className="flex flex-col gap-5">
        {usage.map(({ label, max, unit, value }) => (
          <Meter key={label} max={max} value={value}>
            <div className="flex items-center gap-2">
              <MeterLabel>{label}</MeterLabel>
              <MeterValue className="ms-auto">
                {() => `${value} of ${max} ${unit}`}
              </MeterValue>
            </div>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        ))}
      </CardPanel>
      <CardFooter className="border-t">
        <p className="text-muted-foreground text-sm">
          Invoices are emailed to billing@northwind.example.
        </p>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', {
      name: 'Team plan',
    })
    await expect(within(section).getAllByRole('meter')).toHaveLength(2)
    await expect(
      within(section).getByRole('button', { name: 'Change plan' }),
    ).toBeVisible()
  },
}

export const TeamMembers: Story = {
  render: () => <TeamMembersFrame />,
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', {
      name: 'Team members',
    })
    await expect(within(section).getAllByRole('listitem')).toHaveLength(3)
    await expect(
      within(section).getByRole('button', { name: 'Invite member' }),
    ).toBeVisible()
  },
}
