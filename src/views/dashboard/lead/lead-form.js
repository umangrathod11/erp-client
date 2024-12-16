// LeadForm.js
import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../js/api';

const LeadForm = ({ handleClose, leadData: initialLeadData }) => {
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
        ...initialLeadData,
    });
    console.log(initialLeadData)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeadData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/lead/create-lead', leadData);

            if (response.data && response.data.error) {
                toast.error(`Error creating Lead: ${response.data.error}`);
            } else {
                e.target.reset();
                handleClose();
                toast.success('Lead added successfully!');
            }
        } catch (error) {
            console.error('Error creating Lead:', error);
            handleClose();
            toast.error('Error creating Lead. Please try again.');
        }
    };

    return (
        <div className='scroll-bar'>
            <Form onSubmit={handleSubmit}>
                <hr className='mt-2 mb-0' style={{ padding: '0px', backgroundColor: '#000' }} />
                <div className='mt-30'>
                    <Row>
                        <Form.Group className="mb-3 col-md-6" controlId="fullName">
                            <Form.Label>Full Name :</Form.Label>
                            <Form.Control
                                placeholder='Enter Name'
                                type="text"
                                name="fullName"
                                id="fullName"
                                value={leadData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-6" controlId="date">
                            <Form.Label>Date :</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                id='date'
                                value={leadData.date}
                                onChange={handleChange}
                                required
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

                        <Form.Group className="mb-3 col-md-6" controlId="mobile">
                            <Form.Label>Mobile :</Form.Label>
                            <Form.Control
                                placeholder='Enter Mobile'
                                type="number"
                                name="phoneNumber"
                                id='phoneNumber'
                                value={leadData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-6" controlId="email">
                            <Form.Label>Email :</Form.Label>
                            <Form.Control
                                placeholder='Enter Email'
                                type="email"
                                name="email"
                                id='email'
                                value={leadData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-12" controlId="place">
                            <Form.Label>Place :</Form.Label>
                            <Form.Control
                                placeholder='Enter Place'
                                type="text"
                                name="leadAddress"
                                id='leadAddress'
                                value={leadData.leadAddress}
                                onChange={handleChange}
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
                    </Row>
                    <hr className='mt-2 mb-0' style={{ padding: '0px', backgroundColor: '#000' }} />
                </div>

                <div className="text-end">
                    <Button variant="success" type="submit" className='mt-3 px-3' style={{ fontWeight: '600' }}>
                        <PersonAddIcon /> Add Lead
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default LeadForm;
