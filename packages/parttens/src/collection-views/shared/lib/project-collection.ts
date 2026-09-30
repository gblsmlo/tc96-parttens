import type {
  CollectionDefinition,
  CollectionGroup,
  CollectionGroupingId,
  CollectionOption,
} from '../../types/collection'

const DEFAULT_UNASSIGNED_LABEL = 'Sem valor'

interface MutableCollectionGroup<TItem>
  extends Omit<CollectionGroup<TItem>, 'items'> {
  items: TItem[]
}

function createGroup<TItem>(
  grouping: string,
  option: CollectionOption,
): MutableCollectionGroup<TItem> {
  return {
    ...option,
    count: 0,
    grouping,
    items: [],
    value: option.id,
  }
}

export function projectCollection<TItem>(
  collection: CollectionDefinition<TItem>,
  groupBy: CollectionGroupingId | null,
): readonly CollectionGroup<TItem>[] {
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
  const groups = options.map((option) => createGroup<TItem>(groupBy, option))
  const groupsByValue = new Map(groups.map((group) => [group.value, group]))
  let unassignedGroup: MutableCollectionGroup<TItem> | undefined

  for (const item of collection.items) {
    const value = getGroupId(item)
    let group = groupsByValue.get(value)

    if (value === null && !group) {
      unassignedGroup = {
        count: 0,
        grouping: groupBy,
        id: `${groupBy}:unassigned`,
        items: [],
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
    group.items.push(item)
    group.count = group.items.length
  }

  if (unassignedGroup) groups.push(unassignedGroup)

  return groups.map((group) => ({
    ...group,
    id: group.value === null ? group.id : `${groupBy}:${group.id}`,
  }))
}
