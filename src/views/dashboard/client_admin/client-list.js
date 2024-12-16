import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import Card from '../../../components/Card';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DrawIcon from '@mui/icons-material/Draw';
import TextField from '@mui/material/TextField';
import axiosInstance from '../../../js/api';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowModal = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };


  const filteredClients = clients.filter(
    (client) =>
      (client.type === 'CLIENT' || client.type === 'TRAIL') &&
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch admin data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/get-admins');
        setClients(response.data.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Error fetching admin data');
      }
    };

    fetchData();
  }, []);

  const displayClients = filteredClients.map((client, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{client.full_name}</td>
      <td>{client.type}</td>
      <td>{new Date(client.createdAt).toLocaleDateString()}</td>
      <td>{client.mobile}</td>
      <td>
        <div className="flex align-items-center list-user-action">
          <Button
            className="btn btn-sm btn-icon btn-success"
            onClick={() => handleShowModal(client)}
          >
            <span className="btn-inner">
              <DrawIcon style={{ width: '32px', marginTop: '7px' }} />
            </span>
          </Button>
        </div>
      </td>
    </tr>
  ));

  const handleUpdateClient = async () => {
    try {
      const adminId = selectedClient.id;

      await axiosInstance.post('/update-admin-type', { adminId: adminId, newType: selectedClient.type });

      toast.success('Client type updated successfully');

      handleCloseModal();
    } catch (error) {
      console.error('Error updating client type:', error);
      toast.error('Error updating client type');
    }
  };


  return (
    <>
      <div className='margintop'>
        <Row>
          <Col sm="12">
            <Card>
              <Card.Header>
                <div className="header-title d-none d-md-block">
                  <h4 className="card-title">Client List</h4>
                </div>
              </Card.Header>
              <Card.Body className="px-0" style={{ position: 'relative' }}>
                <div className='card-body pt-0'>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="header-title">
                      <TextField
                        placeholder="Search"
                        id="outlined-size-small"
                        size="small"
                        className="search-filed"
                        style={{ marginRight: '10px', width: '300px' }}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table
                    id="user-list-table"
                    className="table table-striped"
                    role="grid"
                    data-toggle="data-table"
                  >
                    <thead>
                      <tr className="ligth">
                        <th><b>No.</b></th>
                        <th><b>Full Name</b></th>
                        <th><b>Type</b></th>
                        <th><b>Date</b></th>
                        <th><b>Mobile</b></th>
                        <th min-width="100px"><b>Action</b></th>
                      </tr>
                    </thead>
                    <tbody>{displayClients}</tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {/* Client Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Client Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClient && (
            <Form>
              <Form.Group controlId="formFullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={selectedClient.full_name}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formType" style={{ marginTop: '7px' }}>
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedClient.type}
                  onChange={(e) => {
                    const updatedClient = { ...selectedClient, type: e.target.value };
                    setSelectedClient(updatedClient);
                  }}
                >
                  <option value="CLIENT">Client</option>
                  <option value="TRAIL">TRAIL</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formEmail" style={{ marginTop: '7px' }}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Email"
                  value={selectedClient.email}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formMobile" style={{ marginTop: '7px' }}>
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mobile number"
                  value={selectedClient.mobile}
                  readOnly
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateClient}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  )
}

export default ClientList
