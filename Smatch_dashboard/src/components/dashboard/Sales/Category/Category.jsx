import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, InputGroup, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { IoSearchOutline } from 'react-icons/io5';
import { FiEdit2 } from 'react-icons/fi';
import './Category.css';
import {
  createCategory,
  getAllCategories,
  updateCategory,
} from '../../../../Services/CategoryService';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError('Erreur lors de la récupération des catégories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    if (!form.name) {
      setError('Le champ Nom est requis');
      return;
    }

    try {
      const categoryData = {
        name: form.name,
        description: form.description || '',
      };

      if (editingId) {
        const updatedCategory = await updateCategory(editingId, categoryData);
        setCategories(categories.map((c) => (c._id === editingId ? updatedCategory : c)));
      } else {
        const updatedCategory = await createCategory(categoryData);
        setCategories([...categories, updatedCategory]);
      }
      setForm({ name: '', description: '' });
      setShowModal(false);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'ajout ou de la mise à jour de la catégorie');
      console.error(err);
    }
  };

  const handleEdit = (categoryId) => {
    const categoryToEdit = categories.find((c) => c._id === categoryId);
    if (categoryToEdit) {
      setForm({
        name: categoryToEdit.name,
        description: categoryToEdit.description || '',
      });
      setEditingId(categoryId);
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ name: '', description: '' });
    setError(null);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Container fluid className="categories-dashboard">
      <Row className="with-separator top-row">
        <Col xs={12} md={2}>
          <Button
            variant="primary"
            className="new-button"
            onClick={() => {
              setForm({ name: '', description: '' });
              setEditingId(null);
              setShowModal(true);
            }}
          >
            <FaPlus /> New Category
          </Button>
        </Col>
      </Row>
      <Row className="mb-4 align-items-center with-separator">
        <Col xs={12} md={6}>
          <h2 className="title">Gestion des Catégories</h2>
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
          <Modal.Title>{editingId ? 'Modifier Catégorie' : 'Ajouter Catégorie'}</Modal.Title>
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
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdate}>
            {editingId ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col>
          <Table className="category-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((category) => (
                <tr key={category._id} className="fade-in-row">
                  <td>{category.name}</td>
                  <td>{category.description || 'N/A'}</td>
                  <td className="actions">
                    <Button
                      variant="link"
                      className="circled-button edit-button"
                      onClick={() => handleEdit(category._id)}
                    >
                      <FiEdit2 />
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

export default Category;