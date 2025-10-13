import React from 'react';
import { Provider } from 'react-redux';
import { store } from './stores';
import SongList from './components/SongList';
import SongForm from './components/SongForm';
import Statistics from './components/Statistics';
import { 
  GlobalStylesComponent, 
  AppContainer, 
  Header, 
  HeaderTitle, 
  HeaderSubtitle, 
  Main, 
  Section,
  FullWidthSection 
} from './styles/GlobalStyle';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStylesComponent />
      <AppContainer>
        <Header>
          <HeaderTitle>🎵 Songs </HeaderTitle>
          <HeaderSubtitle>Manage your music collection with ease</HeaderSubtitle>
        </Header>
        
        <Main>
          {/* Song Library at the top - full width without fixed height */}
          <FullWidthSection>
            <SongList />
          </FullWidthSection>
          
          {/* Form and Statistics side by side */}
          <Section>
            <SongForm />
          </Section>
          
          <Section>
            <Statistics />
          </Section>
        </Main>
      </AppContainer>
    </Provider>
  );
};

export default App;