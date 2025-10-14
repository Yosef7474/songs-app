import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../stores';
import { getSongsRequest, setFilter, clearFilters } from '../slices/songSlice';
import SongItem from './SongItem';
import SongForm from './SongForm';
import { Song, Filters } from '../types/song';
import styled from '@emotion/styled';

const ListContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`;

const PageTitle = styled.h2`
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const FilterSection = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const GenreButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1rem;
  background-color: ${props => props.active ? '#2563eb' : '#f1f5f9'};
  color: ${props => props.active ? 'white' : '#475569'};
  border: 1px solid ${props => props.active ? '#2563eb' : '#e2e8f0'};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;

  &:hover {
    background-color: ${props => props.active ? '#1d4ed8' : '#e2e8f0'};
    transform: translateY(-1px);
  }
`;

const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-top: 0.5rem;

  &:hover {
    background-color: #4b5563;
    transform: translateY(-1px);
  }
`;

const SongsGrid = styled.div`
  display: grid;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  
  p {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #2563eb;
  font-size: 1.1rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #ef4444;
  font-size: 1.1rem;
`;

const SongCount = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  
  &:hover {
    color: #374151;
  }
`;

// Common music genres with proper capitalization for display
const GENRES = [
  'pop',
  'rock',
  'hip-Hop',
  'jazz',
  'classical',
  'electronic',
  'reggae',
  'country',
  'r&B',
  'metal',
  'folk',
  'blues',
  'latin',
  'k-Pop',
  'indie'
];

// Function to normalize genre for API calls (lowercase)
const normalizeGenreForAPI = (genre: string): string => {
  return genre.toLowerCase();
};

// Function to get display genre (proper capitalization)
const getDisplayGenre = (genre: string): string => {
  const foundGenre = GENRES.find(g => g.toLowerCase() === genre.toLowerCase());
  return foundGenre || genre;
};

const SongList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { songs, loading, error, filters } = useSelector((state: RootState) => state.songs);
  
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Fetch all songs on component mount
  useEffect(() => {
    dispatch(getSongsRequest());
  }, [dispatch]);

  // Handle genre filter changes
  useEffect(() => {
    if (selectedGenre) {
      // Apply genre filter with normalized genre name
      const normalizedGenre = normalizeGenreForAPI(selectedGenre);
      dispatch(getSongsRequest({ genre: normalizedGenre, artist: '', album: '' }));
    } else {
      // Show all songs
      dispatch(getSongsRequest());
    }
  }, [selectedGenre, dispatch]);

  const handleGenreSelect = (genre: string) => {
    if (selectedGenre === genre) {
      // If clicking the same genre, clear the filter
      setSelectedGenre('');
      dispatch(clearFilters());
    } else {
      setSelectedGenre(genre);
      const normalizedGenre = normalizeGenreForAPI(genre);
      dispatch(setFilter({ key: 'genre', value: normalizedGenre }));
    }
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    dispatch(clearFilters());
    dispatch(getSongsRequest());
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingSong(null);
    setShowModal(false);
  };

  const handleEditSuccess = () => {
    setEditingSong(null);
    setShowModal(false);
    // Refresh the current view (filtered or all)
    if (selectedGenre) {
      const normalizedGenre = normalizeGenreForAPI(selectedGenre);
      dispatch(getSongsRequest({ genre: normalizedGenre, artist: '', album: '' }));
    } else {
      dispatch(getSongsRequest());
    }
  };

  if (loading && songs.length === 0) {
    return (
      <ListContainer>
        <PageTitle>Song Library</PageTitle>
        <LoadingState>Loading songs...</LoadingState>
      </ListContainer>
    );
  }

  if (error && songs.length === 0) {
    return (
      <ListContainer>
        <PageTitle>Song Library</PageTitle>
        <ErrorState>Error: {error}</ErrorState>
      </ListContainer>
    );
  }

  return (
    <>
      <ListContainer>
        <PageTitle>Song Library</PageTitle>
        
        <FilterSection>
          <FilterTitle>Filter by Genre</FilterTitle>
          <SongCount>
            {selectedGenre ? 
              `Showing ${songs.length} ${songs.length === 1 ? 'song' : 'songs'} in ${getDisplayGenre(selectedGenre)}` :
              `Showing all ${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`
            }
          </SongCount>
          
          <GenreGrid>
            {GENRES.map((genre) => (
              <GenreButton
                key={genre}
                active={selectedGenre === genre}
                onClick={() => handleGenreSelect(genre)}
              >
                {genre}
              </GenreButton>
            ))}
          </GenreGrid>
          
          {selectedGenre && (
            <ClearButton onClick={handleClearFilters}>
              Show All Songs
            </ClearButton>
          )}
        </FilterSection>

        {songs.length === 0 ? (
          <EmptyState>
            <p>No songs found.</p>
            {selectedGenre ? (
              <p>No {getDisplayGenre(selectedGenre)} songs in your library.</p>
            ) : (
              <p>Add your first song using the form above!</p>
            )}
          </EmptyState>
        ) : (
          <SongsGrid>
            {songs.map((song: Song) => (
              <SongItem 
                key={song._id} 
                song={song} 
                onEdit={handleEdit}
              />
            ))}
          </SongsGrid>
        )}
      </ListContainer>

      {/* Edit Song Modal */}
      {showModal && (
        <ModalOverlay onClick={handleCancelEdit}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCancelEdit}>&times;</CloseButton>
            <SongForm 
              editingSong={editingSong}
              onCancelEdit={handleCancelEdit}
              onSuccess={handleEditSuccess}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default SongList;