import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, InputGroup, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { IoSearchOutline } from 'react-icons/io5';
import { FiEdit2 } from 'react-icons/fi';
import './Products.css';
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from '../../../../Services/ProductService';
import { getAllCategories } from '../../../../Services/CategoryService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
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

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.price || !form.category) {
      setError('Les champs Nom, Prix et Catégorie sont requis');
      return;
    }

    try {
      const productData = {
        name: form.name,
        description: form.description || '',
        price: parseFloat(form.price),
        category: form.category,
      };

      let updatedProduct;
      if (editingId) {
        updatedProduct = await updateProduct(editingId, productData, imageFile);
        const updatedProducts = await getAllProducts();
        setProducts(updatedProducts);
      } else {
        updatedProduct = await createProduct(productData, imageFile);
        const updatedProducts = await getAllProducts();
        setProducts(updatedProducts);
      }
      setForm({ name: '', description: '', price: '', category: '' });
      setImageFile(null);
      setShowModal(false);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'ajout ou de la mise à jour du produit');
      console.error(err);
    }
  };

  const handleEdit = (productId) => {
    const productToEdit = products.find((p) => p._id === productId);
    if (productToEdit) {
      setForm({
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price,
        category: productToEdit.category._id || productToEdit.category, // Handle both ObjectId and string
      });
      setImageFile(null);
      setEditingId(productId);
      setShowModal(true);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression du produit');
      console.error(err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ name: '', description: '', price: '', category: '' });
    setImageFile(null);
    setError(null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Container fluid className="products-dashboard">
      <Row className="with-separator top-row">
        <Col xs={12} md={2}>
          <Button
            variant="primary"
            className="new-button"
            onClick={() => {
              setForm({ name: '', description: '', price: '', category: '' });
              setImageFile(null);
              setEditingId(null);
              setShowModal(true);
            }}
          >
            <FaPlus /> New Product
          </Button>
        </Col>
      </Row>
      <Row className="mb-4 align-items-center with-separator">
        <Col xs={12} md={6}>
          <h2 className="title">Gestion des Produits</h2>
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
          <Modal.Title>{editingId ? 'Modifier Produit' : 'Ajouter Produit'}</Modal.Title>
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
              <Col md={12}>
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="Prix"
                  value={form.price}
                  onChange={handleChange}
                  step="0.01"
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Col>
              <Col md={12}>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
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
          <Table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="fade-in-row">
                  <td>
                    {product.photo ? (
                      <img
                        src={product.photo}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="placeholder-image"></div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description || 'N/A'}</td>
                  <td>{product.price} TND</td>
                  <td>{product.category?.name || product.category || 'N/A'}</td>
                  <td className="actions">
                    <Button
                      variant="link"
                      className="circled-button edit-button"
                      onClick={() => handleEdit(product._id)}
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      variant="link"
                      className="circled-button delete-button"
                      onClick={() => handleDelete(product._id)}
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

export default Products;