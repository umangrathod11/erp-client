import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '../../../components/Card';
import DrawIcon from '@mui/icons-material/Draw';
import TextField from '@mui/material/TextField';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axiosInstance from '../../../js/api';
import Swal from 'sweetalert2';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ReactPaginate from 'react-js-pagination';

const DietList = () => {
  const [diet, setDiet] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedFood(null);
  };
  const [dietData, setDietData] = useState({
    food_name: '',
    calories: '',
    carbs: '',
    protein: '',
    fats: '',
    quantity: '',
    quantity_unit: '',
  });

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const handleDateRangeButtonClick = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [state, setState] = useState([{}]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [selectedFood, setSelectedFood] = useState(null);

  const handleShowModal = (diet) => {
    setSelectedFood(diet);
    setDietData({
      plan_name: diet.plan_name || '',
      category_name: diet.category_name || '',
      days: diet.days || '',
      food_type: diet.food_type || '',
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dietData.plan_name || !dietData.category_name || !dietData.days || !dietData.food_type) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      if (selectedFood) {
        await axiosInstance.post(`/diet-plan/update-diet-plan?id=${selectedFood._id}`, dietData);
      } else {
        await axiosInstance.post('/diet-plan/add-diet-plan', dietData);
      }

      fetchData();
      setOpen(false);
      setDietData({
        food_name: '',
        calories: '',
        carbs: '',
        protein: '',
        fats: '',
        quantity: '',
        quantity_unit: '',
      });
      setSelectedFood(null); // Reset selected food
      toast.success(selectedFood ? 'Diet updated successfully!' : 'Diet plan Created successfully!');
    } catch (error) {
      console.error('Error adding/updating Food:', error);
      toast.error('Error adding/updating Food. Please try again.');
    }
  };

  // Fetch admin data from API
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/diet-plan/get-diet-plan');
      setDiet(response.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Error fetching admin data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFoodRemove = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Food!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        removeFood(userId);
      }
    });
  };

  const removeFood = async (userId) => {
    try {
      await axiosInstance.post(`/diet-plan/remove-diet-plan?id=${userId}`);
      setDiet((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success('Diet Plan removed successfully');
    } catch (error) {
      console.error('Error removing Duet Plan:', error);
      toast.error('Error removing Diet Plan');
    }
  };

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const offset = (activePage - 1) * itemsPerPage;

  const displayFood = diet
    .filter((diet_plan) =>
      diet_plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diet_plan.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diet_plan.food_type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(offset, offset + itemsPerPage)
    .map((diet_plan, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{diet_plan.plan_name}</td>
        <td>{diet_plan.category_name}</td>
        <td>{diet_plan.food_type}</td>
        <td>{diet_plan.days}</td>
        <td>
          <div className="flex align-items-center list-user-action">
            <Link
              className="btn btn-sm btn-icon btn-primary"
              to={`/dashboard/edit-diet?diet_id=${diet_plan._id}`}
              style={{ marginLeft: '10px' }}
            >
              <span className="btn-inner">
                <RemoveRedEyeIcon style={{ width: '32px', marginTop: '7px' }} />
              </span>
            </Link>
            <button
              style={{ marginLeft: '10px' }}
              className="btn btn-sm btn-icon btn-danger"
              onClick={() => handleFoodRemove(diet_plan._id)}
            >
              <span className="btn-inner">
                <svg
                  width="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                >
                  <path
                    d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M20.708 6.23975H3.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </td>
      </tr>
    ));

  const isSmallScreen = useMediaQuery('(max-width: 576px)');

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '8px',
    p: 3,
    ...(isSmallScreen && { width: '350px' }),
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setDietData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <>
      <div className='margintop'>
        <Row>
          <Col sm='12'>
            <Card>
              <Card.Header className='d-flex justify-content-between'>
                <div className='header-title'>
                  <h4 className='card-title'>Diets Details</h4>
                </div>
                <div className='header-title'>
                  <Button className='btn btn-btn btn-primary' onClick={handleOpen}>
                    Create Diet
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className='px-0' style={{ position: 'relative' }}>
                <div className='card-body pt-0'>
                  <div className='d-flex justify-content-between'>
                    <div className='header-title'>
                      <TextField
                        placeholder='Search'
                        id='outlined-size-small'
                        size='small'
                        className='search-filed'
                        style={{ marginRight: '10px', width: '300px' }}
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                      {/* <Button
                        className='btn btn-btn btn-primary ml-60 ml-md-0'
                        onClick={handleDateRangeButtonClick}
                        style={{ padding: '5px' }}
                      >
                        <DateRangeIcon style={{ color: '#fff' }} />
                      </Button>
                      {showDateRangePicker && (
                        <div
                          className='date-filter'
                          style={{
                            position: 'absolute',
                            left: '28%',
                            zIndex: '999',
                            boxShadow:
                              'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
                          }}
                        >
                          <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                          />
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
                <div className='table-responsive'>
                  <table
                    id='order-list-table'
                    className='table table-striped'
                    role='grid'
                    data-toggle='data-table'
                  >
                    <thead>
                      <tr className='ligth'>
                        <th>No.</th>
                        <th>Diet Plan</th>
                        <th>Food Category</th>
                        <th>Diet Type</th>
                        <th>Day Duration</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{displayFood}</tbody>
                  </table>
                </div>
                <ReactPaginate
                  activePage={activePage}
                  itemsCountPerPage={itemsPerPage}
                  totalItemsCount={diet.length}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* Food Modal */}
        <Modal show={open} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedFood ? 'Update Food' : 'Add Diet Plan'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="plan_name">
                    <Form.Label>Diet Plan :</Form.Label>
                    <Form.Control
                      placeholder='Plan Name'
                      type="text"
                      name="plan_name"
                      value={dietData.plan_name}
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
                      value={dietData.category_name}
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
                      value={dietData.food_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Food Type</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Eggitarian">Eggitarian</option>
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
                      value={dietData.days}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button className='btn btn-btn btn-primary' type='submit'>
                {selectedFood ? 'Update Food' : 'Add Diet Plan'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
};

export default DietList;
