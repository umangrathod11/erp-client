import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../js/api';

const AddExpense = () => {
  const [expenseData, setExpenseData] = useState({
    expense_number: '',
    date: '',
    expenseName: '',
    expensePaymentMethod: '',
    expenseItemName: '',
    expenseAmount: '',
    expenseNotes: '',
  });


  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get('/expense/get');
        console.log(response)
        if (response.data && response.data.data.length > 0) {
          const allData = response.data.data
          const sortedExpenses = allData[allData.length - 1]
          console.log(parseInt(sortedExpenses.expense_number) + 1)

          setExpenseData((prevData) => ({
            ...prevData,
            expense_number: parseInt(sortedExpenses.expense_number) + 1,
          }));
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast.error('Error fetching expenses');
      }
    };

    fetchExpenses();
  }, []);

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
      // Add the expenseData to the database
      const response = await axiosInstance.post('/expense/create', expenseData);

      if (response.data && response.data.error) {
        toast.error(`Error creating expense: ${response.data.error}`);
      } else {
        e.target.reset();
        toast.success('Expense added successfully!');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Error creating expense. Please try again.');
    }
  };

  return (
    <div className='margintop'>
      <Row>
        <Col xl="12" lg="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div className="header-title">
                <h4 className="card-title">Add Expenses</h4>
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
                          type="date"
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
                          <option value="" hidden>Select Payment Method</option>
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
                          <option value="" hidden>Select Expenses Category</option>
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
                        Add Expenses
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

export default AddExpense;
