// DietForm.js
import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-toastify';
import axiosInstance from '../../../js/api';

const ExerciseForm = ({ handleClose }) => {
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
            const response = await axiosInstance.post('/exercise-plan/add-exercise-plan', formData);

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
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="plan_name">
                                <Form.Label>Exercise Plan :</Form.Label>
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
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="exercise_type">
                                <Form.Label>Exercise Category :</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="exercise_type"
                                    value={formData.exercise_type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Diet Category</option>
                                    <option value="Weight Loss">Weight Loss</option>
                                    <option value="Muscle Gain">Muscle Gain</option>
                                    <option value="Bodybuilding">Bodybuilding</option>
                                </Form.Control>
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

export default ExerciseForm;
