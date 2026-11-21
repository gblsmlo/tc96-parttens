import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { Input } from '@tc96/ui/input'
import { InboxIcon } from 'lucide-react'
import type { EmptyControls } from './empty-controls.ts'

export const ComposedEmpty = ({
  actions,
  description,
  media,
  mediaVariant,
  title,
}: Readonly<EmptyControls>) => (
  <Empty>
    <EmptyHeader>
      {media ? (
        <EmptyMedia variant={mediaVariant}>
          <InboxIcon aria-hidden="true" />
        </EmptyMedia>
      ) : null}
      {title ? <EmptyTitle>{title}</EmptyTitle> : null}
      {description ? <EmptyDescription>{description}</EmptyDescription> : null}
    </EmptyHeader>
    {actions ? (
      <EmptyContent>
        <Button size="sm">Add item</Button>
      </EmptyContent>
    ) : null}
  </Empty>
)

export const ActionRowEmpty = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia>
        <InboxIcon aria-hidden="true" />
      </EmptyMedia>
      <EmptyTitle>No items yet</EmptyTitle>
      <EmptyDescription>Items you add show up here.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <div className="flex gap-2">
        <Button size="sm">Add item</Button>
        <Button size="sm" variant="outline">
          Import items
        </Button>
      </div>
    </EmptyContent>
  </Empty>
)

export const LinkInDescriptionEmpty = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia>
        <InboxIcon aria-hidden="true" />
      </EmptyMedia>
      <EmptyTitle>No items yet</EmptyTitle>
      <EmptyDescription>
        Items you add show up here. <a href="#items">Learn about items</a>
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button size="sm">Add item</Button>
    </EmptyContent>
  </Empty>
)

export const InputInContentEmpty = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia>
        <InboxIcon aria-hidden="true" />
      </EmptyMedia>
      <EmptyTitle>No items yet</EmptyTitle>
      <EmptyDescription>Items you add show up here.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Input aria-label="Item name" placeholder="Item name" />
      <Button size="sm">Add item</Button>
    </EmptyContent>
  </Empty>
)
