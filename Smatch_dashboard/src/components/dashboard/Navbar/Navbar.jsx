import React, { useState, useEffect } from 'react';
import logo from '../../../imgs/smatch.png';
import { LuLogOut } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { fetchUserById, getUserIdFromToken } from '../../../Services/UserService';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const defaultProfilePicture = 'https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await getUserIdFromToken();
        if (userId) {
          const userData = await fetchUserById(userId);
          setUserName(userData.username || `${userData.name}`);
          setProfilePicture(userData.profilePicture || defaultProfilePicture);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  if (loading) {
    return null;
  }

  return (
    <MDBNavbar expand="lg" className="fixed-top slide-down">
      <MDBContainer fluid>
        <MDBNavbarBrand href="#!" className="fade-in">
          <img src={logo} height="40" alt="logo" />
        </MDBNavbarBrand>

        <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
          <MDBNavbarItem>
            <MDBDropdown>
              <MDBDropdownToggle tag="a" className="nav-link" role="button">
                <img
                  src={profilePicture}
                  className="rounded-circle"
                  height="22"
                  alt="user"
                  onError={(e) => (e.target.src = defaultProfilePicture)} 
                />
              </MDBDropdownToggle>
              <MDBDropdownMenu className="fade-in-scale">
                <MDBDropdownItem header>{userName}</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => navigate('/profile')}>
                  <CgProfile /> My profile
                </MDBDropdownItem>
                <MDBDropdownItem link onClick={handleLogout}>
                  <LuLogOut /> Logout
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarItem>
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Navbar;