import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from "../../../imgs/logo.png";
import { MdEvent } from "react-icons/md";
import { FaVolleyballBall } from "react-icons/fa";
import { MdOutlineSell } from "react-icons/md";
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      }
    };

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && !isOpen) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) {
      setIsHovered(false);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isMobile && (
        <button
          className={`sidebar-toggle ${isOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={24} className="rotate-icon" /> : <Menu size={24} className="rotate-icon" />}
        </button>
      )}

      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <div
        className={`sidebar ${isOpen || isHovered ? 'open slide-in-left' : 'slide-out-left'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='logoSmatch fade-in'>
          <img src={logo} alt='logo' />
          <div className="sidebar-header">
            <h1 onClick={() => navigate('/')}>DASHBOARD</h1>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3><MdEvent /> Événements</h3>
            <NavLink
              to="/events"
              className={({ isActive }) => (isActive ? 'active fade-in-up' : 'fade-in-up')}
              onClick={handleLinkClick}
              style={{ '--i': 0 }}
            >
              Tournois
            </NavLink>
          </div>

          <div className="sidebar-section fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3><FaVolleyballBall /> Volley</h3>
            <NavLink
              to="/players"
              className={({ isActive }) => (isActive ? 'active fade-in-up' : 'fade-in-up')}
              onClick={handleLinkClick}
              style={{ '--i': 1 }}
            >
              Joueurs
            </NavLink>
            <NavLink
              to="/matches"
              className={({ isActive }) => (isActive ? 'active fade-in-up' : 'fade-in-up')}
              onClick={handleLinkClick}
              style={{ '--i': 2 }}
            >
              Matchs
            </NavLink>
            <NavLink
              to="/teams"
              className={({ isActive }) => (isActive ? 'active fade-in-up' : 'fade-in-up')}
              onClick={handleLinkClick}
              style={{ '--i': 3 }}
            >
              Equipes
            </NavLink>
          </div>

          <div className="sidebar-section fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3><MdOutlineSell /> Vente</h3>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? 'active fade-in-up' : 'fade-in-up')}
              onClick={handleLinkClick}
              style={{ '--i': 4 }}
            >
              Produits
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) => (isActive ? 'active fade-in-up' : 'fade-in-up')}
              onClick={handleLinkClick}
              style={{ '--i': 5 }}
            >
              Commandes
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) => (isActive ? 'active fade-in-up' : 'fade-in-up')}
              onClick={handleLinkClick}
              style={{ '--i': 6 }}
            >
              Categories
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;