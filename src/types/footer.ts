export interface IFooterLink {
  name: string
  link: string
}

export interface IContactItem {
  label: string
  value: string
  href?: string
}

export interface IProgramItem {
  day: string
  hours: string
  closed?: boolean
}
