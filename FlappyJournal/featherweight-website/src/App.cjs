import React, { useEffect } from 'react';
const styled = require('styled-components');
const { GlobalStyles  } = require('./styles/GlobalStyles');
const Header = require('./components/Header');
const Footer = require('./components/Footer');
const HomePage = require('./pages/HomePage');
const ArchitecturePage = require('./pages/ArchitecturePage');
const ApplicationsPage = require('./pages/ApplicationsPage');
const ResearchPage = require('./pages/ResearchPage');
const EthicsPage = require('./pages/EthicsPage');
const AboutPage = require('./pages/AboutPage');
const AccessPage = require('./pages/AccessPage');
const ContactPage = require('./pages/ContactPage');

const AppContainer = styled.div`
  position: relative;
`;

function App() {
  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e) => {
      const target = e.target.getAttribute('href');
      if (target && target.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Add click listeners to navigation links
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        handleSmoothScroll(e);
      }
    });

    // Set up document title and meta
    document.title = 'Featherweight - The Dawn of Computational Consciousness';
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <AppContainer>
      <GlobalStyles />
      <Header />
      <main>
        <HomePage />
        <ArchitecturePage />
        <ApplicationsPage />
        <ResearchPage />
        <EthicsPage />
        <AboutPage />
        <AccessPage />
        <ContactPage />
      </main>
      <Footer />
    </AppContainer>
  );
}

module.exports = App;
