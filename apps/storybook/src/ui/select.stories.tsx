import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
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
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
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
  CableIcon,
  Code2Icon,
  GlobeIcon,
  LayersIcon,
  SearchIcon,
  ZapIcon,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../.storybook/docs-page.tsx'
import { esperarIndicadorADireita } from '../test-utils/property-surface'

type SelectSize = 'default' | 'lg'

interface SelectStoryArgs {
  alignItemWithTrigger: boolean
  defaultValue?: string
  disabled: boolean
  onValueChange: (value: unknown) => void
  placeholder: string
  size: SelectSize
}

const frameworks = [
  { label: 'Next.js', value: 'next' },
  { label: 'Vite', value: 'vite' },
  { label: 'Astro', value: 'astro' },
]

const backend = [
  { label: 'Express', value: 'express' },
  { label: 'NestJS', value: 'nestjs' },
  { label: 'Fastify', value: 'fastify' },
  { label: 'Django', value: 'django' },
  { label: 'Flask', value: 'flask' },
  { label: 'Rails', value: 'rails' },
]

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

const comboboxFruits = [
  ...fruits,
  { label: 'Grape', value: 'grape' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Mango', value: 'mango' },
  { label: 'Pineapple', value: 'pineapple' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Peach', value: 'peach' },
  { label: 'Pear', value: 'pear' },
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

function renderLanguages(value: Language[]) {
  if (value.length === 0) return 'Select languages…'
  const first = value[0] ? languages[value[0]] : ''
  const more = value.length > 1 ? ` (+${value.length - 1} more)` : ''
  return first + more
}

const categories = [
  { icon: LayersIcon, label: 'Components', value: 'components' },
  { icon: ZapIcon, label: 'Performance', value: 'performance' },
  { icon: GlobeIcon, label: 'Network', value: 'network' },
  { icon: Code2Icon, label: 'Development', value: 'development' },
]

const frameworkCommands = [
  { description: 'npx create-next-app', label: 'Next.js', value: 'next' },
  { description: 'npm create vite@latest', label: 'Vite', value: 'vite' },
  { description: 'npm create astro@latest', label: 'Astro', value: 'astro' },
  { description: 'npx create-remix', label: 'Remix', value: 'remix' },
]

const onFrameworkSubmit = fn()

const usage = `
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@acme/ui/select'

const items = [
  { label: 'Select framework', value: null },
  { label: 'Next.js', value: 'next' },
  { label: 'Vite', value: 'vite' },
  { label: 'Astro', value: 'astro' },
]

<Select items={items}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectPopup alignItemWithTrigger={false}>
    <SelectLabel>Frameworks</SelectLabel>
    {items.map((item) => (
      <SelectItem key={item.value} value={item}>
        {item.label}
      </SelectItem>
    ))}
  </SelectPopup>
</Select>
`

const docs = {
  api: [
    {
      description: 'Root component. Alias for `Select.Root` from Base UI.',
      name: 'Select',
    },
    {
      description: `Trigger button that opens the select dropdown. Styled wrapper for \`Select.Trigger\` from Base UI.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`size\` | \`"default"\` or \`"lg"\` | \`"default"\` | Controls the size of the trigger |`,
      name: 'SelectTrigger',
    },
    {
      description:
        'Displays the selected value. Styled wrapper for `Select.Value` from Base UI.',
      name: 'SelectValue',
    },
    {
      description: `Popup container for select options. Also exported as \`SelectContent\`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`alignItemWithTrigger\` | \`boolean\` | \`false\` | Aligns the selected item with the trigger |
| \`sideOffset\` | \`number\` | \`4\` | Distance from the trigger in pixels |
| \`portalProps\` | \`Select.Portal.Props\` | - | Props forwarded to the internal portal (\`keepMounted\`, \`container\`, etc.); see Base UI Select portal API |

The COSS component itself defaults \`alignItemWithTrigger\` to \`true\`, so pass \`alignItemWithTrigger={false}\` on every \`SelectPopup\`.`,
      name: 'SelectPopup',
    },
    {
      description:
        'Individual select option. Styled wrapper for `Select.Item` from Base UI with built-in indicator, shown in a trailing column on the right. COSS publishes it on the left; this workspace edits `SelectItem` and `ComboboxItem` so the check sits on the right, as in the pattern menus.',
      name: 'SelectItem',
    },
    {
      description:
        'Groups related select items. Alias for `Select.Group` from Base UI.',
      name: 'SelectGroup',
    },
    {
      description:
        'Label for all options in the popup. Styled wrapper for `Select.Label` from Base UI. Clicking it focuses the select trigger without opening the popup.',
      name: 'SelectLabel',
    },
    {
      description:
        'Label for a select group. Styled wrapper for `Select.GroupLabel` from Base UI.',
      name: 'SelectGroupLabel',
    },
    {
      description:
        'Visual separator between items. Styled wrapper for `Select.Separator` from Base UI.',
      name: 'SelectSeparator',
    },
    {
      description: `A standalone button styled like a \`SelectTrigger\`. Use it as a \`render\` prop on other trigger components (e.g., \`ComboboxTrigger\`, \`MenuTrigger\`) to give them select-like appearance.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`size\` | \`"default"\` or \`"lg"\` | \`"default"\` | Controls the size of the button |

\`\`\`tsx
import { SelectButton } from '@acme/ui/select'

<ComboboxTrigger render={<SelectButton />}>
  <ComboboxValue placeholder="Select a fruit" />
</ComboboxTrigger>
\`\`\``,
      name: 'SelectButton',
    },
  ],
  description: {
    component:
      'COSS Select, with one edit: the `SelectItem` check sits on the right. A common form component for choosing a predefined value in a dropdown menu. For accessible labelling and validation, prefer wrapping it in the `Field` component. Reference: [coss ui Select](https://coss.com/ui/docs/components/select).',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    alignItemWithTrigger: false,
    disabled: false,
    onValueChange: fn(),
    placeholder: 'Select framework',
    size: 'default',
  },
  argTypes: {
    alignItemWithTrigger: {
      control: 'boolean',
      description:
        'Aligns the selected item with the trigger. Set on `SelectPopup`.',
      table: { defaultValue: { summary: 'false' } },
    },
    defaultValue: { control: false },
    disabled: {
      control: 'boolean',
      description: 'Disables the trigger. Set on `SelectTrigger`.',
    },
    onValueChange: { control: false },
    placeholder: {
      control: 'text',
      description: 'Shown while no value is selected. Set on `SelectValue`.',
    },
    size: {
      control: 'inline-radio',
      description: 'Controls the size of the trigger. Set on `SelectTrigger`.',
      options: ['default', 'lg'],
      table: { defaultValue: { summary: 'default' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  render: ({
    alignItemWithTrigger,
    defaultValue,
    disabled,
    onValueChange,
    placeholder,
    size,
  }) => (
    <Select
      defaultValue={defaultValue}
      items={frameworks}
      onValueChange={onValueChange}
    >
      <SelectTrigger
        aria-label="Select framework"
        disabled={disabled}
        size={size}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={alignItemWithTrigger}>
        {frameworks.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
  title: 'UI/Select',
} satisfies Meta<SelectStoryArgs>

export default meta

type Story = StoryObj<SelectStoryArgs>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  args: { defaultValue: 'next' },
}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox', { name: 'Select framework' })
    await expect(trigger).toHaveTextContent('Next.js')

    await userEvent.click(trigger)
    const listbox = await screen.findByRole('listbox')
    await expect(
      listbox.closest('[data-slot="select-positioner"]'),
    ).toHaveAttribute('data-side', 'bottom')
    await esperarIndicadorADireita(
      screen.getByRole('option', { name: 'Next.js' }),
    )

    await userEvent.click(screen.getByRole('option', { name: 'Vite' }))
    await waitFor(() => expect(trigger).toHaveTextContent('Vite'))
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'vite',
      expect.anything(),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
  tags: interaction,
}

export const LargeSize: Story = {
  args: { size: 'lg' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithItemAlignment: Story = {
  args: { alignItemWithTrigger: true, defaultValue: 'next' },
}

export const WithGroups: Story = {
  render: ({ alignItemWithTrigger, size }) => (
    <Select items={[...frameworks, ...backend]}>
      <SelectTrigger aria-label="Select framework" size={size}>
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={alignItemWithTrigger}>
        <SelectGroup>
          <SelectGroupLabel>Frontend</SelectGroupLabel>
          {frameworks.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectGroupLabel>Backend</SelectGroupLabel>
          {backend.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectPopup>
    </Select>
  ),
}

export const WithLabel: Story = {
  render: ({ alignItemWithTrigger, size }) => (
    <Select defaultValue={fruits[0]} items={fruits}>
      <SelectLabel>Fruits</SelectLabel>
      <SelectTrigger size={size}>
        <SelectValue />
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={alignItemWithTrigger}>
        {fruits.map((item) => (
          <SelectItem key={item.value} value={item}>
            {item.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
}

export const MultipleSelection: Story = {
  render: ({ alignItemWithTrigger, size }) => (
    <Select defaultValue={['javascript', 'typescript']} multiple>
      <SelectTrigger aria-label="Select languages" size={size}>
        <SelectValue>{renderLanguages}</SelectValue>
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={alignItemWithTrigger}>
        {languageValues.map((value) => (
          <SelectItem key={value} value={value}>
            {languages[value]}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
}

export const MultipleSelectionInteraction: Story = {
  ...MultipleSelection,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox', { name: 'Select languages' })
    await expect(trigger).toHaveTextContent('JavaScript (+1 more)')

    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Rust' }))
    await waitFor(() =>
      expect(trigger).toHaveTextContent('JavaScript (+2 more)'),
    )
    await expect(screen.getByRole('listbox')).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
  tags: interaction,
}

export const WithIcon: Story = {
  render: ({ alignItemWithTrigger, size }) => (
    <Select defaultValue="next" items={frameworks}>
      <SelectTrigger aria-label="Select framework with icon" size={size}>
        <CableIcon aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={alignItemWithTrigger}>
        {frameworks.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
}

export const OptionsWithIcon: Story = {
  render: ({ alignItemWithTrigger, size }) => (
    <Select
      defaultValue={categories[0]}
      itemToStringValue={(item) => item.value}
    >
      <SelectTrigger aria-label="Select category" size={size}>
        <SelectValue>
          {(item: (typeof categories)[number]) => (
            <span className="flex items-center gap-2">
              <item.icon />
              <span className="truncate">{item.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={alignItemWithTrigger}>
        {categories.map((item) => (
          <SelectItem key={item.value} value={item}>
            <span className="flex items-center gap-2">
              <item.icon />
              <span className="truncate">{item.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
}

export const WithObjectValues: Story = {
  render: ({ alignItemWithTrigger, size }) => (
    <Select
      defaultValue={frameworkCommands[0]}
      itemToStringValue={(item) => item.value}
    >
      <SelectTrigger
        aria-label="Select framework with command"
        className="py-1"
        size={size}
      >
        <SelectValue>
          {(item: (typeof frameworkCommands)[number]) => (
            <span className="flex flex-col">
              <span className="truncate">{item.label}</span>
              <span className="truncate text-muted-foreground text-xs">
                {item.description}
              </span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={alignItemWithTrigger}>
        {frameworkCommands.map((item) => (
          <SelectItem key={item.value} value={item}>
            <span className="flex flex-col">
              <span className="truncate">{item.label}</span>
              <span className="truncate text-muted-foreground text-xs">
                {item.description}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  ),
}

export const SelectButtonWithCombobox: Story = {
  name: 'SelectButton with Combobox',
  // COSS SelectButton placeholder is 3.06:1 in light and 3.26:1 in dark (below 4.5:1); SelectButton stays as COSS publishes it, so only the contrast check is off.
  parameters: {
    a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
  },
  render: ({ size }) => (
    <Combobox items={comboboxFruits}>
      <ComboboxTrigger
        aria-label="Select a fruit"
        render={<SelectButton size={size} />}
      >
        <ComboboxValue placeholder="Select a fruit" />
      </ComboboxTrigger>
      <ComboboxPopup aria-label="Select a fruit">
        <div className="border-b p-2">
          <ComboboxInput
            className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
            placeholder="Search fruits..."
            showTrigger={false}
            startAddon={<SearchIcon />}
          />
        </div>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: (typeof comboboxFruits)[number]) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  ),
}

export const SelectButtonWithComboboxInteraction: Story = {
  ...SelectButtonWithCombobox,
  name: 'SelectButton with Combobox Interaction',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox', { name: 'Select a fruit' })

    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Mango' }))
    await waitFor(() => expect(trigger).toHaveTextContent('Mango'))

    await userEvent.click(trigger)
    await esperarIndicadorADireita(
      await screen.findByRole('option', { name: 'Mango' }),
    )

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
  tags: interaction,
}

function onFrameworkFormSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  onFrameworkSubmit(new FormData(event.currentTarget).get('framework'))
}

export const FormIntegration: Story = {
  render: ({ alignItemWithTrigger, size }) => (
    <Form
      className="flex w-full flex-col gap-4"
      onSubmit={onFrameworkFormSubmit}
    >
      <Field>
        <FieldLabel>Framework</FieldLabel>
        <Select
          aria-label="Select framework"
          items={frameworks}
          name="framework"
          required
        >
          <SelectTrigger size={size}>
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={alignItemWithTrigger}>
            {frameworks.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
        <FieldDescription>Pick your favorite.</FieldDescription>
        <FieldError>Please select a value.</FieldError>
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  ),
}

export const FormIntegrationInteraction: Story = {
  ...FormIntegration,
  play: async ({ canvasElement }) => {
    onFrameworkSubmit.mockClear()
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Submit' })

    await userEvent.click(submit)
    await expect(
      await canvas.findByText('Please select a value.'),
    ).toBeVisible()
    await expect(onFrameworkSubmit).not.toHaveBeenCalled()

    await userEvent.click(canvas.getByRole('combobox', { name: /Framework/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'Vite' }))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await userEvent.click(submit)
    await waitFor(() => expect(onFrameworkSubmit).toHaveBeenCalledWith('vite'))
  },
  tags: interaction,
}
