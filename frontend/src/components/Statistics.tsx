import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../stores';
import { getStatisticsRequest } from '../slices/songSlice';
import styled from '@emotion/styled';

const StatsContainer = styled.div`
  padding: 20px;
  height: 600px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
`;

const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const StatsTitle = styled.h2`
  color: #1e293b;
  margin: 0;
  font-size: 1.8rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  border-left: 4px solid #2563eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  color: #1e293b;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  text-align: center;
`;

const MiniTable = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const MiniTableHeader = styled.div`
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
`;

const MiniTableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:nth-of-type(even) {
    background-color: #f8fafc;
  }
`;

const MiniTableCell = styled.div`
  padding: 0.25rem 0;
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

const RecentActivityCard = styled(StatCard)`
  border-left-color: #10b981;
  max-width: 400px;
  margin: 0 auto;
`;

const Statistics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { statistics, loading, error } = useSelector((state: RootState) => state.songs);

  useEffect(() => {
    dispatch(getStatisticsRequest());
  }, [dispatch]);

  if (loading) {
    return (
      <StatsContainer>
        <StatsHeader>
          <StatsTitle>Statistics</StatsTitle>
        </StatsHeader>
        <LoadingState>Loading statistics...</LoadingState>
      </StatsContainer>
    );
  }

  if (error) {
    return (
      <StatsContainer>
        <StatsHeader>
          <StatsTitle>Statistics</StatsTitle>
        </StatsHeader>
        <ErrorState>Error: {error}</ErrorState>
      </StatsContainer>
    );
  }

  if (!statistics) {
    return (
      <StatsContainer>
        <StatsHeader>
          <StatsTitle>Statistics</StatsTitle>
        </StatsHeader>
        <div>No statistics available.</div>
      </StatsContainer>
    );
  }

  return (
    <StatsContainer>
      <StatsHeader>
        <StatsTitle>📊 Music Statistics</StatsTitle>
      </StatsHeader>
      
      <StatsGrid>
        <StatCard>
          <StatNumber>{statistics.total.songs}</StatNumber>
          <StatLabel>Total Songs</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{statistics.total.artists}</StatNumber>
          <StatLabel>Artists</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{statistics.total.albums}</StatNumber>
          <StatLabel>Albums</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{statistics.total.genres}</StatNumber>
          <StatLabel>Genres</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartContainer>
          <ChartTitle>🎵 Songs by Genre</ChartTitle>
          <MiniTable>
            <MiniTableHeader>Genre Distribution</MiniTableHeader>
            {statistics.songsPerGenre.slice(0, 5).map((genreStat) => (
              <MiniTableRow key={genreStat._id}>
                <MiniTableCell>{genreStat._id}</MiniTableCell>
                <MiniTableCell>{genreStat.count} songs</MiniTableCell>
              </MiniTableRow>
            ))}
          </MiniTable>
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>👤 Top Artists</ChartTitle>
          <MiniTable>
            <MiniTableHeader>Artist Stats</MiniTableHeader>
            {statistics.artistStats.slice(0, 5).map((artistStat) => (
              <MiniTableRow key={artistStat.artist}>
                <MiniTableCell>{artistStat.artist}</MiniTableCell>
                <MiniTableCell>{artistStat.songCount} songs</MiniTableCell>
              </MiniTableRow>
            ))}
          </MiniTable>
        </ChartContainer>
      </ChartsGrid>

      <RecentActivityCard>
        <StatNumber style={{ color: '#10b981' }}>
          {statistics.recentAdditions}
        </StatNumber>
        <StatLabel>Songs Added (Last 30 Days)</StatLabel>
      </RecentActivityCard>
    </StatsContainer>
  );
};

export default Statistics;