export type TypeFilterValue = '' | 'primary' | 'secondary'

export const TOOLBAR_DEFAULTS = {
  searchQuery: '',
  typeFilter: '',
  primaryFirst: true,
  pollMin: 3000,
  pollStep: 1000,
} as const
