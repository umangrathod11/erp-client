import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../../../components/Card';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../js/api';
import TextField from '@mui/material/TextField';
import DrawIcon from '@mui/icons-material/Draw';
import html2pdf from 'html2pdf.js';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';


const EditeExercise = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const exercise_id = searchParams.get('exercise_id');
    const [exerciseList, setExerciseList] = useState([
        { exercise_name: '', rep_and_sets: '' },
    ]);
    const [exerciseCount, setExerciseCount] = useState(0);
    const [exerciseTableData, setExerciseTableData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const [exercisePlanData, setExercisePlanData] = useState({
        plan_name: '',
        exercise_type: '',
        exercise_id: '',
    });

    const [exercisesDetailsData, setExercisesDetailsData] = useState({
        day: '',
        exercise_name: '',
        rep_and_sets: '',
        exercise_id: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setExercisePlanData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        setExercisesDetailsData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };


    const [modalTitle, setModalTitle] = useState('Create Exercise');
    const [modalAction, setModalAction] = useState('createExercise');

    const handleShowModal = (exercisePlanData) => {
        setExercisesDetailsData({
            detail_id: exercisePlanData._id,
            day: exercisePlanData.day || '',
        });

        if (exercisePlanData._id) {
            setModalTitle('Update Exercise');
            setModalAction('updateExercise');
        } else {
            setModalTitle('Create Exercise');
            setModalAction('createExercise');
        }

        setOpen(true);
    };

    // Get Exercise Plan Data
    const fetchExercisePlanData = async () => {
        try {
            const response = await axiosInstance.get(`/exercise-details/get-exercise-details`);
            // Filter data based on exercise_id
            const filteredData = response.data.data.filter((exerciseData) => exerciseData.exercise_id === exercise_id);

            setExerciseTableData(filteredData);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Error fetching admin data');
        }
    };

    useEffect(() => {
        fetchExercisePlanData();
    }, []);

    //Get Exercise Data
    const fetchExerciseDetailsData = async (exercise_id) => {
        try {
            const response = await axiosInstance.get(`/exercise-plan/get-exercise-plan?id=${exercise_id}`);
            if (response.data && response.data.data) {
                const exercise = response.data.data[0];
                setExercisePlanData({
                    plan_name: exercise.plan_name,
                    exercise_type: exercise.exercise_type,
                    exercise_id: exercise._id
                });
            } else {
                console.error('No data found for exercise:', exercise_id);
                toast.error('No data found for exercise');
            }
        } catch (error) {
            console.error('Error fetching exercise data:', error);
            toast.error('Error fetching exercise data');
        }
    };

    useEffect(() => {
        if (exercise_id) {
            fetchExerciseDetailsData(exercise_id);
        }
    }, [exercise_id]);

    //Update Exercise Plan Details
    const handleExercisePlan = async () => {
        try {
            const response = await axiosInstance.post(`/exercise-plan/update-exercise-plan?id=${exercisePlanData.exercise_id}`, exercisePlanData);
            if (response.data && response.data.data) {
                toast.success('Exercise details updated successfully');
            } else {
                console.error('Error updating Exercise details:', response.data.message);
                toast.error('Error updating Exercise details');
            }
        } catch (error) {
            console.error('Error updating Exercise details:', error);
            toast.error('Error updating Exercise details');
        }
    };

    //Add Exercise PDF Data
    const handleCreateExercisePDF = async (e) => {
        e.preventDefault();
        if (!exercisesDetailsData.day) {
            toast.error('Please fill in Day required fields.');
            return;
        }

        const exerciseNames = exerciseList.map((exercise) => exercise.exercise_name);
        const repAndSets = exerciseList.map((exercise) => exercise.rep_and_sets);

        const updatedExercisePlanData = {
            day: exercisesDetailsData.day,
            exercise_id: exercisePlanData.exercise_id,
            exercise_name: exerciseNames,
            rep_and_sets: repAndSets,
        };

        try {
            await axiosInstance.post(
                '/exercise-details/add-exercise-details',
                updatedExercisePlanData
            );
            setOpen(false);
            fetchExercisePlanData();
            setExercisesDetailsData({
                day: '',
                exercise_name: '',
                rep_and_sets: '',
                exercise_id: '',
            });
            // Reset the exercise list to a default empty state
            setExerciseList([{ exercise_name: '', rep_and_sets: '' }]);
            toast.success('Exercise Created successfully!');
        } catch (error) {
            console.error('Error adding Exercise:', error);
            toast.error('Error adding Exercise. Please try again.');
        }
    };

    const displayExercise = exerciseTableData
        .map((exercise_data, index) => (
            <tr key={index}>
                <td style={{ width: '30px' }}>{index + 1}</td>
                <td className='text-start table-cell'>{exercise_data.day}</td>
                <td className='text-start table-cell'>
                    {exercise_data.exercise_name.map((exercise_name, exercise_nameIndex) => (
                        <span key={exercise_nameIndex}>
                            {exercise_nameIndex > 0 && <br />}
                            {exercise_name}
                        </span>
                    ))}
                </td>
                <td className='text-start table-cell'>
                    {exercise_data.rep_and_sets.map((rep_and_sets, rep_and_setsIndex) => (
                        <span key={rep_and_setsIndex}>
                            {rep_and_setsIndex > 0 && <br />}
                            {rep_and_sets}
                        </span>
                    ))}
                </td>
                <td className='text-start table-cell'>
                    <div className="flex align-items-center list-user-action">
                        {/* <Button
                            className="btn btn-sm btn-icon btn-success"
                            onClick={() => handleShowModal(exercise_data)}
                        >
                            <span className="btn-inner">
                                <DrawIcon style={{ width: '28px', marginTop: '7px' }} />
                            </span>
                        </Button> */}
                        <button
                            style={{ marginLeft: '6px' }}
                            className="btn btn-sm btn-icon btn-danger"
                            onClick={() => handleExerciseDetailsRemove(exercise_data._id)}
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



    const handleExerciseDetailsRemove = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Exercise Details!',
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
            await axiosInstance.post(`/exercise-details/remove-exercise-details?id=${userId}`);
            setExerciseTableData((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            toast.success('Exercise Details removed successfully');
        } catch (error) {
            console.error('Error removing Exercise Details:', error);
            toast.error('Error removing Exercise Details');
        }
    };

    //Update D Plan
    const handleUpdateExercisePDF = async (e) => {
        e.preventDefault();

        if (!exercisesDetailsData.day) {
            toast.error('Please fill in Day required fields.');
            return;
        }

        const exerciseNames = exerciseList.map((exercise) => exercise.exercise_name);
        const repAndSets = exerciseList.map((exercise) => exercise.rep_and_sets);

        const updatedExercisePlanData = {
            day: exercisesDetailsData.day,
            exercise_id: exercisePlanData.exercise_id,
            exercise_name: exerciseNames,
            rep_and_sets: repAndSets,
        };

        try {
            await axiosInstance.post(
                '/exercise-details/update-exercise-details',
                updatedExercisePlanData
            );
            setOpen(false);
            fetchExercisePlanData();
            setExercisesDetailsData({
                day: '',
                exercise_name: '',
                rep_and_sets: '',
                exercise_id: '',
            });
            // Reset the exercise list to a default empty state
            setExerciseList([{ exercise_name: '', rep_and_sets: '' }]);
            toast.success('Exercise Updated successfully!');
        } catch (error) {
            console.error('Error updating Exercise:', error);
            toast.error('Error updating Exercise. Please try again.');
        }
    };

    //Download PDF
    const pdfContainerRef = useRef(null);
    const handleDownloadPDF = () => {
        const element = pdfContainerRef.current;

        if (element) {
            const options = {
                margin: 6,
                filename: `${exercise_plan_name}.pdf`,
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
    const exercise_plan_name = exercisePlanData.plan_name
    const exercise_category = exercisePlanData.exercise_type

    const displayExercisePlanDataPDF = exerciseTableData.map((exercise_data, index) => (
        <tr key={index} className="page-break">
            <td className="table-cell text-start" style={{ verticalAlign: 'top', whiteSpace: 'normal' }}>{index + 1}</td>
            <td className="table-cell text-start" style={{ verticalAlign: 'top', whiteSpace: 'normal' }}>{exercise_data.day}</td>
            <td className="table-cell text-start" style={{ verticalAlign: 'top', whiteSpace: 'normal' }}>
                {exercise_data.exercise_name.map((exercise_name, exercise_nameIndex) => (
                    <span key={exercise_nameIndex} style={{ display: 'block' }}>
                        {exercise_name}
                    </span>
                ))}
            </td>
            <td className="table-cell text-start" style={{ verticalAlign: 'top', whiteSpace: 'normal' }}>
                {exercise_data.rep_and_sets.map((rep_and_sets, rep_and_setsIndex) => (
                    <span key={rep_and_setsIndex} style={{ display: 'block' }}>
                        {rep_and_sets}
                    </span>
                ))}
            </td>
        </tr>
    ));



    const handleAddExercise = () => {
        setExerciseCount((prevCount) => prevCount + 1);
        setExerciseList((prevList) => [...prevList, { exercise_name: '', rep_and_sets: '' }]);
        setExercisesDetailsData((prevData) => ({
            ...prevData,
            exercise_id: '',
        }));
    };

    const handleRemoveExercise = (index) => {
        setExerciseCount((prevCount) => prevCount - 1);
        setExerciseList((prevList) => prevList.filter((_, i) => i !== index));
    };

    const handleExerciseChange = (index, field, value) => {
        const updatedExerciseList = [...exerciseList];
        updatedExerciseList[index][field] = value;
        setExerciseList(updatedExerciseList);
    };


    const displayExerciseFields = exerciseList.map((exercise, index) => (
        <div key={index} className="row mb-3">
            <div className="col-md-6">
                <div className="form-outline">
                    <label className="form-label">Exercise Name</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter Exercise Name"
                        className="form-control"
                        value={exercise.exercise_name}
                        onChange={(e) =>
                            handleExerciseChange(index, 'exercise_name', e.target.value)
                        }
                    />
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-outline">
                    <label className="form-label">Rep and Sets</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter Rep and Sets"
                        className="form-control"
                        value={exercise.rep_and_sets}
                        onChange={(e) =>
                            handleExerciseChange(index, 'rep_and_sets', e.target.value)
                        }
                    />
                </div>
            </div>
            <div className="col-md-6 mt-2">
                <label className="form-label" style={{ marginRight: '5px' }}>Action</label>
                <button type="button" className="btn btn-danger px-2 py-1" onClick={() => handleRemoveExercise(index)}>
                    Remove
                </button>
            </div>
        </div>
    ));

    return (
        <div className='margintop'>
            <Row>
                <Col xl="12" lg="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h3 className="card-title">Exercise Plan</h3>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="new-user-info">
                                <form>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="plan_name">Exercise Plan:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="plan_name"
                                                    value={exercisePlanData.plan_name}
                                                    onChange={handleChange}
                                                    placeholder="Enter Exercise Plan"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="exercise_type">Exercise Category:</Form.Label>
                                                <Form.Select
                                                    id="exercise_type"
                                                    value={exercisePlanData.exercise_type}
                                                    onChange={handleChange}
                                                    placeholder="Select Exercise Category"
                                                >
                                                    <option value="">Select Exercise Category</option>
                                                    <option value="Weight Loss">Weight Loss</option>
                                                    <option value="Muscle Gain">Muscle Gain</option>
                                                    <option value="Bodybuilding">Weight Maintain</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Button onClick={handleExercisePlan} className="btn btn-primary">
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
                            <h4 className="card-title">Exercise PDF Create/Update</h4>
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
                                        id="user-list-table"
                                        className="table table-striped"
                                        role="grid"
                                        data-toggle="data-table"
                                    >
                                        <thead>
                                            <tr style={{ backgroundColor: '#78a7ff' }}>
                                                <th style={{ fontWeight: '600' }}>No.</th>
                                                <th style={{ fontWeight: '600' }}>Day</th>
                                                <th style={{ fontWeight: '600' }}>Exercise Name</th>
                                                <th style={{ fontWeight: '600' }}>Set/Reps</th>
                                                <th style={{ fontWeight: '600' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody> {exerciseTableData.length > 0 ? (
                                            displayExercise
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    Data not found.
                                                </td>
                                            </tr>
                                        )}</tbody>
                                        <thead>
                                            <tr style={{ backgroundColor: '#78a7ff' }}>
                                                <th style={{ fontWeight: '600' }}>No.</th>
                                                <th style={{ fontWeight: '600' }}>Day</th>
                                                <th style={{ fontWeight: '600' }}>Exercise Name</th>
                                                <th style={{ fontWeight: '600' }}>Set/Reps</th>
                                                <th style={{ fontWeight: '600' }}>Action</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </Col>
                            <Col md="6">
                                <div ref={pdfContainerRef}>
                                    <div className="">
                                        <div className="header-title text-center">
                                            <h4 className="card-title">Exercise Plan PDF</h4>
                                        </div>
                                    </div>
                                    <div class="border">
                                        <div class="diet-head mt-10 px-4">
                                            <p class="mb-0">Exercise Plan:- <span id="txt_set_meal">{exercise_plan_name}</span></p>
                                            <div class="row">
                                                <div class="col mt-2">
                                                    <p>Exercise Category:- <span id="txt_set_category">{exercise_category}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive mt-20">
                                            <table
                                                id="user-list-table"
                                                className="table table-striped"
                                                role="grid"
                                                data-toggle="data-table"
                                            >
                                                <thead>
                                                    <tr style={{ backgroundColor: '#78a7ff' }}>
                                                        <th className="table-header" style={{ fontWeight: '600' }}>No.</th>
                                                        <th className="table-header" style={{ fontWeight: '600' }}>Day</th>
                                                        <th className="table-header" style={{ fontWeight: '600' }}>Exercise Name</th>
                                                        <th className="table-header" style={{ fontWeight: '600' }}>Rep/Sets</th>
                                                    </tr>
                                                </thead>
                                                <tbody> {exerciseTableData.length > 0 ? (
                                                    displayExercisePlanDataPDF
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
                                                            Data not found.
                                                        </td>
                                                    </tr>
                                                )}</tbody>
                                            </table>
                                        </div>
                                        <div class="diet-notes mb-3 px-4">
                                            <h5 class="text-danger mb-1">Notes</h5>
                                            <ul style={{ listStyle: "disc" }}>
                                                <li>Exercise Routine: Stick to your exercise routine consistently for the best results.</li>
                                                <li>Warm-Up: Always start with a proper warm-up to prevent injury.</li>
                                                <li>Form and Technique: Maintain proper form and technique during exercises to avoid injury and maximize effectiveness.
                                                </li>
                                                <li>Progressive Overload: Gradually increase the intensity of your workouts to challenge your body.</li>
                                                <li>Rest Days: Include rest days in your routine to allow your body to recover.</li>
                                                <li>Hydration: Stay hydrated before, during, and after your workouts.</li>
                                                <li>Variety: Incorporate a variety of exercises to target different muscle groups and prevent boredom.
                                                </li>
                                                <li>Listen to Your Body: Pay attention to your body's signals and adjust your workouts accordingly.</li>
                                                <li>Cool Down: Finish each workout with a proper cool-down and stretching routine.</li>
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
                <Form onSubmit={modalAction === 'createExercise' ? handleCreateExercisePDF : handleUpdateExercisePDF}>
                    <Modal.Body>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3" controlId="day">
                                    <Form.Label>Enter Day:</Form.Label>
                                    <Form.Control
                                        placeholder='Enter day (ex. Monday)'
                                        type="text"
                                        name="day"
                                        value={exerciseList.day}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            {/* New Exercise Fields */}
                            {displayExerciseFields}

                            {/* Add Exercise Button */}
                            <div className="row mb-3">
                                <div className="col-md-6 mt-2">
                                    <button type="button" className="btn btn-primary" onClick={handleAddExercise}>
                                        + Add Exercise
                                    </button>
                                </div>
                            </div>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button className='btn btn-btn btn-primary' type='submit'>
                            Add Exercise Plan
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default EditeExercise;
