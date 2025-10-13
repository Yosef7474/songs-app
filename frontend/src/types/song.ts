export interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
}

export interface SongFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export interface Filters {
  genre: string;
  artist: string;
  album: string;
}

export interface Statistics {
  total: {
    songs: number;
    artists: number;
    albums: number;
    genres: number;
  };
  songsPerGenre: Array<{
    _id: string;
    count: number;
  }>;
  artistStats: Array<{
    artist: string;
    songCount: number;
    albumCount: number;
    albums: string[];
  }>;
  albumStats: Array<{
    artist: string;
    album: string;
    songCount: number;
  }>;
  recentAdditions: number;
}