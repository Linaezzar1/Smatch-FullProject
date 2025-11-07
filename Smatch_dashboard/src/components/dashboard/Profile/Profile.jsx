import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { GoArrowRight } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import * as UserService from '../../../Services/UserService';

const Profile = () => {
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await UserService.getUserIdFromToken();
        
        if (!userId) {
          setError('Utilisateur non connecté. Veuillez vous connecter.');
          setLoading(false);
          return;
        }

        const user = await UserService.fetchUserById(userId);
        setUserData({
          email: user.email || '',
          name: user.name || '',
          phone: user.phone || '',
          address: user.address || '',
        });
      } catch (err) {
        setError(`Erreur: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    let successTimeout;
    if (success) {
      successTimeout = setTimeout(() => setSuccess(null), 3000);
    }
    return () => clearTimeout(successTimeout);
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const userId = await UserService.getUserIdFromToken();
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      const updateData = {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
      };

      const updatedUser = await UserService.updateUser(userId, updateData);
      
      setUserData((prev) => ({
        ...prev,
        ...updatedUser,
      }));

      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card fade-in-scale">
        <h2 className="title">Mettre à jour votre profil</h2>
        <p>Modifiez vos informations personnelles</p>
        
        {error && <div className="alert alert-danger slide-in">{error}</div>}
        {success && <div className="alert alert-success slide-in">{success}</div>}

        <Form>
          <Form.Group className="mb-3 fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userData.email}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Form.Label>Nom complet</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="update-btn fade-in-up"
            onClick={handleUpdate}
            disabled={loading}
            style={{ animationDelay: '0.5s' }}
          >
            {loading ? 'En cours...' : 'Mettre à jour'} <span><GoArrowRight /></span>
          </Button>
          <a
            href="#!"
            className="cancel-link fade-in-up"
            onClick={handleCancel}
            style={{ animationDelay: '0.6s' }}
          >
            Annuler
          </a>
        </Form>
      </div>
    </div>
  );
};

export default Profile;