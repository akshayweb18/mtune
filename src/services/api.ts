import axios from 'axios';
import { SearchResult, Song, Album, Artist, Playlist } from '@/types';

const API_BASE_URL = 'https://saavn.sumit.co/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  params: {
    _format: 'json',
    _marker: 0,
    ctx: 'web6dot0',
  },
});

export const saavnApi = {
  // Global Search
  searchGlobal: async (query: string): Promise<SearchResult> => {
    const { data } = await api.get(`/search`, { params: { query } });
    return data.data;
  },

  // Songs Search
  searchSongs: async (query: string, page = 1, limit = 10) => {
    const { data } = await api.get(`/search/songs`, { params: { query, page, limit } });
    return data.data;
  },

  // Song Details
  getSongDetails: async (id: string): Promise<Song[]> => {
    const { data } = await api.get(`/songs`, { params: { ids: id } });
    return data.data;
  },

  // Song Suggestions
  getSongSuggestions: async (id: string, limit = 10): Promise<Song[]> => {
    const { data } = await api.get(`/songs/${id}/suggestions`, { params: { limit } });
    return data.data;
  },

  // Albums Search
  searchAlbums: async (query: string, page = 1, limit = 10) => {
    const { data } = await api.get(`/search/albums`, { params: { query, page, limit } });
    return data.data;
  },

  // Album Details
  getAlbumDetails: async (id: string): Promise<Album> => {
    const { data } = await api.get(`/albums`, { params: { id } });
    return data.data;
  },

  // Artists Search
  searchArtists: async (query: string, page = 1, limit = 10) => {
    const { data } = await api.get(`/search/artists`, { params: { query, page, limit } });
    return data.data;
  },

  // Artist Details
  getArtistDetails: async (id: string): Promise<Artist> => {
    const { data } = await api.get(`/artists/${id}`);
    return data.data;
  },

  // Artist Songs
  getArtistSongs: async (id: string, page = 1, sortBy = 'popularity', sortOrder = 'desc') => {
    const { data } = await api.get(`/artists/${id}/songs`, { params: { page, sortBy, sortOrder } });
    return data.data;
  },

  // Artist Albums
  getArtistAlbums: async (id: string, page = 1, sortBy = 'popularity', sortOrder = 'desc') => {
    const { data } = await api.get(`/artists/${id}/albums`, { params: { page, sortBy, sortOrder } });
    return data.data;
  },

  // Playlists Search
  searchPlaylists: async (query: string, page = 1, limit = 10) => {
    const { data } = await api.get(`/search/playlists`, { params: { query, page, limit } });
    return data.data;
  },

  // Song Lyrics
  getSongLyrics: async (id: string) => {
    try {
      const { data } = await api.get(`/songs/${id}/lyrics`);
      return data.data;
    } catch {
      return null;
    }
  },

  // Playlist Details
  getPlaylistDetails: async (id: string): Promise<Playlist> => {
    const { data } = await api.get(`/playlists`, { params: { id } });
    return data.data;
  },
};
