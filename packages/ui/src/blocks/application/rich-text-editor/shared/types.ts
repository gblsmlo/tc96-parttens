export interface SuggestionAuthor {
  id: string
  name: string
}

export type SuggestionKind = 'delete' | 'insert' | 'replace'

export type SuggestionView = 'all' | 'final' | 'original'

export interface SuggestionChange {
  after: string
  author: SuggestionAuthor
  before: string
  createdAt: Date
  id: string
  kind: SuggestionKind
}

export interface SuggestionState {
  activeId: string | null
  view: SuggestionView
}
