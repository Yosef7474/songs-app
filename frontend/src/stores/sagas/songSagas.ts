import { call, put, takeEvery } from 'redux-saga/effects';
import { songAPI } from '../../services/api';
import {
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
} from '../../slices/songSlice';
import { SongFormData, Song, Filters } from '../../types/song';

// Worker Sagas
function* fetchSongsSaga(action: ReturnType<typeof getSongsRequest>): Generator<any, void, any> {
  try {
    const filters: Filters = action.payload || { genre: '', artist: '', album: '' };
    const response = yield call(songAPI.getSongs, filters);
    const songs: Song[] = response.data.data;
    yield put(getSongsSuccess(songs));
  } catch (error: any) {
    yield put(getSongsFailure(error.response?.data?.message || 'Failed to fetch songs'));
  }
}

function* createSongSaga(action: ReturnType<typeof createSongRequest>): Generator<any, void, any> {
  try {
    const songData: SongFormData = action.payload;
    const response = yield call(songAPI.createSong, songData);
    const newSong: Song = response.data.data;
    yield put(createSongSuccess(newSong));
    // Refresh statistics after creation
    yield put(getStatisticsRequest());
  } catch (error: any) {
    yield put(createSongFailure(error.response?.data?.message || 'Failed to create song'));
  }
}

function* updateSongSaga(action: ReturnType<typeof updateSongRequest>): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const response = yield call(songAPI.updateSong, id, data);
    const updatedSong: Song = response.data.data;
    yield put(updateSongSuccess(updatedSong));
    // Refresh statistics after update
    yield put(getStatisticsRequest());
  } catch (error: any) {
    yield put(updateSongFailure(error.response?.data?.message || 'Failed to update song'));
  }
}

function* deleteSongSaga(action: ReturnType<typeof deleteSongRequest>): Generator<any, void, any> {
  try {
    const songId: string = action.payload;
    yield call(songAPI.deleteSong, songId);
    yield put(deleteSongSuccess(songId));
    // Refresh statistics after deletion
    yield put(getStatisticsRequest());
  } catch (error: any) {
    yield put(deleteSongFailure(error.response?.data?.message || 'Failed to delete song'));
  }
}

function* fetchStatisticsSaga(action: ReturnType<typeof getStatisticsRequest>): Generator<any, void, any> {
  try {
    const response = yield call(songAPI.getStatistics);
    const statistics = response.data.data;
    yield put(getStatisticsSuccess(statistics));
  } catch (error: any) {
    yield put(getStatisticsFailure(error.response?.data?.message || 'Failed to fetch statistics'));
  }
}

// Watcher Saga
function* songSaga() {
  yield takeEvery(getSongsRequest.type, fetchSongsSaga);
  yield takeEvery(createSongRequest.type, createSongSaga);
  yield takeEvery(updateSongRequest.type, updateSongSaga);
  yield takeEvery(deleteSongRequest.type, deleteSongSaga);
  yield takeEvery(getStatisticsRequest.type, fetchStatisticsSaga);
}

export default songSaga;