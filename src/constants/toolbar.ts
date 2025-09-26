export type TypeFilterValue = '' | 'primary' | 'secondary'

export const TOOLBAR_DEFAULTS = {
  searchQuery: '' as string,
  typeFilter: '' as TypeFilterValue,
  primaryFirst: true as boolean,
  pollMin: 3000,
  pollStep: 1000,
} as const
