import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, InputGroup, Form, Button, Modal } from 'react-bootstrap';
import { IoSearchOutline } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa';
import './Orders.css';
import { getAllOrders } from '../../../../Services/OrderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Erreur lors de la récupération des commandes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleViewProducts = (order) => {
    setSelectedOrder(order);
    setShowProductsModal(true);
  };

  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
    setSelectedOrder(null);
  };
  const getUserName = (user) => {
    if (!user) return 'Invité';
    if (typeof user === 'string') return user;
    return user.name || user.username || user.email || 'Utilisateur';
};

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user && order.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      new Date(order.orderDate).toLocaleDateString('fr-FR').toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <Container fluid className="orders-dashboard">
      <Row className="mb-4 align-items-center with-separator">
        <Col xs={12} md={6}>
          <h2 className="title">Gestion des Commandes</h2>
        </Col>
        <Col xs={12} md={6}>
          <InputGroup className="short-search">
            <InputGroup.Text>
              <IoSearchOutline />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </InputGroup>
        </Col>
      </Row>

      <Modal show={showProductsModal} onHide={handleCloseProductsModal} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Produits de la commande {selectedOrder?._id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder?.products && selectedOrder.products.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price} TND</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Aucun produit dans cette commande.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProductsModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col>
          {currentOrders.length === 0 ? (
            <div className="text-center py-4">Aucune commande trouvée</div>
          ) : (
            <Table className="order-table">
              <thead>
                <tr>
                  <th>ID Commande</th>
                  <th>Utilisateur</th>
                  <th>Produits</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id} className="fade-in-row">
                    <td>{order._id}</td>
                    <td>{getUserName(order.user)}</td>
                    
                    <td>
                      <Button
                        variant="link"
                        className="view-products-button"
                        onClick={() => handleViewProducts(order)}
                      >
                        <FaEye /> Voir les produits
                      </Button>
                    </td>
                    <td>{order.total} TND</td>
                    <td>{formatDate(order.orderDate)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      
      {totalPages > 1 && (
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
      )}
    </Container>
  );
};

export default Orders;