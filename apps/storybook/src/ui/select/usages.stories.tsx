import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from '@tc96/ui/combobox'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import {
  Select,
  SelectButton,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import {
  ArrowDownWideNarrowIcon,
  type LucideIcon,
  OctagonAlertIcon,
  SearchIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
} from 'lucide-react'
import { Fragment } from 'react'
import { expect, within } from 'storybook/test'
import { SelectCanvas } from './select-frame.tsx'
import { ProjectForm } from './select-layouts.tsx'

interface Priority {
  icon: LucideIcon
  label: string
  value: string
}

interface Template {
  command: string
  label: string
  value: string
}

interface Region {
  label: string
  value: string
}

interface RegionGroup {
  items: Region[]
  label: string
}

interface Member {
  label: string
  value: string
}

const priorities: Priority[] = [
  { icon: OctagonAlertIcon, label: 'Urgent', value: 'urgent' },
  { icon: SignalHighIcon, label: 'High', value: 'high' },
  { icon: SignalMediumIcon, label: 'Medium', value: 'medium' },
  { icon: SignalLowIcon, label: 'Low', value: 'low' },
]

const templates: Template[] = [
  { command: 'npx create-next-app', label: 'Next.js', value: 'next' },
  { command: 'npm create vite@latest', label: 'Vite', value: 'vite' },
  { command: 'npm create astro@latest', label: 'Astro', value: 'astro' },
  { command: 'npx create-remix', label: 'Remix', value: 'remix' },
]

const sortOrders = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'Most commented', value: 'comments' },
  { label: 'Recently updated', value: 'updated' },
]

const languages = {
  cpp: 'C++',
  csharp: 'C#',
  go: 'Go',
  java: 'Java',
  javascript: 'JavaScript',
  php: 'PHP',
  python: 'Python',
  rust: 'Rust',
  swift: 'Swift',
  typescript: 'TypeScript',
}

type Language = keyof typeof languages

const languageValues = Object.keys(languages) as Language[]

const regionGroups: RegionGroup[] = [
  {
    items: [
      { label: 'São Paulo (sa-east-1)', value: 'sa-east-1' },
      { label: 'Virginia (us-east-1)', value: 'us-east-1' },
      { label: 'Oregon (us-west-2)', value: 'us-west-2' },
    ],
    label: 'Americas',
  },
  {
    items: [
      { label: 'Frankfurt (eu-central-1)', value: 'eu-central-1' },
      { label: 'Ireland (eu-west-1)', value: 'eu-west-1' },
    ],
    label: 'Europe',
  },
  {
    items: [
      { label: 'Singapore (ap-southeast-1)', value: 'ap-southeast-1' },
      { label: 'Tokyo (ap-northeast-1)', value: 'ap-northeast-1' },
    ],
    label: 'Asia Pacific',
  },
]

const regions = regionGroups.flatMap((group) => group.items)

const members: Member[] = [
  { label: 'Ana Lima', value: 'u-ana' },
  { label: 'Bruno Costa', value: 'u-bruno' },
  { label: 'Carla Mendes', value: 'u-carla' },
  { label: 'Diego Rocha', value: 'u-diego' },
  { label: 'Mariana Souza', value: 'u-mariana' },
]

const describeLanguages = (value: Language[]) => {
  const [first] = value
  if (!first) return 'Select languages…'
  const more = value.length > 1 ? ` (+${value.length - 1} more)` : ''
  return languages[first] + more
}

const PriorityLabel = ({ item }: Readonly<{ item: Priority }>) => (
  <span className="flex items-center gap-2">
    <item.icon aria-hidden="true" />
    <span className="truncate">{item.label}</span>
  </span>
)

const TemplateLabel = ({ item }: Readonly<{ item: Template }>) => (
  <span className="flex flex-col">
    <span className="truncate">{item.label}</span>
    <span className="truncate text-muted-foreground text-xs">
      {item.command}
    </span>
  </span>
)

const meta = {
  decorators: [SelectCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Select/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const IssuePriority: Story = {
  render: () => (
    <Select
      defaultValue={priorities[1]}
      itemToStringValue={(item) => item.value}
    >
      <SelectLabel>Priority</SelectLabel>
      <SelectTrigger>
        <SelectValue>
          {(item: Priority) => <PriorityLabel item={item} />}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {priorities.map((item) => (
          <SelectItem key={item.value} value={item}>
            <PriorityLabel item={item} />
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Priority',
    })
    await expect(trigger).toHaveTextContent('High')
  },
}

export const StarterTemplate: Story = {
  render: () => (
    <Select
      defaultValue={templates[0]}
      itemToStringValue={(item) => item.value}
    >
      <SelectLabel>Starter template</SelectLabel>
      <SelectTrigger className="py-1">
        <SelectValue>
          {(item: Template) => <TemplateLabel item={item} />}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {templates.map((item) => (
          <SelectItem key={item.value} value={item}>
            <TemplateLabel item={item} />
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Starter template',
    })
    await expect(trigger).toHaveTextContent('npx create-next-app')
  },
}

export const SortIssues: Story = {
  render: () => (
    <Select defaultValue="newest" items={sortOrders}>
      <SelectTrigger aria-label="Sort issues" size="sm">
        <ArrowDownWideNarrowIcon aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {sortOrders.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Sort issues',
    })
    await expect(trigger).toHaveTextContent('Newest first')
  },
}

export const ProfileLanguages: Story = {
  render: () => (
    <Select defaultValue={['javascript', 'typescript']} multiple>
      <SelectLabel>Languages you work with</SelectLabel>
      <SelectTrigger>
        <SelectValue>{describeLanguages}</SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {languageValues.map((value) => (
          <SelectItem key={value} value={value}>
            {languages[value]}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Languages you work with',
    })
    await expect(trigger).toHaveTextContent('JavaScript (+1 more)')
  },
}

export const DeployRegion: Story = {
  render: () => (
    <Field>
      <FieldLabel>Region</FieldLabel>
      <Select defaultValue="sa-east-1" items={regions}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {regionGroups.map((group, index) => (
            <Fragment key={group.label}>
              {index > 0 ? <SelectSeparator /> : null}
              <SelectGroup>
                <SelectGroupLabel>{group.label}</SelectGroupLabel>
                {group.items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </Fragment>
          ))}
        </SelectPopup>
      </Select>
      <FieldDescription>
        Deploy close to your users. The region cannot change later.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Region',
    })
    await expect(trigger).toHaveTextContent('São Paulo (sa-east-1)')
  },
}

export const NewProjectForm: Story = {
  render: () => <ProjectForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', { name: 'Framework' }),
    ).toHaveTextContent('Select a framework')
    await expect(
      canvas.getByRole('button', { name: 'Create project' }),
    ).toBeVisible()
  },
}

export const AssignReviewer: Story = {
  render: () => (
    <Combobox defaultValue={members[0]} items={members}>
      <ComboboxTrigger aria-label="Reviewer" render={<SelectButton />}>
        <ComboboxValue placeholder="Assign a reviewer" />
      </ComboboxTrigger>
      <ComboboxPopup aria-label="Reviewer">
        <div className="border-b p-2">
          <ComboboxInput
            aria-label="Search members"
            placeholder="Search members…"
            showTrigger={false}
            startAddon={<SearchIcon />}
          />
        </div>
        <ComboboxEmpty>No member found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Member) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Reviewer',
    })
    await expect(trigger).toHaveTextContent('Ana Lima')
  },
}
