import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import Card from '../../../components/Card';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../js/api';
import TextField from '@mui/material/TextField';
import DrawIcon from '@mui/icons-material/Draw';
import html2pdf from 'html2pdf.js';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';


const MealData = () => {
    const [foodList, setFoodList] = useState([]);
    const [mealtblData, setMealtblData] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const diet_id = searchParams.get('diet_id');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };
    const [selectedFood, setSelectedFood] = useState('');
    const [dietData, setDietData] = useState({
        plan_name: '',
        category_name: '',
        days: '',
        food_type: '',
        diet_id: '',
    });
    const [mealData, setMealData] = useState({
        meal_name: '',
        meal_time: '',
        food: [],
        diet_id: '',
        detail_id: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setDietData((prevData) => ({
            ...prevData,
            [id]: value,
        }));

        setMealData((prevData) => ({
            ...prevData,
            [id]: id === 'food' ? handleFoodChange(prevData.food, value) : value,
        }));
    };

    const handleFoodChange = (existingFood, newValue) => {
        // Check if existingFood is an array
        if (Array.isArray(existingFood)) {
            // If it's an array, create a new array by updating the first element
            return [newValue, ...existingFood.slice(1)];
        } else {
            // If it's a string, return an array with the new value
            return [newValue];
        }
    };

    const [modalTitle, setModalTitle] = useState('Create Meal');
    const [modalAction, setModalAction] = useState('createMeal');

    const handleShowModal = (mealData) => {
        setSelectedFood(mealData);

        setMealData({
            detail_id: mealData._id,
            meal_name: mealData.meal_name || '',
            meal_time: mealData.meal_time || '',
            food: mealData.food || '',
        });

        // Convert existing foods to react-select format with quantities
        const existingFoods = mealData.food.map((food) => ({
            value: food.food_name,
            label: `${food.food_name} - ${food.quantity} ${food.quantity_unit}`,
            quantity: food.quantity,
        }));

        setSelectedFoods(existingFoods);

        // Determine whether it's an update or create
        if (mealData._id) {
            // If the mealData has an _id, it's an update
            setModalTitle('Update Meal');
            setModalAction('updateMeal'); // This can be used as a handler identifier
        } else {
            // If there is no _id, it's a new meal
            setModalTitle('Create Meal');
            setModalAction('createMeal'); // This can be used as a handler identifier
        }

        setOpen(true);
    };

    //Get Food Data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/food/get');
                setFoodList(response.data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Error fetching user data');
            }
        };

        fetchUserData();
    }, []);


    // Get Meal Plan Data
    const fetchMealData = async () => {
        try {
            const response = await axiosInstance.get(`/diet-details/get-diet-details`);

            // Filter data based on exercise_id
            const filteredData = response.data.data.filter((exerciseData) => exerciseData.diet_id === diet_id);

            setMealtblData(filteredData);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Error fetching admin data');
        }
    };

    useEffect(() => {
        fetchMealData();
    }, [diet_id]);

    //Get Diet Data
    const fetchDietData = async (diet_id) => {
        try {
            const response = await axiosInstance.get(`/diet-plan/get-diet-plan?id=${diet_id}`);

            if (response.data && response.data.data) {
                const diet = response.data.data[0];
                setDietData({
                    plan_name: diet.plan_name,
                    category_name: diet.category_name,
                    days: diet.days,
                    food_type: diet.food_type,
                    diet_id: diet._id
                });
            } else {
                console.error('No data found for diet:', diet_id);
                toast.error('No data found for diet');
            }
        } catch (error) {
            console.error('Error fetching diet data:', error);
            toast.error('Error fetching diet data');
        }
    };

    useEffect(() => {
        if (diet_id) {
            fetchDietData(diet_id);
        }
    }, [diet_id]);

    //Update Diet Plan Details
    const handleDietPlan = async () => {
        try {
            const response = await axiosInstance.post(`/diet-plan/update-diet-plan?id=${dietData.diet_id}`, dietData);
            if (response.data && response.data.data) {
                toast.success('Diet details updated successfully');
            } else {
                console.error('Error updating Diet details:', response.data.message);
                toast.error('Error updating Diet details');
            }
        } catch (error) {
            console.error('Error updating Diet details:', error);
            toast.error('Error updating Diet details');
        }
    };

    const handleQuantityChange = (e, index) => {
        const { value } = e.target;

        setSelectedFoods((prevFoods) =>
            prevFoods.map((food, i) =>
                i === index
                    ? {
                        ...food,
                        quantity: value,
                    }
                    : food
            )
        );
    };

    const handleFoodNameChange = (e, index) => {
        const { value } = e.target;

        setMealData((prevData) => ({
            ...prevData,
            food: Array.isArray(prevData.food) ? prevData.food.map((food, i) =>
                i === index ? value : food
            ) : [value],
        }));
    };

    //Add Meal Plan
    const handleCreateMeal = async (e) => {
        e.preventDefault();
        if (!mealData.meal_name || !mealData.meal_time) {
            toast.error('Please fill in all required fields.');
            return;
        }

        // Update the mealData object to include both food name and quantity
        setMealData((prevData) => ({
            ...prevData,
            diet_id: dietData.diet_id,
            food: selectedFoods.map(food => `${food.value} - ${food.quantity || 0}`),
        }));

        try {
            const updatedMealData = {
                ...mealData,
                diet_id: dietData.diet_id,
                // Update the food array to include concatenated name and quantity
                food: selectedFoods.map(food => `${food.value} - ${food.quantity || 0}`),
            };
            await axiosInstance.post('/diet-details/add-diet-details', updatedMealData);
            setOpen(false);
            fetchMealData();
            setMealData({
                meal_name: '',
                meal_time: '',
                food: '',
                diet_id: '',
            });

            toast.success('Meal Created successfully!');
        } catch (error) {
            console.error('Error adding Meal:', error);
            toast.error('Error adding Meal. Please try again.');
        }
    };


    const displayFood = mealtblData
        .map((meal_data, index) => (
            <tr key={index}>
                <td style={{ width: '30px' }}>{index + 1}</td>
                <td>{meal_data.meal_name}</td>
                <td>{meal_data.meal_time}</td>
                <td>
                    {meal_data.food.map((food, foodIndex) => (
                        <span key={foodIndex}>
                            {foodIndex > 0 && <br />}
                            {food}
                        </span>
                    ))}
                </td>
                <td>
                    <div className="flex align-items-center list-user-action">
                        <Button
                            className="btn btn-sm btn-icon btn-success"
                            onClick={() => handleShowModal(meal_data)}
                        >
                            <span className="btn-inner">
                                <DrawIcon style={{ width: '28px', marginTop: '7px' }} />
                            </span>
                        </Button>
                        <button
                            style={{ marginLeft: '6px' }}
                            className="btn btn-sm btn-icon btn-danger"
                            onClick={() => handleFoodRemove(meal_data._id)}
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
            await axiosInstance.post(`/diet-details/remove-diet-details?id=${userId}`);
            setMealtblData((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            toast.success('Diet Plan removed successfully');
        } catch (error) {
            console.error('Error removing Duet Plan:', error);
            toast.error('Error removing Diet Plan');
        }
    };

    // Update Meal Plan
    const handleUpdateMeal = async (e) => {
        e.preventDefault();

        if (!mealData.meal_name || !mealData.meal_time) {
            toast.error('Please fill in all required fields.');
            return;
        }

        setMealData((prevData) => ({
            ...prevData,
            diet_id: dietData.diet_id,
            // Use selectedFoods to update food array
            food: selectedFoods.map((food) => food.value),
        }));

        try {

            const updatedMealData = {
                ...mealData,
                diet_id: dietData.diet_id,
                food: mealData.food,
            };

            // Use the mealData._id to identify the meal being updated
            await axiosInstance.post(`/diet-details/update-diet-details`, updatedMealData);

            setOpen(false);
            fetchMealData();
            setMealData({
                meal_name: '',
                meal_time: '',
                food: '',
                diet_id: '',
            });

            toast.success('Meal Updated successfully!');
        } catch (error) {
            console.error('Error updating Meal:', error);
            toast.error('Error updating Meal. Please try again.');
        }
    };

    //Download PDF
    const pdfContainerRef = useRef(null);
    const handleDownloadPDF = () => {
        const element = pdfContainerRef.current;

        if (element) {
            const options = {
                margin: 6,
                filename: `${diet_plan_name}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };

            html2pdf(element, options);
        } else {
            toast.error('Error generating PDF. Please try again.');
        }
    };

    //Data Show in PDF
    const diet_plan_name = dietData.plan_name
    const diet_category = dietData.category_name
    const food_type = dietData.food_type

    const displayMealDataPDF = mealtblData
        .map((meal_data, index) => (
            <tr key={index}>
                <td style={{ width: '30px', verticalAlign: 'top' }} className="table-cell text-start">{index + 1}</td>
                <td className="table-cell text-start" style={{ verticalAlign: 'top' }}>{meal_data.meal_name}</td>
                <td className="table-cell text-start" style={{ verticalAlign: 'top' }}>{meal_data.meal_time}</td>
                <td className="table-cell text-start" style={{ verticalAlign: 'top' }}>
                    {meal_data.food.map((food, foodIndex) => (
                        <span key={foodIndex}>
                            {foodIndex > 0 && <br />}
                            {food}
                        </span>
                    ))}
                </td>
            </tr>
        ));
    return (
        <div className='margintop'>
            <Row>
                <Col xl="12" lg="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h3 className="card-title">Diet Plan</h3>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="new-user-info">
                                <form>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="plan_name">Diet Plan:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="plan_name"
                                                    value={dietData.plan_name}
                                                    onChange={handleChange}
                                                    placeholder="Enter Diet Plan"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="category_name">Diet Category:</Form.Label>
                                                <Form.Select
                                                    id="category_name"
                                                    value={dietData.category_name}
                                                    onChange={handleChange}
                                                    placeholder="Select Diet Category"
                                                >
                                                    <option value="">Select Diet Category</option>
                                                    <option value="Weight Loss">Weight Loss</option>
                                                    <option value="Weight Gain">Weight Gain</option>
                                                    <option value="Weight Maintain">Weight Maintain</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
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
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="days">Total Day (Duration):</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="days"
                                                    value={dietData.days}
                                                    onChange={handleChange}
                                                    placeholder="(Duration)"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Button onClick={handleDietPlan} className="btn btn-primary">
                                                Update
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Col xl="12" lg="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between ">
                        <div className="header-title">
                            <h4 className="card-title">Diet Plan Create/Update</h4>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-2">
                        <Row>
                            <Col md="6">
                                <Card.Header className='d-flex justify-content-between align-items-center pt-0 mb-2 px-0'>
                                    <div className='header-title'>
                                        <Button className='btn btn-btn btn-primary px-15 py-1' onClick={handleOpen} style={{ fontSize: '16px' }}>
                                            Create
                                        </Button>
                                    </div>
                                    <div className='header-title'>
                                        <TextField
                                            placeholder='Search'
                                            id='outlined-size-small'
                                            size='small'
                                            className='search-filed'
                                            style={{ marginRight: '10px', width: '200px', padding: '6.5px 14px' }}
                                        />
                                    </div>
                                </Card.Header>
                                <div className="table-responsive">
                                    <table
                                        id="food-list-table"
                                        className="table table-striped"
                                        role="grid"
                                        data-toggle="data-table">
                                        <thead>
                                            <tr className="ligth">
                                                <th>No.</th>
                                                <th>Meal Name</th>
                                                <th>Meal Time</th>
                                                <th>Food</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody> {mealtblData.length > 0 ? (
                                            displayFood
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    Data not found.
                                                </td>
                                            </tr>
                                        )}</tbody>
                                        <thead>
                                            <tr className="ligth">
                                                <th>No.</th>
                                                <th>Meal Name</th>
                                                <th>Meal Time</th>
                                                <th>Food</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </Col>
                            <Col md="6">
                                <div ref={pdfContainerRef}>
                                    <div className="">
                                        <div className="header-title text-center">
                                            <h4 className="card-title">Diet Plan PDF</h4>
                                        </div>
                                    </div>
                                    <div class="border">
                                        <div class="diet-head mt-10 px-4">
                                            <p class="mb-0">Plan Name:- <span id="txt_set_meal">{diet_plan_name}</span></p>
                                            <div class="row">
                                                <div class="col mt-2">
                                                    <p>Diet Category:- <span id="txt_set_category">{diet_category}</span></p>
                                                </div>
                                                <div class="col px-0 mt-2">
                                                    <p>Food Type:- <span id="txt_set_food">{food_type}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive mt-20 px-2">
                                            <table
                                                id="food-list-table"
                                                className="table table-striped"
                                                role="grid"
                                                data-toggle="data-table"
                                                style={{ border: '1px solid #ddd' }}
                                            >
                                                <thead>
                                                    <tr style={{ backgroundColor: '#78a7ff' }}>
                                                        <th className="table-header" style={{ fontWeight: '600' }}>No.</th>
                                                        <th className="table-header" style={{ fontWeight: '600' }}>Meal Name</th>
                                                        <th className="table-header" style={{ fontWeight: '600' }}>Meal Time</th>
                                                        <th className="table-header" style={{ fontWeight: '600' }}>Food</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{mealtblData.length > 0 ? (
                                                    displayMealDataPDF
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center">
                                                            Data not found.
                                                        </td>
                                                    </tr>
                                                )}</tbody>
                                            </table>
                                        </div>
                                        <div class="diet-notes mb-3 px-4">
                                            <h5 class="text-danger mb-1">Notes</h5>
                                            <ul style={{ listStyle: "disc" }}>
                                                <li>Drink 3.5 liters of water.</li>
                                                <li>Do not use excessive amount of salt. Instated
                                                    use
                                                    rock salt.</li>
                                                <li>Do not use olive oil. Instated use ground nut
                                                    oil.
                                                </li>
                                                <li>Do not miss a meal.</li>
                                                <li class="text-danger">In Diet I give Protein
                                                    Powder If
                                                    You Have then you
                                                    take Otherwise not</li>
                                                <li>Must share your food updates</li>
                                                <li>Use green Vegetables as per market Availability
                                                </li>
                                                <li>Please do not ignore our instruction</li>
                                                <li>If Any question regarding diet or Exercise
                                                    please
                                                    call us</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="header-title text-center mt-20">
                                    <Button
                                        className="btn btn-btn btn-success px-3"
                                        onClick={handleDownloadPDF}
                                    >
                                        Download PDF
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            {/* Food Modal */}
            <Modal show={open} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={modalAction === 'createMeal' ? handleCreateMeal : handleUpdateMeal}>
                    <Modal.Body>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="meal_name">
                                    <Form.Label>Meal Name :</Form.Label>
                                    <Form.Control
                                        placeholder='Meal Name'
                                        type="text"
                                        name="meal_name"
                                        value={mealData.meal_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="meal_time">
                                    <Form.Label>Meal Time :</Form.Label>
                                    <Select
                                        options={[
                                            { value: 'Before Workout', label: 'Before Workout' },
                                            { value: 'After Workout', label: 'After Workout' },
                                            { value: '06:00 AM', label: '06:00 AM' },
                                            { value: '06:30 AM', label: '06:30 AM' },
                                            { value: '07:00 AM', label: '07:00 AM' },
                                            { value: '07:30 AM', label: '07:30 AM' },
                                            { value: '08:00 AM', label: '08:00 AM' },
                                            { value: '08:30 AM', label: '08:30 AM' },
                                            { value: '09:00 AM', label: '09:00 AM' },
                                            { value: '09:30 AM', label: '09:30 AM' },
                                            { value: '10:00 AM', label: '10:00 AM' },
                                            { value: '10:30 AM', label: '10:30 AM' },
                                            { value: '11:00 AM', label: '11:00 AM' },
                                            { value: '11:30 AM', label: '11:30 AM' },
                                            { value: '12:00 PM', label: '12:00 PM' },
                                            { value: '12:30 PM', label: '12:30 PM' },
                                            { value: '01:00 PM', label: '01:00 PM' },
                                            { value: '01:30 PM', label: '01:30 PM' },
                                            { value: '02:00 PM', label: '02:00 PM' },
                                            { value: '02:30 PM', label: '02:30 PM' },
                                            { value: '03:00 PM', label: '03:00 PM' },
                                            { value: '03:30 PM', label: '03:30 PM' },
                                            { value: '04:00 PM', label: '04:00 PM' },
                                            { value: '04:30 PM', label: '04:30 PM' },
                                            { value: '05:00 PM', label: '05:00 PM' },
                                            { value: '05:30 PM', label: '05:30 PM' },
                                            { value: '06:00 PM', label: '06:00 PM' },
                                            { value: '06:30 PM', label: '06:30 PM' },
                                            { value: '07:00 PM', label: '07:00 PM' },
                                            { value: '07:30 PM', label: '07:30 PM' },
                                            { value: '08:00 PM', label: '08:00 PM' },
                                            { value: '08:30 PM', label: '08:30 PM' },
                                            { value: '09:00 PM', label: '09:00 PM' },
                                            { value: '09:30 PM', label: '09:30 PM' },
                                            { value: '10:00 PM', label: '10:00 PM' },
                                            { value: '10:30 PM', label: '10:30 PM' },
                                            { value: '11:00 PM', label: '11:00 PM' },
                                        ]}
                                        value={{ value: mealData.meal_time, label: mealData.meal_time }}
                                        onChange={(selectedOption) => handleChange({ target: { id: 'meal_time', value: selectedOption.value } })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                {modalAction === 'createMeal' ? (
                                    <>
                                        <Form.Group className="mb-3 col-md-12">
                                            <Form.Label htmlFor="foodList">Food List :-</Form.Label>
                                            <Select
                                                id="foodList"
                                                isMulti
                                                options={foodList.map((food) => ({
                                                    value: food.food_name,
                                                    label: `${food.food_name}`,
                                                }))}
                                                value={selectedFoods}
                                                onChange={(selectedOptions) => setSelectedFoods(selectedOptions)}
                                                className="basic-multi-select w-100"
                                                classNamePrefix="select"
                                            />
                                        </Form.Group>
                                        {selectedFoods.map((selectedFood, index) => (
                                            <Form.Group key={index} className="mb-3 col-md-12">
                                                <Form.Label htmlFor={`quantity-${index}`}>{`Quantity for ${selectedFood.value} :`}</Form.Label>
                                                <Form.Control
                                                    id={`quantity-${index}`}
                                                    type="type"
                                                    placeholder={`Enter quantity for ${selectedFood.value}`}
                                                    value={selectedFood.quantity || ''}
                                                    onChange={(e) => handleQuantityChange(e, index)}
                                                />
                                            </Form.Group>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {Array.isArray(mealData.food) && mealData.food.map((food, index) => (
                                            <Form.Group key={index} className="mb-3 col-md-12">
                                                <Form.Label htmlFor={`food-${index}`}>{`Food Name ${index + 1}:`}</Form.Label>
                                                <Form.Control
                                                    id={`food-${index}`}
                                                    type="text"
                                                    placeholder={`Enter food name`}
                                                    value={food}
                                                    onChange={(e) => handleFoodNameChange(e, index)}
                                                />
                                            </Form.Group>
                                        ))}
                                    </>
                                )}
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button className='btn btn-btn btn-primary' type='submit'>
                            Add Meal Plan
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default MealData;
