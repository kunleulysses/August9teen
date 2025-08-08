const React = require('react');
const styled = require('styled-components');

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(20px);
  z-index: 1000;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(64, 224, 255, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #40e0ff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 10px rgba(64, 224, 255, 0.5));
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: #40e0ff;
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #40e0ff, #ff6b9d);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <Nav>
        <Logo onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          FEATHERWEIGHT
        </Logo>
        <NavLinks>
          <NavLink href="#architecture">Architecture</NavLink>
          <NavLink href="#applications">Applications</NavLink>
          <NavLink href="#research">Research</NavLink>
          <NavLink href="#access">Access</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
}

module.exports = Header;