import type {
  Team2ColumnVisibility,
  Team2Member,
  Team2Settings,
  Team2Sort,
} from '@tc96/ui/blocks/data/team/team-2'
import * as source from '../../team/fixtures/team-1.ts'

export const members: Team2Member[] = source.members
export const initialSort: Team2Sort = source.initialSort
export const defaultVisibility: Team2ColumnVisibility = source.defaultVisibility
export const pageSizeOptions: number[] = source.pageSizeOptions
export const factorySettings: Team2Settings = source.factorySettings
