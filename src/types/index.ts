export interface Song {
  id: string;
  name: string;
  type: string;
  year: string;
  releaseDate: string | null;
  duration: number;
  label: string;
  explicitContent: boolean;
  playCount: number;
  language: string;
  hasLyrics: boolean;
  lyricsId: string | null;
  url: string;
  copyright: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  artists: {
    primary: Artist[];
    featured: Artist[];
    all: Artist[];
  };
  image: Image[];
  downloadUrl: DownloadUrl[];
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  image: Image[];
  type: string;
  url: string;
}

export interface Image {
  quality: string;
  url: string;
}

export interface DownloadUrl {
  quality: string;
  url: string;
}

export interface Album {
  id: string;
  name: string;
  year: string;
  type: string;
  playCount: number;
  language: string;
  explicitContent: boolean;
  songCount: number;
  url: string;
  primaryArtists: Artist[];
  featuredArtists: Artist[];
  artists: Artist[];
  image: Image[];
  songs: Song[];
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  songCount: number;
  username: string;
  firstname: string;
  lastname: string;
  language: string;
  followerCount: number;
  url: string;
  image: Image[];
  songs: Song[];
}

export interface SearchResult {
  topQuery: {
    results: any[];
    position: number;
  };
  songs: {
    results: Song[];
    position: number;
  };
  albums: {
    results: Album[];
    position: number;
  };
  artists: {
    results: Artist[];
    position: number;
  };
  playlists: {
    results: Playlist[];
    position: number;
  };
}

export interface CustomPlaylist {
  id: string;
  name: string;
  createdAt: number;
  songs: Song[];
}
