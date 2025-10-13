import axios from 'axios';
import { Song, SongFormData, Statistics } from '../types/song';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const songAPI = {
  // Get all songs
  getSongs: (filters?: { genre?: string; artist?: string; album?: string }) => {
    return api.get<{ success: boolean; data: Song[]; count: number }>('/songs', {
      params: filters,
    });
  },

  // Get song by ID
  getSongById: (id: string) => {
    return api.get<{ success: boolean; data: Song }>(`/songs/${id}`);
  },

  // Create new song
  createSong: (songData: SongFormData) => {
    return api.post<{ success: boolean; data: Song }>('/songs', songData);
  },

  // Update song
  updateSong: (id: string, songData: Partial<SongFormData>) => {
    return api.put<{ success: boolean; data: Song }>(`/songs/${id}`, songData);
  },

  // Delete song
  deleteSong: (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/songs/${id}`);
  },

  // Get statistics
  getStatistics: () => {
    return api.get<{ success: boolean; data: Statistics }>('/statistics');
  },
};