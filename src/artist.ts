import got, { Headers } from "got"
import { Track, Album, AccessTokenOrClientId } from "./types"

const prefixUrl = "https://api.tidal.com/v1/artists"
// TODO add videos and mix

type GetInput = {
  id: number
  countryCode?: string
  client_id?: string
  access_token?: string
} & AccessTokenOrClientId

type GetOutput = {
  id: number
  name: string
  artistTypes: Array<string>
  url: string
  picture: string
  popularity: number
  artistRoles: Array<{
    categoryId: number
    category: string
  }>
  mixes: {
    MASTER_ARTIST_MIX: string
    ARTIST_MIX: string
  }
}

type BioInput = {
  id: number
  countryCode?: string
  client_id?: string
  access_token?: string
} & AccessTokenOrClientId

type BioOutput = {
  source: string
  lastUpdated: string
  text: string
  summary: string
}

type LinksInput = {
  id: number
  countryCode?: string
  client_id?: string
  access_token?: string
} & AccessTokenOrClientId

type LinksOutput = {
  limit: number
  offset: number
  totalNumberOfItems: number
  items: Array<{
    url: string
    siteName: string
  }>
  source: string
}

type TopTracksInput = {
  id: number
  limit?: number
  offset?: number
  countryCode?: string
  client_id?: string
  access_token?: string
} & AccessTokenOrClientId

type TopTracksOutput = {
  limit: number
  offset: number
  totalNumberOfItems: number
  items: Array<Track>
}

type AlbumsInput = {
  id: number
  limit?: number
  offset?: number
  countryCode?: string
  client_id?: string
  access_token?: string
} & AccessTokenOrClientId

type AlbumsOutput = {
  limit: number
  offset: number
  totalNumberOfItems: number
  items: Array<Album>
}

const artist = {
  /**
   * Get info about an artist.
   * You need to either provide a client_id or an access_token.
   * Optionally you can set a countryCode, defaults to US.
   */
  get: async ({ id, countryCode = "US", client_id, access_token }: GetInput) => {
    let headers: Headers = { "x-tidal-token": client_id }
    if (!client_id) headers = { authorization: `Bearer ${access_token}` }

    if (!client_id && !access_token)
      throw new Error("You need to either provide a client_id or an access_token.")

    const data = await got({
      prefixUrl,
      url: `${id}`,
      searchParams: {
        countryCode,
      },
      headers,
    }).json()

    return data as GetOutput
  },
  /**
   * Get an artist's bio.
   * You need to either provide a client_id or an access_token.
   * Optionally you can set a countryCode, defaults to US.
   */
  bio: async ({ id, countryCode = "US", client_id, access_token }: BioInput) => {
    let headers: Headers = { "x-tidal-token": client_id }
    if (!client_id) headers = { authorization: `Bearer ${access_token}` }

    if (!client_id && !access_token)
      throw new Error("You need to either provide a client_id or an access_token.")

    const data = await got({
      prefixUrl,
      url: `${id}/bio`,
      searchParams: {
        countryCode,
      },
      headers,
    }).json()

    return data as BioOutput
  },
  /**
   * Get an artist's links.
   * Sometimes there aren't any links, in which case the TIDAL api responds with a 404.
   * This will throw an error, which you need to handle yourself.
   * You need to either provide a client_id or an access_token.
   * Optionally you can set a countryCode, defaults to US.
   */
  links: async ({ id, countryCode = "US", client_id, access_token }: LinksInput) => {
    let headers: Headers = { "x-tidal-token": client_id }
    if (!client_id) headers = { authorization: `Bearer ${access_token}` }

    if (!client_id && !access_token)
      throw new Error("You need to either provide a client_id or an access_token.")

    const data = await got({
      prefixUrl,
      url: `${id}/links`,
      searchParams: {
        countryCode,
      },
      headers,
    }).json()

    return data as LinksOutput
  },
  /**
   * Get an artist's top tracks.
   * You need to either provide a client_id or an access_token.
   * Limit and Offset are optional and default to 50 and 0, respectively.
   * Optionally you can set a countryCode, defaults to US.
   */
  topTracks: async ({
    id,
    countryCode = "US",
    limit = 50,
    offset = 0,
    client_id,
    access_token,
  }: TopTracksInput) => {
    let headers: Headers = { "x-tidal-token": client_id }
    if (!client_id) headers = { authorization: `Bearer ${access_token}` }

    if (!client_id && !access_token)
      throw new Error("You need to either provide a client_id or an access_token.")

    const data = await got({
      prefixUrl,
      url: `${id}/toptracks`,
      searchParams: {
        countryCode,
        limit,
        offset,
      },
      headers,
    }).json()

    return data as TopTracksOutput
  },
  /**
   * Get an artist's albums.
   * You need to either provide a client_id or an access_token.
   * Limit and Offset are optional and default to 50 and 0, respectively.
   * Optionally you can set a countryCode, defaults to US.
   */
  albums: async ({
    id,
    countryCode = "US",
    limit = 50,
    offset = 0,
    client_id,
    access_token,
  }: AlbumsInput) => {
    let headers: Headers = { "x-tidal-token": client_id }
    if (!client_id) headers = { authorization: `Bearer ${access_token}` }

    if (!client_id && !access_token)
      throw new Error("You need to either provide a client_id or an access_token.")

    const data = await got({
      prefixUrl,
      url: `${id}/albums`,
      searchParams: {
        countryCode,
        limit,
        offset,
      },
      headers,
    }).json()

    return data as AlbumsOutput
  },
}

export default artist
