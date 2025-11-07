import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, InputGroup, Modal } from 'react-bootstrap';
import { HiOutlineTrash } from 'react-icons/hi2';
import { IoSearchOutline } from 'react-icons/io5';
import { FiEdit2 } from 'react-icons/fi';
import './Matches.css';
import {
  getQuickMatches,
  updateQuickMatch,
  deleteQuickMatch,
} from '../../../../Services/MatchService';
import { getAllTeams } from '../../../../Services/TeamService';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ team1: '', team2: '', score1: '', score2: '', winner: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchData = await getQuickMatches();
        setMatches(matchData);
        const teamData = await getAllTeams();
        setTeams(teamData);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!form.team1 || !form.team2) {
      setError('Les équipes sont requises');
      return;
    }

    if (form.score1 && isNaN(form.score1)) {
      setError('Score 1 doit être un nombre');
      return;
    }
    if (form.score2 && isNaN(form.score2)) {
      setError('Score 2 doit être un nombre');
      return;
    }

    if (form.winner && form.winner !== form.team1 && form.winner !== form.team2) {
      setError('Le vainqueur doit être l\'une des deux équipes');
      return;
    }

    try {
      const matchData = {
        team1: form.team1,
        team2: form.team2,
        score1: form.score1 ? parseInt(form.score1) : null,
        score2: form.score2 ? parseInt(form.score2) : null,
        winner: form.winner || null,
        kind: 'quick',
      };

      const updatedMatch = await updateQuickMatch(editingId, matchData);
      setMatches(matches.map((m) => (m._id === editingId ? updatedMatch : m)));
      setForm({ team1: '', team2: '', score1: '', score2: '', winner: '' });
      setShowModal(false);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du match');
      console.error(err);
    }
  };

  const handleEdit = (matchId) => {
    const matchToEdit = matches.find((m) => m._id === matchId);
    setForm({
      team1: matchToEdit.team1 ? matchToEdit.team1._id : '',
      team2: matchToEdit.team2 ? matchToEdit.team2._id : '',
      score1: matchToEdit.score1 || '',
      score2: matchToEdit.score2 || '',
      winner: matchToEdit.winner ? matchToEdit.winner._id : '',
    });
    setEditingId(matchId);
    setShowModal(true);
  };

  const handleDelete = async (matchId) => {
    try {
      await deleteQuickMatch(matchId);
      setMatches(matches.filter((m) => m._id !== matchId));
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression du match');
      console.error(err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ team1: '', team2: '', score1: '', score2: '', winner: '' });
    setError(null);
  };

  const filteredMatches = matches.filter((match) =>
    (match.team1 && match.team1.teamName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (match.team2 && match.team2.teamName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMatches = filteredMatches.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Container fluid className="matches-dashboard">
      <Row className="mb-4 align-items-center with-separator">
        <Col xs={12} md={6}>
          <h2 className="title">Gestion des Matchs</h2> {/* Ajout de la classe "title" */}
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

      <Modal show={showModal} onHide={handleClose} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Modifier Match</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Équipe 1</Form.Label>
                  <Form.Control
                    as="select"
                    name="team1"
                    value={form.team1}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez une équipe</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.teamName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Équipe 2</Form.Label>
                  <Form.Control
                    as="select"
                    name="team2"
                    value={form.team2}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez une équipe</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.teamName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Control
                  type="number"
                  name="score1"
                  placeholder="Score Équipe 1"
                  value={form.score1}
                  onChange={handleChange}
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  type="number"
                  name="score2"
                  placeholder="Score Équipe 2"
                  value={form.score2}
                  onChange={handleChange}
                />
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Vainqueur</Form.Label>
                  <Form.Control
                    as="select"
                    name="winner"
                    value={form.winner}
                    onChange={handleChange}
                  >
                    <option value="">Aucun vainqueur</option>
                    {form.team1 && form.team2 ? (
                      <>
                        <option value={form.team1}>
                          {teams.find((t) => t._id === form.team1)?.teamName || 'Équipe 1'}
                        </option>
                        <option value={form.team2}>
                          {teams.find((t) => t._id === form.team2)?.teamName || 'Équipe 2'}
                        </option>
                      </>
                    ) : (
                      teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.teamName}
                        </option>
                      ))
                    )}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Mettre à jour
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col>
          <Table className="match-table">
            <thead>
              <tr>
                <th>Équipe 1</th>
                <th>Équipe 2</th>
                <th>Score</th>
                <th>Vainqueur</th>
                <th>Date de Création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMatches.map((match) => (
                <tr key={match._id} className="fade-in-row">
                  <td>{match.team1 ? match.team1.teamName : 'N/A'}</td>
                  <td>{match.team2 ? match.team2.teamName : 'N/A'}</td>
                  <td>{match.score1 !== null && match.score2 !== null ? `${match.score1} - ${match.score2}` : '--'}</td>
                  <td>{match.winner ? match.winner.teamName : 'Aucun'}</td>
                  <td>{new Date(match.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                  <td className="actions">
                    <Button
                      variant="link"
                      className="circled-button edit-button"
                      onClick={() => handleEdit(match._id)}
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      variant="link"
                      className="circled-button delete-button"
                      onClick={() => handleDelete(match._id)}
                    >
                      <HiOutlineTrash />
                    </Button>
                  </td>
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

export default Matches;