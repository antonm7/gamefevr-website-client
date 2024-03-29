export type ElementDescription = {
  id: string
  games_count?: number
  image_background?: string
  slug?: string
  name: string
}

export type Platform = {
  platform: {
    id: number
    games_count: number
    image_background: string
    name: string
    slug: string
    year_end: number
    year_start: number
  }
  released_at: string
  requirements: any
}

export type ParentPlatform = {
  platform: {
    id: number
    name: string
    slug: string
  }
}

export type Short_Screenshot = {
  id: number
  image: string
}

export type Screenshot = {
  count: number
  next: any
  previous: any
  results: Short_Screenshot[]
}

export type Store = {
  domain: string
  games_count: number
  id: number
  image_background: string
  name: string
  slug: string
}

export type ShortGame = {
  id: number
  name: string
  genres: ElementDescription[]
  platforms: Platform[]
  parent_platforms: ParentPlatform[]
  released: string
  slug: string
  tags: ElementDescription[]
  short_screenshots: Short_Screenshot[]
  background_image: string
}

export type same_series_type = {
  count: number
  next: boolean
  previus: boolean
  results: ShortGame[]
}

export type DetailedGame = {
  id: number
  name: string
  released: string
  background_image: string
  description: string
  genres: ElementDescription[]
  developers: ElementDescription[]
  parent_platforms: ParentPlatform[]
  platforms: Platform[]
  stores: {
    id: number
    store: {
      domain: string
      games_count: number
      id: number
      image_background: string
      name: string
      slug: string
    }
    url: string
  }[]
  publishers: ElementDescription[]
  tags: ElementDescription[]
  website: string
  same_series: same_series_type | null
}

export type NamedGame = {
  id: number
  name: string
}

export type OPEN_ALERT_TYPE = {
  type: 'error' | 'warning' | 'request' | 'success'
  msg: string
  requestOwner?: string
}
