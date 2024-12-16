// FoodForm.js
import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../js/api';

const FoodForm = ({ handleClose }) => {
    const [foodData, setFoodData] = useState({
        food_name: '',
        protein: '',
        carbs: '',
        calories: '',
        fats: '',
        quantity_unit: '',
        quantity: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFoodData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/food/add', foodData);

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
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name :</Form.Label>
                                <Form.Control
                                    placeholder='Enter Name'
                                    type="text"
                                    name="food_name"
                                    id='food_name'
                                    value={foodData.food_name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="protein">
                                <Form.Label>Protein :</Form.Label>
                                <Form.Control
                                    placeholder='Protein'
                                    type="text"
                                    name="protein"
                                    id='protein'
                                    value={foodData.protein}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="carbohydrates">
                                <Form.Label>Carbohydrates :</Form.Label>
                                <Form.Control
                                    placeholder='Carbohydrates'
                                    type="text"
                                    name="carbs"
                                    id='carbs'
                                    value={foodData.carbs}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="calories">
                                <Form.Label>Calories :</Form.Label>
                                <Form.Control
                                    placeholder='Calories'
                                    type="text"
                                    name="calories"
                                    id='calories'
                                    value={foodData.calories}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="fats">
                                <Form.Label>Fats :</Form.Label>
                                <Form.Control
                                    placeholder=' Fats'
                                    type="text"
                                    name="fats"
                                    value={foodData.fats}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="quantity">
                                <Form.Label>Quantity Unit :</Form.Label>
                                <Form.Control
                                    placeholder='Quantity'
                                    type="text"
                                    name="quantity"
                                    id='quantity'
                                    value={foodData.quantity}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="quantity">
                                <Form.Label>Quantity :</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="quantity_unit"
                                    id='quantity_unit'
                                    value={foodData.quantity_unit}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" hidden>Select Unit</option>
                                    <option value="GRAM">Gram</option>
                                    <option value="KILOGRAM">Kilogram</option>
                                    <option value="NOS">NOS</option>
                                    <option value="MILLIGRAM">Milligram</option>
                                    <option value="LITRE">litre</option>
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

export default FoodForm;
