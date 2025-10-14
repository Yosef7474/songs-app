import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../stores';
import { createSongRequest, updateSongRequest, setError } from '../slices/songSlice';
import { Song, SongFormData } from '../types/song';
import styled from '@emotion/styled';

const FormContainer = styled.div`
  width: 100%;
`;

const FormTitle = styled.h2`
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  padding-right: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const GenreSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const GenreSuggestion = styled.button`
  padding: 0.25rem 0.75rem;
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
    color: white;
    border-color: #2563eb;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;

  &:hover:not(:disabled) {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  font-size: 0.875rem;
  padding: 0.75rem;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.375rem;
`;

const initialFormData: SongFormData = {
  title: '',
  artist: '',
  album: '',
  genre: '',
};

// Common genres for suggestions
const COMMON_GENRES = ['pop', 'rock', 'hip-hop', 'jazz', 'classical', 'electronic', 'reggae', 'country', 'r&b', 'metal', 'folk', 'blues', 'latin', 'k-pop', 'indie']



interface SongFormProps {
  editingSong?: Song | null;
  onCancelEdit?: () => void;
  onSuccess?: () => void;
}

const SongForm: React.FC<SongFormProps> = ({ editingSong, onCancelEdit, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.songs);
  
  const [formData, setFormData] = useState<SongFormData>(initialFormData);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (editingSong) {
      setFormData({
        title: editingSong.title,
        artist: editingSong.artist,
        album: editingSong.album,
        genre: editingSong.genre,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingSong]);

  useEffect(() => {
    if (error) {
      setSuccessMessage('');
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreSuggestion = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: genre,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.artist.trim() || !formData.album.trim() || !formData.genre.trim()) {
      dispatch(setError('All fields are required'));
      return;
    }

    if (editingSong) {
      dispatch(updateSongRequest({ 
        id: editingSong._id, 
        data: formData 
      }));
    } else {
      dispatch(createSongRequest(formData));
    }

    setSuccessMessage(editingSong ? 'Song updated successfully!' : 'Song created successfully!');
    setFormData(initialFormData);
    
    if (onSuccess) {
      onSuccess();
    }
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    dispatch(setError(null));
    setSuccessMessage('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <FormContainer>
      <FormTitle>{editingSong ? 'Edit Song' : 'Add New Song'}</FormTitle>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title *</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter song title"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="artist">Artist *</Label>
          <Input
            type="text"
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            placeholder="Enter artist name"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="album">Album *</Label>
          <Input
            type="text"
            id="album"
            name="album"
            value={formData.album}
            onChange={handleChange}
            placeholder="Enter album name"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="genre">Genre *</Label>
          <Input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Enter genre"
            required
          />
          <GenreSuggestions>
            {COMMON_GENRES.map((genre) => (
              <GenreSuggestion
                key={genre}
                type="button"
                onClick={() => handleGenreSuggestion(genre)}
              >
                {genre}
              </GenreSuggestion>
            ))}
          </GenreSuggestions>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <ButtonGroup>
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : editingSong ? 'Update Song' : 'Add Song'}
          </PrimaryButton>
          {(editingSong || onCancelEdit) && (
            <SecondaryButton type="button" onClick={handleCancel}>
              Cancel
            </SecondaryButton>
          )}
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default SongForm;