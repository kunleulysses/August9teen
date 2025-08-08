const { createGlobalStyle } = require('styled-components');

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
    color: #ffffff;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .glow {
    filter: drop-shadow(0 0 20px rgba(64, 224, 255, 0.3));
    transition: filter 0.3s ease;
  }

  .glow:hover {
    filter: drop-shadow(0 0 30px rgba(64, 224, 255, 0.6));
  }

  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.8s ease forwards;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

module.exports = { GlobalStyles };