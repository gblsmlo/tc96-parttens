import type {
  CollectionDefinition,
  CollectionGroup,
  CollectionGroupingId,
  CollectionOption,
} from '../../types/collection'

const DEFAULT_UNASSIGNED_LABEL = 'Sem valor'

interface MutableCollectionGroup<TRecord>
  extends Omit<CollectionGroup<TRecord>, 'records'> {
  records: TRecord[]
}

function createGroup<TRecord>(
  grouping: string,
  option: CollectionOption,
): MutableCollectionGroup<TRecord> {
  return {
    ...option,
    count: 0,
    grouping,
    records: [],
    value: option.id,
  }
}

export function projectCollection<TRecord>(
  collection: CollectionDefinition<TRecord>,
  groupBy: CollectionGroupingId | null,
): readonly CollectionGroup<TRecord>[] {
  // Ausência de agrupamento não é uma projeção vazia: é a view que renderiza a
  // coleção plana. Chegar aqui sem dimensão é sempre erro de programação — não um
  // estado de usuário a degradar silenciosamente.
  if (groupBy === null) {
    throw new Error(
      'projectCollection: sem agrupamento não há grupos a projetar.',
    )
  }

  const dimension = collection.groupings.find(
    (candidate) => candidate.id === groupBy,
  )

  if (!dimension) {
    throw new Error(
      `projectCollection: dimensão "${groupBy}" não declarada em collection.groupings.`,
    )
  }

  const {
    getGroupId,
    options,
    unassignedLabel = DEFAULT_UNASSIGNED_LABEL,
  } = dimension
  const groups = options.map((option) => createGroup<TRecord>(groupBy, option))
  const groupsByValue = new Map(groups.map((group) => [group.value, group]))
  let unassignedGroup: MutableCollectionGroup<TRecord> | undefined

  for (const record of collection.records) {
    const value = getGroupId(record)
    let group = groupsByValue.get(value)

    if (value === null && !group) {
      unassignedGroup = {
        count: 0,
        grouping: groupBy,
        id: `${groupBy}:unassigned`,
        records: [],
        label: unassignedLabel,
        value: null,
      }
      group = unassignedGroup
      groupsByValue.set(null, group)
    } else if (value !== null && !group) {
      group = createGroup(groupBy, { id: value, label: value })
      groups.push(group)
      groupsByValue.set(value, group)
    }

    if (!group) continue
    group.records.push(record)
    group.count = group.records.length
  }

  if (unassignedGroup) groups.push(unassignedGroup)

  return groups.map((group) => ({
    ...group,
    id: group.value === null ? group.id : `${groupBy}:${group.id}`,
  }))
}
