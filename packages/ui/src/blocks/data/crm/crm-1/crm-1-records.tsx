import { BuildingsIcon, UserIcon } from '@phosphor-icons/react'
import { IconFrame } from '@tc96/ui/icon-frame'
import { DataCollectionListRow } from '../../shared/collection/data-collection-record-parts'
import {
  Crm1ArchivedMark,
  type Crm1FieldContext,
  Crm1PhoneField,
  type Crm1Row,
  Crm1TagsField,
  crm1SectorLabel,
} from './crm-1-fields'

const presentParts = (parts: readonly (string | null | undefined)[]) =>
  parts.filter((part): part is string => Boolean(part))

export const renderCrm1ListRow =
  (context: Crm1FieldContext) => (item: Crm1Row) => {
    const { labels, onOpen, variant } = context
    const Icon = variant === 'people' ? UserIcon : BuildingsIcon
    return (
      <DataCollectionListRow
        caption={presentParts(
          variant === 'people'
            ? [item.email, item.document]
            : [item.document, crm1SectorLabel(context, item)],
        )}
        fields={
          <>
            <Crm1PhoneField context={context} item={item} />
            <Crm1TagsField context={context} item={item} />
          </>
        }
        icon={
          <IconFrame shape="rounded" size="sm">
            <Icon aria-hidden="true" />
          </IconFrame>
        }
        mark={
          item.archived ? (
            <Crm1ArchivedMark context={context} item={item} />
          ) : undefined
        }
        onOpen={onOpen ? () => onOpen(item.id) : undefined}
        openLabel={labels.openRecord(item.name)}
        title={item.name}
      />
    )
  }
