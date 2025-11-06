import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, InputGroup, Form, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { IoSearchOutline } from 'react-icons/io5';
import { FiEdit2 } from 'react-icons/fi';
import './Events.css';
import { getAllTournaments, deleteTournament } from '../../../Services/TournamentService';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [itemsPerPage] = useState(6); // Nombre d'événements par page (3 colonnes x 2 lignes)

  // Simuler la vérification du rôle
  const isOrganizer = localStorage.getItem('role') === 'organizer';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const tournaments = await getAllTournaments();
        const mappedEvents = tournaments.map((tournament) => ({
          id: tournament._id,
          title: tournament.name,
          date: tournament.startDate,
          location: tournament.location,
          endDate: tournament.endDate,
          tournamentType: tournament.tournamentType,
          photo: tournament.photo
        }));
        setEvents(mappedEvents);
      } catch (err) {
        setError('Erreur lors de la récupération des événements');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (confirmDelete === eventId) {
      try {
        await deleteTournament(eventId);
        setEvents(events.filter((event) => event.id !== eventId));
        setConfirmDelete(null);
      } catch (err) {
        setError('Erreur lors de la suppression de l\'événement : ' + (err.message || 'Autorisation requise'));
      }
    } else {
      setConfirmDelete(eventId);
      // Réinitialiser après 3 secondes si pas de confirmation
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleCardClick = (eventId) => {
    navigate(`/tournament/${eventId}`);
  };

  const handleUpdateClick = (eventId) => {
    navigate(`/event-form/${eventId}`);
  };

  const handleAddEvent = () => {
    navigate('/event-form/new');
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileUrl = (path) => {
    const baseURL = 'http://localhost:3000';
    if (!path) return `${baseURL}/default.jpg`;
    const normalizedPath = path.replace(/\\/g, '/');
    return `${baseURL}/${normalizedPath}`;
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading) {
    return (
      <Container fluid className="events-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="events-dashboard">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="error-message">
          {error}
        </Alert>
      )}
      
      <Row className="with-separator top-row">
        <Col xs={12} md={6}>
          <h2>Gestion des Événements</h2>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-md-end">
          <Button variant="primary" className="new-button" onClick={handleAddEvent}>
            <FaPlus /> Nouvel Événement
          </Button>
        </Col>
      </Row>
      
      <Row className="mb-4 align-items-center">
        <Col xs={12}>
          <InputGroup className="short-search">
            <InputGroup.Text>
              <IoSearchOutline />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Rechercher par nom ou lieu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        {filteredEvents.length === 0 ? (
          <Col xs={12} className="text-center py-5">
            <h4>Aucun événement trouvé</h4>
            <p>Essayez de modifier votre recherche ou créez un nouvel événement</p>
          </Col>
        ) : (
          currentEvents.map((event, index) => (
            <Col xs={12} md={6} lg={4} key={event.id} className="mb-4">
              <div className="event-card" onClick={() => handleCardClick(event.id)}>
                <div className="event-card-image">
                  <img src={getFileUrl(event.photo)} alt={event.title} />
                </div>
                <div className="event-card-content">
                  <h3>{event.title}</h3>
                  <p>
                    <FaCalendarAlt className="me-2 text-primary" />
                    <strong>Début:</strong> {formatDate(event.date)}
                  </p>
                  <p>
                    <FaCalendarAlt className="me-2 text-primary" />
                    <strong>Fin:</strong> {formatDate(event.endDate)}
                  </p>
                  <p>
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    <strong>Lieu:</strong> {event.location}
                  </p>
                  <p>{event.tournamentType}</p>
                  
                  <div className="event-card-actions">
                    <Button
                      variant="link"
                      className="circled-button edit-button"
                      onClick={(e) => { e.stopPropagation(); handleUpdateClick(event.id); }}
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </Button>
                    
                    {isOrganizer && (
                      <Button
                        variant="link"
                        className={`circled-button delete-button ${confirmDelete === event.id ? 'bg-danger text-white' : ''}`}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          isOrganizer ? handleDelete(event.id) : setError('Seul un organisateur peut supprimer un événement');
                        }}
                        title={confirmDelete === event.id ? "Confirmer la suppression" : "Supprimer"}
                        disabled={!isOrganizer}
                      >
                        <HiOutlineTrash />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))
        )}
      </Row>
      
      {filteredEvents.length > 0 && (
        <Row className="justify-content-center">
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button className="page-link" onClick={prevPage} disabled={currentPage === 1}>
                  «
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(page)}>
                    {page}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <button className="page-link" onClick={nextPage} disabled={currentPage === totalPages}>
                  »
                </button>
              </li>
            </ul>
          </nav>
        </Row>
      )}
    </Container>
  );
};

export default Events;