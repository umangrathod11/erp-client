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
import ReactPaginate from 'react-js-pagination';


const FoodList = () => {
  const [food, setFood] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedFood(null); // Reset selected food when closing the modal
  };
  const [foodData, setFoodData] = useState({
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

  const handleShowModal = (food) => {
    setSelectedFood(food);
    setFoodData({
      food_name: food.food_name || '',
      calories: food.calories || '',
      carbs: food.carbs || '',
      protein: food.protein || '',
      fats: food.fats || '',
      quantity: food.quantity || '',
      quantity_unit: food.quantity_unit || '',
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodData.food_name || !foodData.calories || !foodData.fats || !foodData.carbs || !foodData.quantity || !foodData.quantity_unit) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      if (selectedFood) {
        // Update existing food
        await axiosInstance.post(`/food/update?id=${selectedFood._id}`, foodData);
      } else {
        // Add new food
        await axiosInstance.post('/food/add', foodData);
      }

      fetchData();
      setOpen(false);
      setFoodData({
        food_name: '',
        calories: '',
        carbs: '',
        protein: '',
        fats: '',
        quantity: '',
        quantity_unit: '',
      });
      setSelectedFood(null); // Reset selected food
      toast.success(selectedFood ? 'Food updated successfully!' : 'Food added successfully!');
    } catch (error) {
      console.error('Error adding/updating Food:', error);
      toast.error('Error adding/updating Food. Please try again.');
    }
  };

  // Fetch admin data from API
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/food/get');
      setFood(response.data.data);
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
      await axiosInstance.post(`/food/remove?id=${userId}`);
      setFood((prevUsers) => prevUsers.filter((user) => user._id !== userId)); // Change 'id' to '_id'
      toast.success('User removed successfully');
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Error removing user');
    }
  };

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const offset = (activePage - 1) * itemsPerPage;

  const displayFood = food
    .filter((foodItem) =>
      foodItem.food_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(offset, offset + itemsPerPage)
    .map((foodItem, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{foodItem.food_name}</td>
        <td>{foodItem.fats}</td>
        <td>{foodItem.calories}</td>
        <td>{foodItem.carbs}</td>
        <td>{foodItem.protein}</td>
        <td>{foodItem.quantity}</td>
        <td>
          <div className="flex align-items-center list-user-action">
            <Button
              className="btn btn-sm btn-icon btn-success"
              onClick={() => handleShowModal(food)}
            >
              <span className="btn-inner">
                <DrawIcon style={{ width: '32px', marginTop: '7px' }} />
              </span>
            </Button>
            <button
              style={{ marginLeft: '10px' }}
              className="btn btn-sm btn-icon btn-danger"
              onClick={() => handleFoodRemove(foodItem._id)}
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
    setFoodData((prevData) => ({
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
                  <h4 className='card-title'>Food Details</h4>
                </div>
                <div className='header-title'>
                  <Button className='btn btn-btn btn-primary' onClick={handleOpen}>Add Food</Button>
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
                      )} */}
                    </div>
                  </div>
                </div>
                <div className='table-responsive'>
                  <table id='order-list-table' className='table table-striped' role='grid' data-toggle='data-table'>
                    <thead>
                      <tr className='ligth'>
                        <th>No.</th>
                        <th>Food Name</th>
                        <th>Fat</th>
                        <th>Calories</th>
                        <th>Carbohydrates</th>
                        <th>Protein</th>
                        <th>Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{displayFood}</tbody>
                  </table>
                </div>
                <ReactPaginate
                  className={{ justifyContent: 'end' }}
                  activePage={activePage}
                  itemsCountPerPage={itemsPerPage}
                  totalItemsCount={food.length}
                  pageRangeDisplayed={3}
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
            <Modal.Title>{selectedFood ? 'Update Food' : 'Add Food'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
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
                  <Form.Group className="mb-3" controlId="quantity_unit">
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
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button className='btn btn-btn btn-primary' type='submit'>
                {selectedFood ? 'Update Food' : 'Add Food'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
};

export default FoodList;
