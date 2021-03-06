import { get } from '@/utils/http'
import { SongsDetail, SongInteface, Albums } from '@/interface/index'

export const getSongUrl = async <T>(id: number | number[]): Promise<T> => {
  const data = await get<{ data: T }>('/api/song/url', {
    id: Array.isArray(id) ? id.join(',') : id,
    br: 9.99e5,
    timestamp: Date.now()
  })
  return data.data
}

export const getSongDetail = async (
  id: number | number[]
): Promise<SongsDetail[]> => {
  const data = await get<{ songs: SongsDetail[] }>('/api/song/detail', {
    ids: typeof id === 'number' ? id : id.join(','),
    timestamp: Date.now()
  })
  return data.songs
}

export const getPlayList = async (
  id: number
): Promise<SongInteface.SongState['playlist']> => {
  const data = await get<{ playlist: SongInteface.SongState['playlist'] }>(
    '/api/playlist/detail',
    {
      id
    }
  )
  return data.playlist
}

export const getAlbumList = async (
  id: number
): Promise<{ songs: SongsDetail[]; album: Albums }> => {
  const data = await get<{ songs: SongsDetail[]; album: Albums }>(
    '/api/album',
    {
      id
    }
  )
  return data
}
