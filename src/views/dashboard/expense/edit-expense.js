import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../js/api';

const EditExpense = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const expense_id = searchParams.get('expense_id');
    const navigate = useNavigate();

    const [expenseData, setExpenseData] = useState({
        expense_number: '',
        date: '',
        expensePaymentMethod: '',
        expenseName: '',
        expenseItemName: '',
        expenseAmount: '',
        expenseNotes: '',
    });

    useEffect(() => {
        const fetchExpenseData = async () => {
            try {
                const response = await axiosInstance.get(`/expense/get?id=${expense_id}`);
                setExpenseData(response.data.data[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch expense data');
            }
        };

        fetchExpenseData();
    }, [expense_id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setExpenseData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`/expense/update?id=${expense_id}`, expenseData);

            if (response.data && response.data.error) {
                toast.error(`Error updating expense: ${response.data.error}`);
            } else {
                toast.success('Expense updated successfully!');
                navigate('/dashboard/expenses');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            toast.error('Error updating expense. Please try again.');
        }
    };

    return (
        <div className='margintop'>
            <Row>
                <Col xl="12" lg="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Edit Expense</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="new-user-info">
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="expense_number">Expenses No:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="expense_number"
                                                    value={expenseData.expense_number}
                                                    onChange={handleChange}
                                                    placeholder="Enter Expenses No"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="date">Date:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="date"
                                                    value={expenseData.date}
                                                    onChange={handleChange}
                                                    placeholder="Enter Date"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="expensePaymentMethod">Payment Method:</Form.Label>
                                                <Form.Select
                                                    id="expensePaymentMethod"
                                                    value={expenseData.expensePaymentMethod}
                                                    onChange={handleChange}
                                                    placeholder="Select Payment Method"
                                                >
                                                    <option value="">Select Payment Method</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="cheque">Cheque</option>
                                                    <option value="online">Online</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="expenseName">Expenses Category:</Form.Label>
                                                <Form.Select
                                                    id="expenseName"
                                                    value={expenseData.expenseName}
                                                    onChange={handleChange}
                                                    placeholder="Select Expenses Category"
                                                >
                                                    <option value="">Select Expenses Category</option>
                                                    <option value="Ads">Ads</option>
                                                    <option value="Counselling">Counselling</option>
                                                    <option value="Electricity">Electricity</option>
                                                    <option value="Salary">Salary</option>
                                                    <option value="Petrol">Petrol</option>
                                                    <option value="Transport">Transport</option>
                                                    <option value="Rent">Rent</option>
                                                    <option value="Fix cost">Fix cost</option>
                                                    <option value="Equipment">Equipment</option>
                                                    <option value="Miscellaneous">Miscellaneous</option>
                                                    <option value="Others">Others</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="expenseItemName">Item Name:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="expenseItemName"
                                                    value={expenseData.expenseItemName}
                                                    onChange={handleChange}
                                                    placeholder="Enter Item Name"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="expenseAmount">Total Amount:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="expenseAmount"
                                                    value={expenseData.expenseAmount}
                                                    onChange={handleChange}
                                                    placeholder="Enter Total Amount"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="expenseNotes">Notes:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="expenseNotes"
                                                    value={expenseData.expenseNotes}
                                                    onChange={handleChange}
                                                    placeholder="Enter Notes"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Button type="submit" className="btn btn-primary">
                                                Update Expenses
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EditExpense;
