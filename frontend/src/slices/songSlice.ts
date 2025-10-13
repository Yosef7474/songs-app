import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song, SongFormData, Statistics, Filters } from '../types/song';

interface SongState {
  songs: Song[];
  currentSong: Song | null;
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;
  filters: Filters;
}

const initialState: SongState = {
  songs: [],
  currentSong: null,
  statistics: null,
  loading: false,
  error: null,
  filters: {
    genre: '',
    artist: '',
    album: '',
  },
};

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Songs actions
    getSongsRequest: (state, action: PayloadAction<Filters | undefined>) => {
      state.loading = true;
      state.error = null;
    },
    getSongsSuccess: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
      state.loading = false;
    },
    getSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Song CRUD actions
    createSongRequest: (state, action: PayloadAction<SongFormData>) => {
      state.loading = true;
      state.error = null;
    },
    createSongSuccess: (state, action: PayloadAction<Song>) => {
      state.songs.push(action.payload);
      state.loading = false;
    },
    createSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateSongRequest: (state, action: PayloadAction<{ id: string; data: SongFormData }>) => {
      state.loading = true;
      state.error = null;
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      const index = state.songs.findIndex(song => song._id === action.payload._id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
      state.loading = false;
    },
    updateSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteSongRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.songs = state.songs.filter(song => song._id !== action.payload);
      state.loading = false;
    },
    deleteSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Statistics actions
    getStatisticsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getStatisticsSuccess: (state, action: PayloadAction<Statistics>) => {
      state.statistics = action.payload;
      state.loading = false;
    },
    getStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Filter actions
    setFilter: (state, action: PayloadAction<{ key: keyof Filters; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    clearFilters: (state) => {
      state.filters = { genre: '', artist: '', album: '' };
    },
  },
});

export const {
  setLoading,
  setError,
  getSongsRequest,
  getSongsSuccess,
  getSongsFailure,
  createSongRequest,
  createSongSuccess,
  createSongFailure,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailure,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailure,
  getStatisticsRequest,
  getStatisticsSuccess,
  getStatisticsFailure,
  setFilter,
  clearFilters,
} = songSlice.actions;

export default songSlice.reducer;