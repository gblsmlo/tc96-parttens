import {
  Crm1,
  type Crm1Archived,
  type Crm1CompaniesProps,
  type Crm1Company,
  type Crm1Contact,
  type Crm1LeadStatus,
  type Crm1Mode,
  type Crm1PeopleProps,
  type Crm1Person,
  type Crm1Sort,
  type Crm1Variant,
} from '@tc96/ui/blocks/data/crm/crm-1'
import { useEffect, useState } from 'react'
import {
  companies,
  people,
  savedViews as savedViewFixtures,
  sectors,
  tags,
} from '../fixtures/crm-1.ts'
import type { Crm1Controls } from './crm-1-controls.ts'

type Callbacks = Pick<
  Crm1PeopleProps,
  | 'onArchivedFilterChange'
  | 'onBulkArchive'
  | 'onBulkUnarchive'
  | 'onCreate'
  | 'onLeadFilterChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onPageChange'
  | 'onSavedViewCreate'
  | 'onSavedViewSelect'
  | 'onSavePreference'
  | 'onSearchChange'
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onTagFilterChange'
  | 'onVariantChange'
> &
  Pick<Crm1CompaniesProps, 'onBulkSectorChange'>

export interface ComposedCrm1Props extends Crm1Controls, Callbacks {}

type SharedProps = Omit<Crm1PeopleProps, 'records' | 'variant'>

const noop = () => undefined
const composedPageSize = 5

const visibleOf = <TRecord extends Crm1Contact>(
  items: readonly TRecord[],
  {
    archivedFilter,
    search,
    sort,
    tagFilter,
  }: {
    archivedFilter: Crm1Archived | null
    search: string
    sort: Crm1Sort
    tagFilter: readonly string[]
  },
) =>
  items
    .filter(
      (item) =>
        (archivedFilter === 'include' ||
          item.archived === (archivedFilter === 'only')) &&
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (tagFilter.length === 0 ||
          item.tagIds.some((id) => tagFilter.includes(id))),
    )
    .sort((a, b) => {
      if (sort === 'created_desc') return b.id.localeCompare(a.id)
      const order = a.name.localeCompare(b.name, 'pt-BR')
      return sort === 'name_desc' ? -order : order
    })

export const ComposedCrm1 = ({
  archivedFilter: archivedControl,
  bulkActions,
  empty,
  headerActions,
  mode: modeControl,
  onArchivedFilterChange,
  onBulkArchive,
  onBulkSectorChange,
  onBulkUnarchive,
  onCreate,
  onLeadFilterChange,
  onModeChange,
  onOpen,
  onPageChange,
  onSavedViewCreate,
  onSavedViewSelect,
  onSavePreference,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onTagFilterChange,
  onVariantChange,
  openable,
  paginated,
  savedViews,
  variant: variantControl,
  viewCounts,
}: Readonly<ComposedCrm1Props>) => {
  const [personItems, setPersonItems] = useState<Crm1Person[]>(people)
  const [companyItems, setCompanyItems] = useState<Crm1Company[]>(companies)
  const [variant, setVariant] = useState<Crm1Variant>(variantControl)
  const [mode, setMode] = useState<Crm1Mode>(modeControl)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Crm1Sort>('name_asc')
  const [archivedFilter, setArchivedFilter] = useState<Crm1Archived | null>(
    archivedControl,
  )
  const [leadFilter, setLeadFilter] = useState<Crm1LeadStatus | null>(null)
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)

  useEffect(() => {
    setVariant(variantControl)
  }, [variantControl])
  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])
  useEffect(() => {
    setArchivedFilter(archivedControl)
  }, [archivedControl])

  const updateArchived = (ids: readonly string[], archived: boolean) => {
    setPersonItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, archived } : item,
      ),
    )
    setCompanyItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, archived } : item,
      ),
    )
  }
  const firstPage = () => setPage(1)

  const query = { archivedFilter, search, sort, tagFilter }
  const matchingPeople = empty ? [] : visibleOf(personItems, query)
  const matchingCompanies = empty ? [] : visibleOf(companyItems, query)
  const total =
    variant === 'people' ? matchingPeople.length : matchingCompanies.length
  const pageOf = <TRecord,>(items: TRecord[]) =>
    paginated
      ? items.slice((page - 1) * composedPageSize, page * composedPageSize)
      : items

  const shared: SharedProps = {
    archivedFilter,
    counts: viewCounts
      ? { companies: companyItems.length, people: personItems.length }
      : undefined,
    filtered: Boolean(
      search ||
        tagFilter.length ||
        leadFilter ||
        (archivedFilter && archivedFilter !== 'exclude'),
    ),
    leadFilter,
    mode,
    onArchivedFilterChange: (next) => {
      setArchivedFilter(next)
      firstPage()
      onArchivedFilterChange?.(next)
    },
    onBulkArchive: bulkActions
      ? (ids) => {
          updateArchived(ids, true)
          onBulkArchive?.(ids)
        }
      : undefined,
    onBulkUnarchive: bulkActions
      ? (ids) => {
          updateArchived(ids, false)
          onBulkUnarchive?.(ids)
        }
      : undefined,
    onCreate: headerActions ? (onCreate ?? noop) : undefined,
    onLeadFilterChange: (next) => {
      setLeadFilter(next)
      firstPage()
      onLeadFilterChange?.(next)
    },
    onModeChange: (next) => {
      setMode(next)
      onModeChange?.(next)
    },
    onOpen: openable ? (onOpen ?? noop) : undefined,
    onPageChange: (next) => {
      setPage(next)
      onPageChange?.(next)
    },
    onSavedViewCreate: savedViews ? (onSavedViewCreate ?? noop) : undefined,
    onSavedViewSelect: savedViews
      ? (id) => {
          setSavedViewId(id)
          onSavedViewSelect?.(id)
        }
      : undefined,
    onSavePreference: savedViews ? (onSavePreference ?? noop) : undefined,
    onSearchChange: headerActions
      ? (next) => {
          setSearch(next)
          firstPage()
          onSearchChange?.(next)
        }
      : undefined,
    onSelectedIdsChange: bulkActions
      ? (next) => {
          setSelectedIds(next)
          onSelectedIdsChange?.(next)
        }
      : undefined,
    onSortChange: (next) => {
      setSort(next)
      firstPage()
      onSortChange?.(next)
    },
    onTagFilterChange: (next) => {
      setTagFilter(next)
      firstPage()
      onTagFilterChange?.(next)
    },
    onVariantChange: (next) => {
      setVariant(next)
      setSavedViewId(null)
      firstPage()
      onVariantChange?.(next)
    },
    page: paginated ? page : undefined,
    pageCount: paginated
      ? Math.max(1, Math.ceil(total / composedPageSize))
      : undefined,
    pageSize: paginated ? composedPageSize : undefined,
    savedViewId,
    savedViews: savedViews ? savedViewFixtures : undefined,
    search,
    selectedIds: bulkActions ? selectedIds : undefined,
    sort,
    tagFilter,
    tags,
    total: paginated ? total : undefined,
  }

  return variant === 'people' ? (
    <Crm1 {...shared} records={pageOf(matchingPeople)} variant="people" />
  ) : (
    <Crm1
      {...shared}
      onBulkSectorChange={
        bulkActions
          ? (ids, sectorId) => {
              setCompanyItems((current) =>
                current.map((item) =>
                  ids.includes(item.id) ? { ...item, sectorId } : item,
                ),
              )
              onBulkSectorChange?.(ids, sectorId)
            }
          : undefined
      }
      records={pageOf(matchingCompanies)}
      sectors={sectors}
      variant="companies"
    />
  )
}
