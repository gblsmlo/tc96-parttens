import {
  EnvelopeSimpleIcon,
  IdentificationCardIcon,
  PhoneIcon,
} from '@phosphor-icons/react'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import type { Crm1Contact, Crm1Labels, Crm1Option, Crm1Variant } from './types'

export interface Crm1Row extends Crm1Contact {
  email?: string | null
  sectorId?: string | null
}

export interface Crm1FieldContext {
  labels: Crm1Labels
  onOpen?: (recordId: string) => void
  sectors: readonly Crm1Option[]
  tags: readonly Crm1Option[]
  variant: Crm1Variant
}

interface FieldProps {
  context: Crm1FieldContext
  item: Crm1Row
}

export function Crm1ArchivedMark({ context, item }: FieldProps) {
  if (!item.archived) return null
  return (
    <span className="shrink-0 text-muted-foreground">
      {context.labels.archived}
    </span>
  )
}

export function Crm1NameCell({ context, item }: FieldProps) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="min-w-0 truncate font-medium">{item.name}</span>
      <Crm1ArchivedMark context={context} item={item} />
    </span>
  )
}

export function Crm1EmailField({ context, item }: FieldProps) {
  const { labels } = context
  return (
    <TextProperty
      ariaLabel={labels.people.columns.email}
      icon={EnvelopeSimpleIcon}
      value={item.email ?? null}
      variant="plain"
      copyable
      labels={{ copy: labels.copyEmail, fallback: labels.noEmail }}
    />
  )
}

export function Crm1PhoneField({ context, item }: FieldProps) {
  const { labels, variant } = context
  return (
    <TextProperty
      ariaLabel={labels[variant].columns.phone}
      icon={PhoneIcon}
      value={item.phone}
      variant="plain"
      labels={{ fallback: labels.noPhone }}
    />
  )
}

export function Crm1DocumentField({ context, item }: FieldProps) {
  const variantLabels = context.labels[context.variant]
  return (
    <TextProperty
      ariaLabel={variantLabels.columns.document}
      icon={IdentificationCardIcon}
      value={item.document}
      variant="plain"
      labels={{ fallback: variantLabels.noDocument }}
    />
  )
}

export function Crm1SectorField({ context, item }: FieldProps) {
  const { labels, sectors } = context
  return (
    <SelectProperty
      ariaLabel={labels.companies.columns.sector}
      options={sectors.map((sector) => ({
        label: sector.label,
        value: sector.id,
      }))}
      placeholder={labels.noSector}
      readOnly
      value={item.sectorId ?? null}
      variant="plain"
    />
  )
}

export function Crm1TagsField({ context, item }: FieldProps) {
  const { labels, tags, variant } = context
  const options = tags
    .filter((tag) => item.tagIds.includes(tag.id))
    .map((tag) => ({ label: tag.label, value: tag.id }))
  if (options.length === 0) return null
  return (
    <TagsProperty
      ariaLabel={labels[variant].columns.tags}
      options={options}
      readOnly
      value={options.map((option) => option.value)}
      variant="badge"
    />
  )
}

export const crm1SectorLabel = (
  context: Crm1FieldContext,
  item: Crm1Row,
): string | null =>
  context.sectors.find((sector) => sector.id === item.sectorId)?.label ?? null
