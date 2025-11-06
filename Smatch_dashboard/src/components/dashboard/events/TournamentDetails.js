import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Form, Card } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { getTournamentById, getTournamentTeams, createJoinRequest } from '../../../Services/TournamentService';
import './TournamentDetails.css';

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isOrganizer = localStorage.getItem('role') === 'organizer';

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const tournamentData = await getTournamentById(id);
        const teamsData = await getTournamentTeams(id);
        setTournament(tournamentData);
        setTeams(teamsData.teams);
        setJoinRequests(teamsData.joinRequests);
      } catch (err) {
        setError('Erreur lors de la récupération des données du tournoi');
      } finally {
        setLoading(false);
      }
    };
    fetchTournamentData();
  }, [id]);

  const handleJoinRequest = async (e) => {
    e.preventDefault();
    try {
      await createJoinRequest(id, teamId);
      setJoinRequests([...joinRequests, { teamId, teamName: 'Équipe en attente', status: 'pending', createdAt: new Date() }]);
      setTeamId('');
      setError(null);
      alert('Demande d\'inscription envoyée avec succès !');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi de la demande d\'inscription');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return <Container><div className="loading-spinner"></div></Container>;
  }

  if (!tournament) {
    return <Container><Alert variant="danger">Tournoi non trouvé</Alert></Container>;
  }

  return (
    <Container fluid className="tournament-details">
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <h2>{tournament.name}</h2>
          <p><FaCalendarAlt /> Début: {formatDate(tournament.startDate)}</p>
          <p><FaCalendarAlt /> Fin: {formatDate(tournament.endDate)}</p>
          <p><FaMapMarkerAlt /> Lieu: {tournament.location}</p>
          <p>Type: {tournament.tournamentType}</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h3>Équipes participantes ({teams.length}/{tournament.numberTeam})</h3>
          {teams.length === 0 ? (
            <p>Aucune équipe inscrite pour le moment.</p>
          ) : (
            <Row>
              {teams.map((team) => (
                <Col xs={12} md={6} lg={4} key={team.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{team.teamName}</Card.Title>
                      <Card.Text>Joueurs: {team.playerCount}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>


        <Row>
          <Col>
            <h3>Demandes d'inscription ({joinRequests.length})</h3>
            {joinRequests.length === 0 ? (
              <p>Aucune demande en attente.</p>
            ) : (
              <ul>
                {joinRequests.map((request) => (
                  <li key={request.teamId}>
                    {request.teamName} - Statut: {request.status} (Envoyée le {formatDate(request.createdAt)})
                  </li>
                ))}
              </ul>
            )}
          </Col>
        </Row>
    </Container>
  );
};

export default TournamentDetails;