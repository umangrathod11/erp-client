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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link } from 'react-router-dom';



const ExerciseList = () => {
    const [exercise, setExercise] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedExercise(null);
    };
    const [exerciseData, setExerciseData] = useState({
        plan_name: '',
        exercise_type: '',
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

    const [selectedExercise, setSelectedExercise] = useState(null);

    const handleShowModal = (food) => {
        setSelectedExercise(food);
        setExerciseData({
            plan_name: food.plan_name || '',
            exercise_type: food.exercise_type || ''
        });
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!exerciseData.plan_name || !exerciseData.exercise_type) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            if (selectedExercise) {
                // Update existing food
                await axiosInstance.post(`/exercise-plan/update-exercise-plan?id=${selectedExercise._id}`, exerciseData);
            } else {
                // Add new food
                await axiosInstance.post('/exercise-plan/add-exercise-plan', exerciseData);
            }

            fetchData();
            setOpen(false);
            setExerciseData({
                plan_name: '',
                exercise_type: '',
            });
            setSelectedExercise(null);
            toast.success(selectedExercise ? 'Exercise updated successfully!' : 'Exercise added successfully!');
        } catch (error) {
            console.error('Error adding/updating Exercise plan:', error);
            toast.error('Error adding/updating Exercise plan. Please try again.');
        }
    };

    // Fetch admin data from API
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/exercise-plan/get-exercise-plan');
            setExercise(response.data.data);
        } catch (error) {
            console.error('Error fetching Exercise Plan:', error);
            toast.error('Error fetching Exercise Plan');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleExerciseRemove = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Exercise Plan!',
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
            await axiosInstance.post(`/exercise-plan/remove-exercise-plan?id=${userId}`);
            setExercise((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            toast.success('Exercise removed successfully');
        } catch (error) {
            console.error('Error removing Exercise:', error);
            toast.error('Error removing Exercise');
        }
    };

    const displayFood = exercise
        .map((exercise, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{exercise.plan_name}</td>
                <td>{exercise.exercise_type}</td>
                <td>
                    <div className="flex align-items-center list-user-action">
                        <Link
                            className="btn btn-sm btn-icon btn-primary"
                            to={`/dashboard/edit-exercise?exercise_id=${exercise._id}`}
                            style={{ marginLeft: '10px' }}
                        >
                            <span className="btn-inner">
                                <RemoveRedEyeIcon style={{ width: '32px', marginTop: '7px' }} />
                            </span>
                        </Link>
                        <button
                            style={{ marginLeft: '10px' }}
                            className="btn btn-sm btn-icon btn-danger"
                            onClick={() => handleExerciseRemove(exercise._id)}
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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setExerciseData((prevData) => ({
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
                                    <h4 className='card-title'>Exercise Details</h4>
                                </div>
                                <div className='header-title'>
                                    <Button className='btn btn-btn btn-primary' onClick={handleOpen}>
                                        Create Exercise
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
                                            <Button
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
                                            )}
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
                                                <th>Exercise Plan</th>
                                                <th>Exercise Type</th>

                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>{displayFood}</tbody>
                                    </table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* Food Modal */}
                <Modal show={open} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedExercise ? 'Update Exercise Plan' : 'Add Exercise Plan'}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3" controlId="plan_name">
                                        <Form.Label>Exercise Plan :</Form.Label>
                                        <Form.Control
                                            placeholder='Plan Name'
                                            type="text"
                                            name="plan_name"
                                            value={exerciseData.plan_name}
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
                                            value={exerciseData.exercise_type}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Exercise Category</option>
                                            <option value="Weight Loss">Weight Loss</option>
                                            <option value="Muscle Gain">Muscle Gain</option>
                                            <option value="Bodybuilding">Bodybuilding</option>
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
                                {selectedExercise ? 'Update Exercise Plan' : 'Add Exercise Plan'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
            <ToastContainer />
        </>
    );
};

export default ExerciseList;
