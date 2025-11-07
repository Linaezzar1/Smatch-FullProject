import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, InputGroup, Modal } from 'react-bootstrap';
import { IoSearchOutline } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import './Players.css';
import * as UserService from '../../../../Services/UserService';

const Players = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        birthDate: '',
        position: '',
        role: 'user',
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const [itemsPerPage] = useState(5); // Nombre d'éléments par page

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await UserService.getAllUsers();
                console.log('Fetched users:', data);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (userId) => {
        const userToEdit = users.find(user => user._id === userId);
        if (userToEdit) {
            setForm({
                name: userToEdit.name || '',
                email: userToEdit.email || '',
                phone: userToEdit.phone || '',
                address: userToEdit.address || '',
                birthDate: userToEdit.birthDate ? new Date(userToEdit.birthDate).toISOString().split('T')[0] : '',
                position: userToEdit.position || '',
                role: userToEdit.role || 'user',
            });
            setEditingId(userId);
            setShowModal(true);
        }
    };

    const handleUpdate = async () => {
        if (!form.name || !form.email || !form.role) return;

        try {
            setLoading(true);
            setError(null);
            const updatedUser = await UserService.updateUser(editingId, form);
            setUsers(users.map(user => user._id === editingId ? updatedUser : user));
            setShowModal(false);
            setEditingId(null);
            setForm({
                name: '',
                email: '',
                phone: '',
                address: '',
                birthDate: '',
                position: '',
                role: 'user',
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingId(null);
        setForm({
            name: '',
            email: '',
            phone: '',
            address: '',
            birthDate: '',
            position: '',
            role: 'user',
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.address || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Logique de pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    if (loading) return <div className="text-center mt-5">Chargement...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    return (
        <Container fluid className="players-dashboard">
            <Row className="mb-4 align-items-center with-separator">
                <Col xs={12} md={6}>
                    <h2>Gestion des Utilisateurs</h2>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="role-filter"
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="user">Utilisateur</option>
                        <option value="player">Joueur</option>
                        <option value="coach">Entraîneur</option>
                        <option value="organizer">Organisateur</option>
                        <option value="admin">Administrateur</option>
                    </Form.Select>
                </Col>
                <Col xs={12} md={3}>
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
                    <Modal.Title>Modifier Utilisateur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Nom"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    placeholder="Téléphone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    placeholder="Adresse"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Control
                                    type="date"
                                    name="birthDate"
                                    placeholder="Date de naissance"
                                    value={form.birthDate}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Control
                                    type="text"
                                    name="position"
                                    placeholder="Position"
                                    value={form.position}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                >
                                    <option value="user">Utilisateur</option>
                                    <option value="player">Joueur</option>
                                    <option value="coach">Entraîneur</option>
                                    <option value="organizer">Organisateur</option>
                                    <option value="admin">Administrateur</option>
                                </Form.Select>
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
                    <Table className="player-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                                <th>Adresse</th>
                                <th>Date de naissance</th>
                                <th>Position</th>
                                <th>Rôle</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((user, index) => (
                                <tr key={user._id} className="fade-in-row">
                                    <td className="py-2 px-4">
                                        <div className="profile-image-container">
                                            {user.profilePicture ? (
                                                <img
                                                    src={user.profilePicture}
                                                    alt={`${user.name || 'User'}'s profile`}
                                                    className="profile-image"
                                                />
                                            ) : (
                                                <div className="profile-placeholder">
                                                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{user.name || 'N/A'}</td>
                                    <td>{user.email || 'N/A'}</td>
                                    <td>{user.phone || 'N/A'}</td>
                                    <td>{user.address || 'N/A'}</td>
                                    <td>{user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>{user.position || 'N/A'}</td>
                                    <td>{user.role || 'N/A'}</td>
                                    <td className="actions">
                                        <Button variant="link" className="circled-button edit-button" onClick={() => handleEdit(user._id)}><FiEdit2 /></Button>
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

export default Players;