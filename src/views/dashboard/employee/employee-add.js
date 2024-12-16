import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import photo from '../../../assets/images/avatars/avatar9.jpg';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axiosInstance from '../../../js/api';

const AddEmployee = () => {
    const [employeeData, setEmployeeData] = useState({
        first_name: '',
        last_name: '',
        contactNumber: '',
        dateOfBirth: '',
        email: '',
        employee_img_url: '',
        position: '',
        gender: '',
        address: '',
        hireDate: '',
        selectedFile: null,
    });

    const handleChange = (e) => {
        const { id, value, files } = e.target;

        if (id === 'fileInput' && files.length > 0) {
            const file = files[0];
            setEmployeeData({
                ...employeeData,
                selectedFile: file,
                employee_img_url: URL.createObjectURL(file),
            });
        } else {
            setEmployeeData((prevData) => ({
                ...prevData,
                [id]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !employeeData.first_name ||
            !employeeData.last_name ||
            !employeeData.contactNumber ||
            !employeeData.dateOfBirth ||
            !employeeData.email ||
            !employeeData.gender ||
            !employeeData.address ||
            !employeeData.hireDate ||
            !employeeData.position ||
            !employeeData.selectedFile
        ) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            const formDataForUpload = new FormData(); // Use the FormData constructor
            formDataForUpload.append('file', employeeData.selectedFile);
            const uploadResponse = await axiosInstance.post('/file-upload', formDataForUpload);
            const imageUrl = uploadResponse.data.data.fileURL;

            const employeeDataToSend = {
                ...employeeData,
                employee_img_url: imageUrl,
            };

            await axiosInstance.post('/employee/create', employeeDataToSend);

            setEmployeeData({
                first_name: '',
                last_name: '',
                contactNumber: '',
                dateOfBirth: '',
                anniversaryDate: '',
                email: '',
                employee_img_url: '',
                position: '',
                gender: '',
                address: '',
                hireDate: '',
                selectedFile: null,
            });

            toast.success('User added successfully!');
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Error adding user');
        }
    };

    const handleFileButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className='margintop'>
            <Row>
                <Col xl="12" lg="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Add Employee :-</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="new-user-info">
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={4} className="text-center mt-3">
                                            <img
                                                alt='Photos'
                                                src={employeeData.employee_img_url}
                                                onError={(e) => {
                                                    e.target.src = { photo };
                                                }}
                                                style={{ borderRadius: '10px', width: '70%', height: '70%' }}
                                            />
                                            <div>
                                                <Button
                                                    type='button'
                                                    variant='btn btn-primary'
                                                    className='mt-2 px-2 py-1 mb-2'
                                                    onClick={handleFileButtonClick}
                                                >
                                                    <PhotoCameraIcon />
                                                </Button>
                                                <input
                                                    type='file'
                                                    id='fileInput'
                                                    className='d-none'
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <p
                                                className='mt-lg-2'
                                                style={{ color: 'red', fontSize: '14px', fontWeight: '600' }}
                                            >
                                                Note: Photo/Image Size Limit only 1 MB
                                            </p>
                                        </Col>
                                        <Col md={8} className="mt-3">
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label htmlFor="first_name">First Name:</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            id="first_name"
                                                            value={employeeData.first_name}
                                                            onChange={handleChange}
                                                            placeholder="Enter First Name"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label htmlFor="last_name">Last Name:</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            id="last_name"
                                                            value={employeeData.last_name}
                                                            onChange={handleChange}
                                                            placeholder="Enter Last Name"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label htmlFor="contactNumber">Mobile:</Form.Label>
                                                        <Form.Control
                                                            type="contactNumber"
                                                            id="contactNumber"
                                                            value={employeeData.contactNumber}
                                                            onChange={handleChange}
                                                            placeholder="Enter Mobile"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label htmlFor="email">Email:</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            id="email"
                                                            value={employeeData.email}
                                                            onChange={handleChange}
                                                            placeholder="Enter Email"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label htmlFor="dateOfBirth">Date of Birth :</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            id="dateOfBirth"
                                                            value={employeeData.dateOfBirth}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label htmlFor="gender">Gender:</Form.Label>
                                                        <Form.Select
                                                            id="gender"
                                                            value={employeeData.gender}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Other">Other</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label htmlFor="position">Position :</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            id="position"
                                                            value={employeeData.position}
                                                            onChange={handleChange}
                                                            placeholder='Enter Position'
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label htmlFor="hireDate">Join Date:</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            id="hireDate"
                                                            value={employeeData.hireDate}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label htmlFor="address">Address :</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            id="address"
                                                            value={employeeData.address}
                                                            onChange={handleChange}
                                                            placeholder='Enter Membership Name'
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12} className='text-end'>
                                                    <Button type="submit" className="btn btn-primary">
                                                        Add Employee
                                                    </Button>
                                                </Col>
                                            </Row>
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

export default AddEmployee;
