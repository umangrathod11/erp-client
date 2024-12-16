import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from '../../../components/Card';
import axiosInstance from '../../../js/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DrawIcon from '@mui/icons-material/Draw';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TextField from '@mui/material/TextField';
import { DateRange } from 'react-date-range';

const ExpenseList = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await axiosInstance.get('/expense/get');
        if (!Array.isArray(response.data.data)) {
          console.error('Error: Response data is not an array');
          throw new Error('Invalid data format');
        }
        setExpenseData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch expense data');
      }
    };

    fetchExpenseData();
  }, []);

  const handleDateRangeButtonClick = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  const handleFilterChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredExpenseData = expenseData.filter((expense) => {
    const searchLowerCase = searchQuery.toLowerCase();
    return (
      expense.expenseName.toLowerCase().includes(searchLowerCase) ||
      expense.expenseAmount.toString().includes(searchLowerCase) ||
      expense.expenseNotes.toLowerCase().includes(searchLowerCase) ||
      expense.expensePaymentMethod.toLowerCase().includes(searchLowerCase) ||
      expense.expense_number.toString().includes(searchLowerCase)
    );
  });
  return (
    <>
      <div className="margintop">
        <Row>
          <Col sm="12">
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h3 className="card-title">Expenses Details</h3>
                </div>
                <div className="header-title">
                  <Link
                    className="btn btn-btn btn-primary px-3 mb-lg-0 mb-2 mr-10"
                    to="/dashboard/add-expense"
                    style={{ fontWeight: '600' }}
                  >
                    Add Expense
                  </Link>
                </div>
              </Card.Header>
              {/* <div className="mb-30 col-12 mt-30 container">
                <Row>
                  {[
                    {
                      icon: <LocalAtmIcon style={{ fontSize: '60px', color: '#004085' }} />,
                      value: '₹6,517/-',
                      label: 'Total Expenses',
                      bgColor: '#cce5ff',
                      textColor: '#004085',
                    },
                    {
                      icon: <AdsClickIcon style={{ fontSize: '56px', color: '#155724' }} />,
                      value: '₹0/-',
                      label: 'Total Ads',
                      bgColor: '#d4edda',
                      textColor: '#155724',
                    },
                    {
                      icon: <GroupAddIcon style={{ fontSize: '56px', color: '#856404' }} />,
                      value: '₹0/-',
                      label: 'Total Counseling',
                      bgColor: '#fff3cd',
                      textColor: '#856404',
                    },
                  ].map((item, index) => (
                    <Col key={index} className="col-md-4 col-10 mb-lg-0 mb-2">
                      <div
                        style={{
                          padding: '20px',
                          boxShadow: '2px 2px 10px #d2e5ff',
                          backgroundColor: item.bgColor,
                          borderRadius: '10px',
                        }}
                      >
                        <Row>
                          <div className="col-5 pl-0">
                            <div>{item.icon}</div>
                          </div>
                          <div className="col-7">
                            <span style={{ fontSize: '23px', fontWeight: '600', color: '#000' }}>{item.value}</span> <br />
                            <span style={{ opacity: '.8', color: item.textColor, fontSize: '16px' }}>
                              {item.label}
                            </span>
                          </div>
                        </Row>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div> */}
              <Card.Body className="px-0" style={{ position: 'relative' }}>
                <div className="card-body pt-0 ">
                  <div className="d-flex justify-content-between">
                    <div className="header-title">
                      <TextField
                        placeholder="Search"
                        id="outlined-size-small"
                        size="small"
                        className="search-field"
                        style={{ marginRight: '10px', width: '300px' }}
                        value={searchQuery}
                        onChange={handleFilterChange}
                      />
                    </div>
                    <div className="header-title">
                      <Button
                        className="btn btn-btn btn-primary ml-60 ml-md-0 mr-lg-10"
                        onClick={handleDateRangeButtonClick}
                        style={{ padding: '5px' }}
                      >
                        <DateRangeIcon style={{ color: '#fff' }} />
                      </Button>
                      {showDateRangePicker && (
                        <div
                          className="date-filter"
                          style={{
                            position: 'absolute',
                            left: '70%',
                            zIndex: '999',
                            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
                          }}
                        >
                          <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table
                    id="order-list-table"
                    className="table table-striped"
                    role="grid"
                    data-toggle="data-table"
                  >
                    <thead>
                      <tr className="ligth">
                        <th>Expenses No.</th>
                        <th>Expenses Category</th>
                        <th>Payment Method</th>
                        <th>Total Amount</th>
                        <th>Date</th>
                        <th>Notes</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenseData.map((expense, index) => (
                        <tr key={index}>
                          <td>{expense.expense_number}</td>
                          <td>{expense.expenseName}</td>
                          <td>{expense.expensePaymentMethod}</td>
                          <td>₹ {expense.expenseAmount}</td>
                          <td>{expense.date}</td>
                          <td>{expense.expenseNotes}</td>
                          <td>
                            <div className="flex align-items-center list-user-action">
                              <Link className="btn btn-sm btn-icon btn-success"
                                to={`/expense/update-expense?expense_id=${expense._id}`}>
                                <span className="btn-inner">
                                  <DrawIcon style={{ width: '32px', marginTop: '7px' }} />
                                </span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ExpenseList;
