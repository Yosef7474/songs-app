import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';

// Global styles component
export const GlobalStylesComponent = () => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f1f5f9;
        color: #334155;
        line-height: 1.6;
      }
      code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
          monospace;
      }
    `}
  />
);

// Layout components - REMOVED ALL COMPONENT SELECTORS
export const AppContainer = styled.div`
  min-height: 100vh;
  padding: 1.5rem;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

export const HeaderTitle = styled.h1`
  color: #2563eb;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
`;

export const HeaderSubtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

export const Main = styled.main`
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  /* Simple media query without component selectors */
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

// Create a separate component for full-width sections
export const FullWidthSection = styled.section`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  
  @media (min-width: 768px) {
    grid-column: 1 / -1;
  }
`;

export const Section = styled.section`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;