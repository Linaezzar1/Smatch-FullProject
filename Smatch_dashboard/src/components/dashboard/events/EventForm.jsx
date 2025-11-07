import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './EventForm.css';
import { createTournament, updateTournament, getTournamentById } from '../../../Services/TournamentService';

const EventForm = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();

  // Initialize form state with all required fields
  const [form, setForm] = useState({
    id: id === 'new' ? '' : id,
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    numberTeam: 8,
    prize: '',
    tournamentType: 'SingleElimination',
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (id !== 'new') {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const tournament = await getTournamentById(id);
          setForm({
            id: tournament._id,
            name: tournament.name,
            startDate: tournament.startDate ? new Date(tournament.startDate).toISOString().split('T')[0] : '',
            endDate: tournament.endDate ? new Date(tournament.endDate).toISOString().split('T')[0] : '',
            location: tournament.location,
            numberTeam: tournament.numberTeam || 8,
            prize: tournament.prize || 'TBD',
            tournamentType: tournament.tournamentType || 'SingleElimination',
            image: null,
          });
        } catch (err) {
          setError('Erreur lors de la récupération de l\'événement : ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.startDate || !form.location || !form.endDate || !form.numberTeam || !form.prize || !form.tournamentType) {
      setError('Tous les champs sont requis');
      return;
    }

    setLoading(true);
    try {
      const tournamentData = {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        location: form.location,
        numberTeam: parseInt(form.numberTeam, 10),
        prize: form.prize,
        tournamentType: form.tournamentType,
      };

 
      if (id === 'new') {
        await createTournament(tournamentData, form.image);
      } else {
        await updateTournament(id, tournamentData, form.image);
      }
      navigate('/events');
    } catch (err) {
      setError('Erreur lors de la sauvegarde de l\'événement : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/events');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Container fluid className="event-form-dashboard">
      <Row className="mb-4">
        <Col>
          <h2>{id === 'new' ? 'Ajouter Événement' : 'Modifier Événement'}</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="form-frame">
            <Row className="g-3">
              <Col md={12}>
                <Form>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Label>Titre</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Titre"
                        value={form.name}
                        onChange={handleChange}
                        isInvalid={!form.name && error}
                      />
                      <Form.Control.Feedback type="invalid">Le titre est requis.</Form.Control.Feedback>
                    </Col>
                    <Col md={6}>
                      <Form.Label>Date de début</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        isInvalid={!form.startDate && error}
                      />
                      <Form.Control.Feedback type="invalid">La date de début est requise.</Form.Control.Feedback>
                    </Col>
                    <Col md={6}>
                      <Form.Label>Date de fin</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        isInvalid={!form.endDate && error}
                      />
                      <Form.Control.Feedback type="invalid">La date de fin est requise.</Form.Control.Feedback>
                    </Col>
                    <Col md={12}>
                      <Form.Label>Lieu</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        placeholder="Lieu"
                        value={form.location}
                        onChange={handleChange}
                        isInvalid={!form.location && error}
                      />
                      <Form.Control.Feedback type="invalid">Le lieu est requis.</Form.Control.Feedback>
                    </Col>
                    <Col md={6}>
                      <Form.Label>Nombre d'équipes</Form.Label>
                      <Form.Control
                        type="number"
                        name="numberTeam"
                        value={form.numberTeam}
                        onChange={handleChange}
                        isInvalid={!form.numberTeam && error}
                        min="2"
                      />
                      <Form.Control.Feedback type="invalid">Le nombre d'équipes est requis (minimum 2).</Form.Control.Feedback>
                    </Col>
                    <Col md={6}>
                      <Form.Label>Prix</Form.Label>
                      <Form.Control
                        type="text"
                        name="prize"
                        value={form.prize}
                        onChange={handleChange}
                        isInvalid={!form.prize && error}
                      />
                      <Form.Control.Feedback type="invalid">Le prix est requis.</Form.Control.Feedback>
                    </Col>
                    <Col md={12}>
                      <Form.Label>Type de tournoi</Form.Label>
                      <Form.Control
                        as="select"
                        name="tournamentType"
                        value={form.tournamentType}
                        onChange={handleChange}
                        isInvalid={!form.tournamentType && error}
                      >
                        <option value="SingleElimination">Élimination simple</option>
                        <option value="DoubleElimination">Élimination double</option>
                        <option value="RoundRobin">Tous contre tous</option>
                        <option value="League">Ligue</option>
                        <option value="GroupKnockout">Groupes + Élimination</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">Le type de tournoi est requis.</Form.Control.Feedback>
                    </Col>
                    <Col md={12}>
                      <Form.Label>Image</Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col className="form-buttons">
                      <Button className="cancel-button" onClick={handleCancel}>
                        Annuler
                      </Button>
                      <Button className="submit-button" onClick={handleSubmit}>
                        {id === 'new' ? 'Ajouter' : 'Mettre à jour'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EventForm;