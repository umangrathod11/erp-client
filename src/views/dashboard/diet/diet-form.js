// DietForm.js
import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-toastify';
import axiosInstance from '../../../js/api';

const DietForm = ({ handleClose }) => {
    const [formData, setFormData] = useState({
        plan_name: '',
        category_name: '',
        days: '',
        food_type: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/diet-plan/add-diet-plan', formData);

            if (response.data && response.data.error) {
                toast.error(`Error creating Diet: ${response.data.error}`);
            } else {
                e.target.reset();
                handleClose();
                toast.success('Diet added successfully!');
            }
        } catch (error) {
            console.error('Error creating Diet:', error);
            handleClose();
            toast.error('Error creating Diet. Please try again.');
        }
    };



    return (
        <div className='scroll-bar'>
            <Form onSubmit={handleSubmit}>
                <hr className='mt-2 mb-0' style={{ padding: '0px', backgroundColor: '#000' }} />
                <div className='mt-30'>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="plan_name">
                                <Form.Label>Diet Plan :</Form.Label>
                                <Form.Control
                                    placeholder='Plan Name'
                                    type="text"
                                    name="plan_name"
                                    value={formData.plan_name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="category_name">
                                <Form.Label>Diet Category :</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="category_name"
                                    value={formData.category_name}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Diet Category</option>
                                    <option value="Weight Loss">Weight Loss</option>
                                    <option value="Weight Gain">Weight Gain</option>
                                    <option value="Weight Maintain">Weight Maintain</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="food_type">
                                <Form.Label>Food Type :</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="food_type"
                                    value={formData.food_type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Food Type</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Non Vegetarian">Non Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="days">
                                <Form.Label>Total Day (Duration) :</Form.Label>
                                <Form.Control
                                    placeholder='Days in Number'
                                    type="text"
                                    name="days"
                                    value={formData.days}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <hr className='mt-2 mb-0' style={{ padding: '0px', backgroundColor: '#000' }} />
                </div>

                <div className="text-end">
                    <Button variant="primary" type="submit" className='mt-3 px-3' style={{ fontWeight: '600' }}>
                        <PersonAddIcon /> Add
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default DietForm;
