import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFrame } from '@tc96/elements/icon-frame'
import {
  type CollectionDefinition,
  DateProperty,
  ListRow,
  ListRowAction,
  ListRowBody,
  ListRowDescription,
  ListRowField,
  ListRowLeading,
  type ListRowProps,
  ListRowTitle,
  ListRowTitleTrigger,
  ListRowTrailing,
  ListView,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { EllipsisIcon, FileTextIcon } from 'lucide-react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'

interface RowArgs extends Pick<ListRowProps, 'density' | 'interactive'> {
  action: boolean
  description: boolean
  disabled: boolean
  field: boolean
  leading: boolean
  loading: boolean
  trigger: boolean
}

interface UsageRecord {
  id: string
}

const collection: CollectionDefinition<UsageRecord> = {
  getKey: (record) => record.id,
  getLabel: (record) => record.id,
  groupings: [],
  records: [{ id: 'contract' }],
}

const onOpen = fn()
const onMenu = fn()

const usage = `
import {
  ListRow,
  ListRowAction,
  ListRowBody,
  ListRowDescription,
  ListRowField,
  ListRowLeading,
  ListRowTitle,
  ListRowTitleTrigger,
  ListRowTrailing,
  ListView,
} from '@acme/patterns'

<ListView
  collection={collection}
  grouping={null}
  loadingRecordAnatomy={{ media: 'icon', pills: 1 }}
  renderRecord={(record) => (
    <ListRow>
      <ListRowLeading>{media}</ListRowLeading>
      <ListRowBody>
        <ListRowTitle>
          <ListRowTitleTrigger onClick={() => open(record)}>{title}</ListRowTitleTrigger>
        </ListRowTitle>
        <ListRowDescription>{description}</ListRowDescription>
      </ListRowBody>
      <ListRowTrailing>
        <ListRowField always>{properties}</ListRowField>
        <ListRowAction>{menu}</ListRowAction>
      </ListRowTrailing>
    </ListRow>
  )}
/>
`

const docs = {
  api: [
    {
      description:
        'Structural root: an `article` with no content props. `density` is `comfortable` or `compact`, and `interactive` adds the hover surface. Every slot is optional.',
      name: 'ListRow',
    },
    {
      description:
        'Start of the row, for an `IconFrame`, an `Avatar` or a control such as a `Checkbox`. A plain area forwards its click to the title trigger; a control keeps its own.',
      name: 'ListRowLeading',
    },
    {
      description:
        'Column with the title and the description; it takes the remaining width and truncates first.',
      name: 'ListRowBody',
    },
    {
      description:
        'Heading of the row: `h2` in a flat `ListView`, `h3` inside a group.',
      name: 'ListRowTitle',
    },
    {
      description:
        'Button inside `ListRowTitle` that stretches over the whole row. It is the keyboard path to open the record; without it, the row has no button.',
      name: 'ListRowTitleTrigger',
    },
    {
      description: 'Muted secondary line, truncated.',
      name: 'ListRowDescription',
    },
    {
      description: 'End of the row, for fields and actions.',
      name: 'ListRowTrailing',
    },
    {
      description:
        'Holds properties. Hidden below `lg` unless `always`. A focusable value (a tooltip date) forwards its click to the title trigger; a control keeps its own.',
      name: 'ListRowField',
    },
    {
      description: 'Holds a menu or button, above the stretched trigger.',
      name: 'ListRowAction',
    },
    {
      description:
        'Loading row shaped by `media` (`none`, `icon`, `avatar`), `lines`, `pills` and `action`. `ListView` renders it from `loadingRecordAnatomy`.',
      name: 'ListRowSkeleton',
    },
  ],
  description: {
    component:
      '`ListRow` is the structural row for `ListView`: a root and slots, with no content of its own. `Anatomy` shows the slots, driven by the controls. `Usage` fills the same slots with content, and `loading` renders `ListRowSkeleton` with the anatomy the controls set. `Behavior` is the usage under test: the loading row keeps the height of the loaded one, the whole row opens the record, the field forwards its click and shows its tooltip on keyboard focus, the action keeps its own, and a disabled trigger opens nothing.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotClassName =
  'flex h-6 min-w-12 items-center justify-center rounded-sm border border-dashed px-2 text-muted-foreground text-xs'

function UsageList({
  action,
  density,
  description,
  disabled,
  field,
  interactive,
  leading,
  loading,
  trigger,
}: Readonly<RowArgs>) {
  return (
    <ListView<UsageRecord>
      collection={collection}
      grouping={null}
      loading={loading}
      loadingRecordAnatomy={{
        action,
        lines: description ? 2 : 1,
        media: leading ? 'icon' : 'none',
        pills: field ? 1 : 0,
      }}
      loadingRecordLabel="Carregando documento"
      renderRecord={() => (
        <ListRow
          {...(density ? { density } : {})}
          {...(interactive === undefined ? {} : { interactive })}
        >
          {leading ? (
            <ListRowLeading>
              <IconFrame shape="rounded">
                <FileTextIcon aria-hidden="true" />
              </IconFrame>
            </ListRowLeading>
          ) : null}
          <ListRowBody>
            <ListRowTitle>
              {trigger ? (
                <ListRowTitleTrigger disabled={disabled} onClick={onOpen}>
                  Contrato de prestação de serviços
                </ListRowTitleTrigger>
              ) : (
                'Contrato de prestação de serviços'
              )}
            </ListRowTitle>
            {description ? (
              <ListRowDescription>Mariana Souza</ListRowDescription>
            ) : null}
          </ListRowBody>
          {field || action ? (
            <ListRowTrailing>
              {field ? (
                <ListRowField always>
                  <DateProperty
                    ariaLabel="Criado em"
                    displayLabel="há 4 dias"
                    locale="pt-BR"
                    readOnly
                    timeZone="America/Sao_Paulo"
                    tooltip
                    value="2026-11-10T13:00:00.000Z"
                    variant="plain"
                  />
                </ListRowField>
              ) : null}
              {action ? (
                <ListRowAction>
                  <Button
                    aria-label="Mais ações"
                    onClick={onMenu}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <EllipsisIcon aria-hidden="true" />
                  </Button>
                </ListRowAction>
              ) : null}
            </ListRowTrailing>
          ) : null}
        </ListRow>
      )}
    />
  )
}

const meta = {
  args: {
    action: true,
    density: 'comfortable',
    description: true,
    disabled: false,
    field: true,
    interactive: true,
    leading: true,
    loading: false,
    trigger: true,
  },
  argTypes: {
    action: { control: 'boolean' },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    description: { control: 'boolean' },
    disabled: { control: 'boolean' },
    field: { control: 'boolean' },
    interactive: { control: 'boolean' },
    leading: { control: 'boolean' },
    loading: { control: 'boolean' },
    trigger: { control: 'boolean' },
  },
  component: ListRow,
  decorators: [
    (Story) => (
      <div className="w-3xl max-w-full p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/List/Row',
} satisfies Meta<RowArgs>

export default meta

type Story = StoryObj<typeof meta>

const required = <T,>(node: T | null | undefined, name: string): T => {
  if (!node) throw new Error(`The story did not render ${name}.`)
  return node
}

export const Anatomy: Story = {
  argTypes: {
    disabled: { table: { disable: true } },
    loading: { table: { disable: true } },
  },
  play: async ({ canvasElement }) => {
    await expect(
      [...canvasElement.querySelectorAll('[data-slot^="list-row-"]')].map(
        (node) => node.getAttribute('data-slot'),
      ),
    ).toEqual([
      'list-row-leading',
      'list-row-body',
      'list-row-title',
      'list-row-title-trigger',
      'list-row-description',
      'list-row-trailing',
      'list-row-field',
      'list-row-action',
    ])
  },
  render: ({
    action,
    density,
    description,
    field,
    interactive,
    leading,
    trigger,
  }) => (
    <ListRow
      {...(density ? { density } : {})}
      {...(interactive === undefined ? {} : { interactive })}
    >
      {leading ? (
        <ListRowLeading>
          <span className={slotClassName}>Leading</span>
        </ListRowLeading>
      ) : null}
      <ListRowBody className="gap-1">
        <ListRowTitle>
          {trigger ? (
            <ListRowTitleTrigger>
              <span className={slotClassName}>TitleTrigger</span>
            </ListRowTitleTrigger>
          ) : (
            <span className={slotClassName}>Title</span>
          )}
        </ListRowTitle>
        {description ? (
          <ListRowDescription>
            <span className={slotClassName}>Description</span>
          </ListRowDescription>
        ) : null}
      </ListRowBody>
      {field || action ? (
        <ListRowTrailing>
          {field ? (
            <ListRowField always>
              <span className={slotClassName}>Field</span>
            </ListRowField>
          ) : null}
          {action ? (
            <ListRowAction>
              <span className={slotClassName}>Action</span>
            </ListRowAction>
          ) : null}
        </ListRowTrailing>
      ) : null}
    </ListRow>
  ),
}

export const Usage: Story = {
  render: (args) => <UsageList {...args} />,
}

export const Behavior: Story = {
  argTypes: {
    disabled: { table: { disable: true } },
    loading: { table: { disable: true } },
  },
  play: async ({ canvasElement }) => {
    const [loadingView, loadedView, disabledView] = [
      ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="list-view"]'),
    ]
    const loading = within(required(loadingView, 'the loading list'))
    const loaded = within(required(loadedView, 'the loaded list'))
    const disabled = within(required(disabledView, 'the disabled list'))
    const rowIn = (view: Element | undefined) =>
      required(view?.querySelector('[data-slot="list-row"]'), 'a row')
    const tooltipText = () =>
      canvasElement.ownerDocument.querySelector('[data-slot="tooltip-popup"]')
        ?.textContent

    const skeleton = loading.getByRole('status', {
      name: 'Carregando documento',
    })
    await expect(skeleton.dataset.media).toBe('icon')
    await expect(skeleton.dataset.lines).toBe('2')
    await expect(skeleton.dataset.pills).toBe('1')
    await expect(rowIn(loadingView).getBoundingClientRect().height).toBe(
      rowIn(loadedView).getBoundingClientRect().height,
    )

    onOpen.mockClear()
    onMenu.mockClear()
    const description = loaded.getByText('Mariana Souza')
    const { height, left, top, width } = description.getBoundingClientRect()
    await userEvent.click(
      required(
        canvasElement.ownerDocument.elementFromPoint(
          left + width / 2,
          top + height / 2,
        ),
        'an element over the description',
      ),
    )
    await expect(onOpen).toHaveBeenCalledTimes(1)

    const date = required(
      loaded
        .getByText('há 4 dias')
        .closest<HTMLElement>('[data-slot="property-surface"]'),
      'the date surface',
    )
    await userEvent.hover(date)
    await waitFor(() => expect(tooltipText()).toBeTruthy())
    await userEvent.click(date)
    await expect(onOpen).toHaveBeenCalledTimes(2)

    await userEvent.click(loaded.getByRole('button', { name: 'Mais ações' }))
    await expect(onMenu).toHaveBeenCalledTimes(1)
    await expect(onOpen).toHaveBeenCalledTimes(2)

    const trigger = loaded.getByRole('button', {
      name: 'Contrato de prestação de serviços',
    })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await expect(onOpen).toHaveBeenCalledTimes(3)

    await userEvent.unhover(date)
    await userEvent.tab()
    await expect(date).toHaveFocus()
    await waitFor(() => expect(tooltipText()).toBeTruthy())
    await expect(date).toHaveAccessibleDescription(tooltipText() ?? '')
    await expect(onOpen).toHaveBeenCalledTimes(3)

    const disabledTrigger = disabled.getByRole('button', {
      name: 'Contrato de prestação de serviços',
    })
    await expect(disabledTrigger).toBeDisabled()
    await userEvent.click(disabledTrigger)
    await expect(onOpen).toHaveBeenCalledTimes(3)
  },
  render: (args) => (
    <div className="grid gap-4">
      <UsageList {...args} disabled={false} loading />
      <UsageList {...args} disabled={false} loading={false} />
      <UsageList {...args} disabled loading={false} />
    </div>
  ),
}
