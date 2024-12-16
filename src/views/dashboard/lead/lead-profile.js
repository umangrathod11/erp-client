import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap'
import Card from '../../../components/Card'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axiosInstance from '../../../js/api';


const EmployeeProfile = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const lead_id = searchParams.get('lead_id');

    const [leadData, setLeadData] = useState({
        fullName: '',
        service: '',
        leadType: 'NAN', // default value
        date: '',
        phoneNumber: '',
        email: '',
        reference: '',
        leadAddress: '',
        leadNotes: '',
        id: ''
    });

    const getLeadTypeColor = () => {
        switch (leadData.leadType) {
            case 'Not Interested':
                return 'red';
            case 'Potential':
                return 'yellowgreen';
            case 'Interested':
                return 'green';
            default:
                return '';
        }
    };

    useEffect(() => {
        if (lead_id) {
            fetchLeadData(lead_id);
        }
    }, [lead_id]);

    const fetchLeadData = async (lead_id) => {
        try {
            const response = await axiosInstance.get(`/lead/get-lead?id=${lead_id}`);

            // Check if response contains data
            if (response.data && response.data.data) {
                const lead = response.data.data[0];
                console.log(lead);

                setLeadData({
                    fullName: lead.fullName,
                    service: lead.service,
                    leadType: lead.leadType,
                    date: lead.date,
                    phoneNumber: lead.phoneNumber,
                    email: lead.email,
                    reference: lead.reference,
                    leadAddress: lead.leadAddress,
                    leadNotes: lead.leadNotes,
                    id: lead._id
                });
            } else {
                console.error('No data found for Lead:', lead_id);
                toast.error('No data found for Lead');
            }
        } catch (error) {
            console.error('Error fetching Lead data:', error);
            toast.error('Error fetching Lead data');
        }
    };


    const handleChange = (e) => {
        const { id, value } = e.target;
        setLeadData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleUpdateLead = async () => {
        try {
            const response = await axiosInstance.post('/lead/update-lead', leadData);
            if (response.data && response.data.data) {
                toast.success('Lead details updated successfully');
            } else {
                console.error('Error updating Lead details:', response.data.message);
                toast.error('Error updating Lead details');
            }
        } catch (error) {
            console.error('Error updating Lead details:', error);
            toast.error('Error updating Lead details');
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
                                    <h4 className="card-title">Lead Details :- </h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="new-user-info">
                                    <form>
                                        <Row>
                                            <Col md={12}>
                                                <Row>
                                                    <Form.Group className="col-md-6 form-group">
                                                        <Form.Label htmlFor="fullName">Full Name :-</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            id="fullName"
                                                            placeholder="Demo"
                                                            value={leadData.fullName}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="col-md-6 form-group">
                                                        <Form.Label htmlFor="date">Date :-</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            id="date"
                                                            placeholder="Example Name"
                                                            value={leadData.date}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="col-md-6 form-group">
                                                        <Form.Label htmlFor="phoneNumber">Mobile :-</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            id="phoneNumber"
                                                            placeholder="123456789"
                                                            value={leadData.phoneNumber}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="col-md-6 form-group">
                                                        <Form.Label htmlFor="email">Email:</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            id="email"
                                                            placeholder="exampleemail@gmail.com"
                                                            value={leadData.email}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3 col-md-6" controlId="leadType">
                                                        <Form.Label>Client Type :</Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            name="leadType"
                                                            id='leadType'
                                                            value={leadData.leadType}
                                                            onChange={handleChange}
                                                            style={{ color: getLeadTypeColor() }}
                                                            required
                                                        >
                                                            <option value="NAN">Select Client Type </option>
                                                            <option value="Not Interested" style={{ color: 'red' }}>Not Interested</option>
                                                            <option value="Potential" style={{ color: 'yellowgreen' }}>Potential</option>
                                                            <option value="Interested" style={{ color: 'green' }}>Interested</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3 col-md-6" controlId="service">
                                                        <Form.Label>Service :</Form.Label>
                                                        <Form.Control
                                                            placeholder='Enter Service'
                                                            type="text"
                                                            name="service"
                                                            id='service'
                                                            value={leadData.service}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3 col-md-6" controlId="reference">
                                                        <Form.Label>Reference :</Form.Label>
                                                        <Form.Control
                                                            placeholder='Enter Reference'
                                                            type="text"
                                                            name="reference"
                                                            id='reference'
                                                            value={leadData.reference}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3 col-md-6" controlId="notes">
                                                        <Form.Label>Notes :</Form.Label>
                                                        <Form.Control
                                                            placeholder='Enter Notes'
                                                            type="text"
                                                            name="leadNotes"
                                                            id='leadNotes'
                                                            value={leadData.leadNotes}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="col-md-12 form-group">
                                                        <Form.Label htmlFor="leadAddress">Address :-</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            id="leadAddress"
                                                            placeholder="Demo App, Demo City, 12346"
                                                            value={leadData.leadAddress}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Button
                                                    type="button"
                                                    variant="btn btn-primary"
                                                    className="mt-2"
                                                    onClick={handleUpdateLead}
                                                >
                                                    <LibraryAddCheckIcon /> Update Lead Details
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
    )
}

export default EmployeeProfile
