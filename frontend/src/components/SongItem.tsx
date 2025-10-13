import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../stores';
import { deleteSongRequest } from '../slices/songSlice';
import { Song } from '../types/song';
import styled from '@emotion/styled';

const SongCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const SongHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const SongTitle = styled.h3`
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  line-height: 1.4;
`;

const Artist = styled.p`
  color: #2563eb;
  font-weight: 500;
  margin: 0.5rem 0;
  font-size: 0.95rem;
`;

const Details = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.25rem 0;
`;

const GenreBadge = styled.span`
  background-color: #2563eb;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f59e0b;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;

  &:hover {
    background-color: #d97706;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;

  &:hover {
    background-color: #dc2626;
  }
`;

interface SongItemProps {
  song: Song;
  onEdit: (song: Song) => void;
}

const SongItem: React.FC<SongItemProps> = ({ song, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
      dispatch(deleteSongRequest(song._id));
    }
  };

  const handleEdit = () => {
    onEdit(song);
  };

  return (
    <SongCard>
      <SongHeader>
        <SongTitle>{song.title}</SongTitle>
        <GenreBadge>{song.genre}</GenreBadge>
      </SongHeader>
      
      <Artist>👤 {song.artist}</Artist>
      <Details>💿 {song.album}</Details>
      
      <ActionButtons>
        <EditButton onClick={handleEdit}>
          Edit
        </EditButton>
        <DeleteButton onClick={handleDelete}>
          Delete
        </DeleteButton>
      </ActionButtons>
    </SongCard>
  );
};

export default SongItem;