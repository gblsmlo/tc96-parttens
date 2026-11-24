import { IconRow, type IconRowVariant } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { CheckboxGroup } from '@tc96/ui/checkbox-group'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import {
  BellIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DownloadIcon,
  EllipsisIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  type LucideIcon,
  MailIcon,
  MessageSquareIcon,
  PencilIcon,
  SmartphoneIcon,
  Trash2Icon,
  UsersIcon,
} from 'lucide-react'
import type { IconRowControls } from './icon-row-controls.ts'

export interface IconRowActionsProps {
  name: string
  onDelete?: () => void
  onDownload?: () => void
  onRename?: () => void
}

export function IconRowActions({
  name,
  onDelete,
  onDownload,
  onRename,
}: Readonly<IconRowActionsProps>) {
  return (
    <>
      <Button
        aria-label={`Download ${name}`}
        onClick={onDownload}
        size="icon-sm"
        variant="ghost"
      >
        <DownloadIcon aria-hidden="true" />
      </Button>
      <Menu>
        <MenuTrigger
          aria-label={`More actions for ${name}`}
          render={<Button size="icon-sm" variant="ghost" />}
        >
          <EllipsisIcon aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="end">
          <MenuItem onClick={onRename}>
            <PencilIcon aria-hidden="true" />
            Rename
          </MenuItem>
          <MenuItem onClick={onDelete} variant="destructive">
            <Trash2Icon aria-hidden="true" />
            Delete
          </MenuItem>
        </MenuPopup>
      </Menu>
    </>
  )
}

export const IconRowChevron = () => (
  <ChevronRightIcon
    aria-hidden="true"
    className="size-4 text-muted-foreground"
  />
)

export type ComposedIconRowProps = IconRowControls &
  Omit<IconRowActionsProps, 'name'> & {
    className?: string
    onSelect?: () => void
  }

export const ComposedIconRow = ({
  actions,
  className,
  description,
  element,
  iconColor,
  onDelete,
  onDownload,
  onRename,
  onSelect,
  title,
  variant,
}: ComposedIconRowProps) => {
  const actionsPart =
    element === 'div' ? (
      <IconRowActions
        name={title}
        onDelete={onDelete}
        onDownload={onDownload}
        onRename={onRename}
      />
    ) : (
      <IconRowChevron />
    )

  return (
    <IconRow
      actions={actions ? actionsPart : undefined}
      className={className}
      description={description || undefined}
      icon={<FileTextIcon />}
      iconColor={iconColor || undefined}
      render={
        element === 'a'
          ? (props) => <a {...props} href="#quarterly-report" />
          : element === 'button'
            ? (props) => <button {...props} onClick={onSelect} type="button" />
            : undefined
      }
      title={title}
      variant={variant}
    />
  )
}

interface SampleRow {
  description: string
  icon: LucideIcon
  id: string
  title: string
}

export const sampleFiles: readonly SampleRow[] = [
  {
    description: 'Updated 2 hours ago by Anna',
    icon: FileTextIcon,
    id: 'report',
    title: 'Quarterly report',
  },
  {
    description: 'Updated yesterday by Ben',
    icon: FileSpreadsheetIcon,
    id: 'budget',
    title: 'Budget forecast',
  },
  {
    description: 'Updated last week by Carla',
    icon: FileImageIcon,
    id: 'cover',
    title: 'Cover image',
  },
]

export const sampleLinks: readonly SampleRow[] = [
  {
    description: 'Invite people and set what they can see',
    icon: UsersIcon,
    id: 'members',
    title: 'Members',
  },
  {
    description: 'Plan, invoices and payment method',
    icon: CreditCardIcon,
    id: 'billing',
    title: 'Billing',
  },
  {
    description: 'Choose what reaches you and where',
    icon: BellIcon,
    id: 'notifications',
    title: 'Notifications',
  },
]

export const sampleChannels: readonly SampleRow[] = [
  {
    description: 'A message to your inbox',
    icon: MailIcon,
    id: 'email',
    title: 'Email',
  },
  {
    description: 'A text message to your phone',
    icon: MessageSquareIcon,
    id: 'sms',
    title: 'SMS',
  },
  {
    description: 'A notification on the mobile app',
    icon: SmartphoneIcon,
    id: 'push',
    title: 'Push',
  },
]

const FileRows = ({ variant }: Readonly<{ variant: IconRowVariant }>) =>
  sampleFiles.map((file) => (
    <li key={file.id}>
      <IconRow
        actions={<IconRowActions name={file.title} />}
        description={file.description}
        icon={<file.icon />}
        title={file.title}
        variant={variant}
      />
    </li>
  ))

export const StackedRowsFormation = () => (
  <ul aria-label="Files" className="flex flex-col gap-2">
    <FileRows variant="outline" />
  </ul>
)

export const dividedListClassName =
  'flex flex-col divide-y divide-border overflow-hidden rounded-lg border'

export const DividedRowsFormation = () => (
  <ul aria-label="Files" className={dividedListClassName}>
    <FileRows variant="plain" />
  </ul>
)

export const LinkRowsFormation = () => (
  <nav aria-label="Settings">
    <ul className={dividedListClassName}>
      {sampleLinks.map((link) => (
        <li key={link.id}>
          <IconRow
            actions={<IconRowChevron />}
            description={link.description}
            icon={<link.icon />}
            render={(props) => <a {...props} href={`#${link.id}`} />}
            title={link.title}
            variant="plain"
          />
        </li>
      ))}
    </ul>
  </nav>
)

export interface SingleChoiceRowsProps {
  defaultValue?: string
  onValueChange?: (value: unknown) => void
}

export const SingleChoiceRowsFormation = ({
  defaultValue = 'email',
  onValueChange,
}: Readonly<SingleChoiceRowsProps>) => (
  <RadioGroup
    aria-label="Channel"
    className="gap-2"
    defaultValue={defaultValue}
    onValueChange={onValueChange}
  >
    {sampleChannels.map((channel) => (
      <IconRow
        actions={<Radio value={channel.id} />}
        description={channel.description}
        icon={<channel.icon />}
        key={channel.id}
        render={(props) => (
          // biome-ignore lint/a11y/noLabelWithoutControl: the Radio in actions is the control
          <label {...props} />
        )}
        title={channel.title}
      />
    ))}
  </RadioGroup>
)

export interface MultipleChoiceRowsProps {
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export const MultipleChoiceRowsFormation = ({
  defaultValue = ['email'],
  onValueChange,
}: Readonly<MultipleChoiceRowsProps>) => (
  <CheckboxGroup
    aria-label="Channels"
    className="items-stretch gap-2"
    defaultValue={defaultValue}
    onValueChange={onValueChange}
  >
    {sampleChannels.map((channel) => (
      <IconRow
        actions={<Checkbox value={channel.id} />}
        description={channel.description}
        icon={<channel.icon />}
        key={channel.id}
        render={(props) => (
          // biome-ignore lint/a11y/noLabelWithoutControl: the Checkbox in actions is the control
          <label {...props} />
        )}
        title={channel.title}
      />
    ))}
  </CheckboxGroup>
)
