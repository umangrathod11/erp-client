import React, { useState } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import { Row, Col, Form, Button } from 'react-bootstrap'
import Card from '../../../components/Card'
import axiosInstance from '../../../js/api'
import './styles.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LeadAdd = () => {
  const [adminData, setAdminData] = useState({
    full_name: '',
    type: '',
    mobile: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setAdminData((prevData) => ({ ...prevData, [name]: value }))
  }

  const [isLoading, setIsLoading] = useState(false);
  const handleAddAdmin = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.post('/create-admin-user', adminData);

      if (response.data.status === 200) {

        setTimeout(() => {
          toast.success('Admin added successfully');
          setIsLoading(false);
        }, 1000);
      } else {
        console.error('Error adding admin:', response.data.message);
        toast.error('Error adding admin: ' + response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Error adding admin: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <Row>
          <Col xl="12" lg="12">
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Add Admin</h4>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="new-user-info">
                  <form>
                    <div className="row">
                      <div className="col-12 col-md-10">
                        <div className="row">
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="fname">Full Name:</Form.Label>
                            <Form.Control
                              type="text"
                              id="fname"
                              name="full_name"
                              placeholder="Full Name"
                              value={adminData.full_name}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label>Admin Type :</Form.Label>
                            <select
                              name="type"
                              className="selectpicker form-control"
                              data-style="py-0"
                              value={adminData.type}
                              onChange={handleChange}
                            >
                              <option value="">Select</option>
                              <option value="SUB">Sub Admin</option>
                              <option value="Sales">Sales</option>
                            </select>
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="mobno">
                              Mobile Number:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="mobno"
                              name="mobile"
                              placeholder="Mobile Number"
                              value={adminData.mobile}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="email">Email:</Form.Label>
                            <Form.Control
                              type="email"
                              id="email"
                              name="email"
                              placeholder="Email"
                              value={adminData.email}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="pass">Password:</Form.Label>
                            <Form.Control
                              type="password"
                              id="pass"
                              name="password"
                              placeholder="Password"
                              value={adminData.password}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </div>
                        <Button
                          type="button"
                          variant="btn btn-primary"
                          onClick={handleAddAdmin}
                        >
                          Add Admin
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </Card.Body>
            </Card>
            {isLoading && (
              <>
                {/* Desktop Spinner */}
                <div className="d-none d-md-block">
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Spinner animation="border" variant="primary" />
                  </div>
                </div>

                {/* Mobile Spinner */}
                <div className="d-md-none">
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '200px',
                    }}
                  >
                    <Spinner animation="border" variant="primary" />
                  </div>
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default LeadAdd
