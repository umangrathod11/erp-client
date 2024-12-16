import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import axiosInstance from '../../../js/api';
import Temp_1 from '../../../assets/temp_1.jpg';
import Temp_2 from '../../../assets/temp_2.jpg';
import Temp_3 from '../../../assets/temp_3.jpg';

const OfferMailSend = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const offer_id = searchParams.get('offer_id');

  const [userData, setUserData] = useState({
    offer_title: '',
  });

  const [userList, setUserList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateImages, setTemplateImages] = useState({
    OFFER_TMP_1: Temp_1,
    OFFER_TMP_2: Temp_2,
    OFFER_TMP_3: Temp_3,
  });
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/user/get');
        setUserList(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (offer_id) {
      fetchUserData(offer_id);
    }
  }, [offer_id]);

  const fetchUserData = async (offer_id) => {
    try {
      const response = await axiosInstance.get(`/offer/get?id=${offer_id}`);

      if (response.data && response.data.data) {
        const offer = response.data.data[0];

        setUserData({
          offer_title: offer.offer_title,
        });
      } else {
        console.error('No data found for Offer:', offer_id);
        toast.error('No data found for Offer');
      }
    } catch (error) {
      console.error('Error fetching Offer data:', error);
      toast.error('Error fetching Offer data');
    }
  };

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const sendEmail = async () => {
    try {
      // Make a request to the /offer/send-email route
      const response = await axiosInstance.post('/offer/send-email', {
        offer_id: offer_id,
        offer_template: selectedTemplate,
        user_list: [selectedUser],
      });

      // Handle success
      console.log('Email sent successfully', response.data);
      toast.success('Email sent successfully');
    } catch (error) {
      // Handle error
      console.error('Error sending email:', error);
      toast.error('Error sending email');
    }
  };

  return (
    <div className='margintop'>
      <Col xl="12" lg="12">
        <Row>
          <div className='col-12'>
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Send Offer Email :-</h4>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="new-user-info">
                  <form>
                    <Row>
                      <Col md={4} className="text-center">
                        {selectedTemplate && templateImages[selectedTemplate] && (
                          <img src={templateImages[selectedTemplate]} alt="Template" style={{ borderRadius: '10px' }} width={'100%'} />
                        )}
                        <p className='mt-lg-2' style={{ color: '#3a57e8', fontSize: '14px', fontWeight: '600' }}>
                          Template Overview
                        </p>
                      </Col>
                      <Col md={8}>
                        <Row>
                          <Form.Group className="col-md-12 form-group">
                            <Form.Label htmlFor="offer_title">Offer Name :-</Form.Label>
                            <Form.Control
                              type="text"
                              id="offer_title"
                              placeholder="Enter Company Name"
                              value={userData.offer_title}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3 col-md-12">
                            <Form.Label htmlFor="offerTemplate">Offer Template :-</Form.Label>
                            <Form.Select
                              id="offerTemplate"
                              onChange={handleTemplateChange}
                            >
                              <option value="" hidden>Select Offer Template</option>
                              <option value="OFFER_TMP_1">Template 1</option>
                              <option value="OFFER_TMP_2">Template 2</option>
                              <option value="OFFER_TMP_3">Template 3</option>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group className="mb-3 col-md-12">
                            <Form.Label htmlFor="userList">User List :-</Form.Label>
                            <Form.Select id="userList" onChange={handleUserChange}>
                              <option value="" hidden>Select User</option>
                              {userList.map((user) => (
                                <option key={user._id} value={user._id}>
                                  {user.first_name + ' ' + user.last_name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Row>
                        <Button
                          type="button"
                          variant="btn btn-primary"
                          className="mt-2"
                          onClick={sendEmail}
                        >
                          <LibraryAddCheckIcon /> Send Email
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Row>
      </Col>
      <ToastContainer />
    </div>
  );
};

export default OfferMailSend;
