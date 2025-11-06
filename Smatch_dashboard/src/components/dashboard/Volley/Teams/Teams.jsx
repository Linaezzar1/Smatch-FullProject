import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, InputGroup, Modal } from 'react-bootstrap';
import { IoSearchOutline } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa';
import './Teams.css';
import { getAllTeams } from '../../../../Services/TeamService';
import { getAllUsers } from '../../../../Services/UserService';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, usersData] = await Promise.all([
          getAllTeams(),
          getAllUsers(),
        ]);
        const validUsers = usersData.filter((user) => ['player', 'user'].includes(user.role));
        setTeams(teamData);
        setUsers(validUsers);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewPlayers = (team) => {
    setSelectedTeam(team);
    setShowPlayersModal(true);
  };

  const handleClosePlayersModal = () => {
    setShowPlayersModal(false);
    setSelectedTeam(null);
  };

  const filteredTeams = teams.filter((team) =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (team.teamLeader && team.teamLeader.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (team.players && team.players.some((p) => p.firstName?.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Container fluid className="matches-dashboard">
      <Row className="mb-4 align-items-center with-separator">
        <Col xs={12} md={6}>
          <h2 className="title">Gestion des Équipes</h2>
        </Col>
        <Col xs={12} md={6}>
          <InputGroup className="short-search">
            <InputGroup.Text>
              <IoSearchOutline />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </InputGroup>
        </Col>
      </Row>

      <Modal show={showPlayersModal} onHide={handleClosePlayersModal} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Joueurs de {selectedTeam?.teamName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTeam?.players && selectedTeam.players.length > 0 ? (
            <ul>
              {selectedTeam.players.map((player, index) => (
                <li key={index}>{player.name || `Joueur ${index + 1}`}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun joueur dans cette équipe.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePlayersModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col>
          <Table className="match-table">
            <thead>
              <tr>
                <th>Nom de l'Équipe</th>
                <th>Leader</th>
                <th>Joueurs</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {currentTeams.map((team) => (
                <tr key={team._id} className="fade-in-row">
                  <td>{team.teamName}</td>
                  <td>{team.teamLeader ? `${team.teamLeader.name}` : 'N/A'}</td>
                  <td>
                    <Button
                      variant="link"
                      className="view-players-button"
                      onClick={() => handleViewPlayers(team)}
                    >
                      <FaEye /> Voir les joueurs
                    </Button>
                  </td>
                  <td>{team.teamType}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <nav aria-label="Page navigation example">
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
    </Container>
  );
};

export default Teams;