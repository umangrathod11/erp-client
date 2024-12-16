import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap'
import Card from '../../../components/Card'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axiosInstance from '../../../js/api';


const EmployeeProfile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const employee_id = searchParams.get('employee_id');

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

  useEffect(() => {
    if (employee_id) {
      fetchEmployeeData(employee_id);
    }
  }, [employee_id]);

  const fetchEmployeeData = async (employee_id) => {
    try {
      const response = await axiosInstance.get(`/employee/get?id=${employee_id}`);

      // Check if response contains data
      if (response.data && response.data.data) {
        const employee = response.data.data[0];
        console.log(employee);

        setEmployeeData({
          first_name: employee.first_name,
          last_name: employee.last_name,
          contactNumber: employee.contactNumber,
          email: employee.email,
          employee_img_url: employee.employee_img_url,
          gender: employee.gender,
          address: employee.address,
          position: employee.position,
          dateOfBirth: employee.dateOfBirth && employee.dateOfBirth.split('T')[0],
          hireDate: employee.hireDate && employee.hireDate.split('T')[0],
          selectedFile: null,
        });
      } else {
        console.error('No data found for Employee:', employee_id);
        toast.error('No data found for Employee');
      }
    } catch (error) {
      console.error('Error fetching Employee data:', error);
      toast.error('Error fetching Employee data');
    }
  };


  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (id === 'fileInput' && files.length > 0) {
      const file = files[0];
      setEmployeeData({
        ...employeeData,
        selectedFile: file,
        employee_img_url: URL.createObjectURL(file), // Change 'client_img_url' to 'employee_img_url'
      });
    } else {
      setEmployeeData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleFileButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleUpdateEmployee = async () => {
    try {
      const formDataForUpload = new FormData(); // Use the FormData constructor
      formDataForUpload.append('file', employeeData.selectedFile);
      const uploadResponse = await axiosInstance.post('/file-upload', formDataForUpload);
      const imageUrl = uploadResponse.data.data.fileURL;

      const employeeDataToSend = {
        ...employeeData,
        employee_img_url: imageUrl,
      };

      const response = await axiosInstance.post(`/employee/update?id=${employee_id}`, employeeDataToSend);
      if (response.data && response.data.data) {
        toast.success('Employee details updated successfully');
      } else {
        console.error('Error updating Employee details:', response.data.message);
        toast.error('Error updating Employee details');
      }
    } catch (error) {
      console.error('Error updating Employee details:', error);
      toast.error('Error updating Employee details');
    }
  };


  return (
    <div className='margintop'>
      <Col xl="12" lg="12">
        <Row>
          <div className='col-12'>
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Employee Profile :- </h4>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="new-user-info">
                  <form>
                    <Row>
                      <Col md={4} className="text-center mt-3">
                        <img alt='Photos' src={employeeData.employee_img_url} style={{ borderRadius: '10px', width: '70%', height: '70%' }} />
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
                      <Col md={8}>
                        <Row>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="first_name">First Name :-</Form.Label>
                            <Form.Control
                              type="text"
                              id="first_name"
                              placeholder="Demo"
                              value={employeeData.first_name}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="last_name">Last Name :-</Form.Label>
                            <Form.Control
                              type="text"
                              id="last_name"
                              placeholder="Example Name"
                              value={employeeData.last_name}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="contactNumber">Mobile :-</Form.Label>
                            <Form.Control
                              type="text"
                              id="contactNumber"
                              placeholder="123456789"
                              value={employeeData.contactNumber}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="email">Email:</Form.Label>
                            <Form.Control
                              type="text"
                              id="email"
                              placeholder="exampleemail@gmail.com"
                              value={employeeData.email}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="gender">Gender :-</Form.Label>
                            <Form.Control
                              type="text"
                              id="gender"
                              value={employeeData.gender}
                              onChange={handleChange}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="position">Position :-</Form.Label>
                            <Form.Control
                              type="text"
                              id="position"
                              placeholder="HR Example"
                              value={employeeData.position}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="dateOfBirth">Date Of Birth :-</Form.Label>
                            <Form.Control
                              type="date"
                              id="dateOfBirth"
                              placeholder="123456789"
                              value={employeeData.dateOfBirth}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-6 form-group">
                            <Form.Label htmlFor="hireDate">Joining Date :-</Form.Label>
                            <Form.Control
                              type="date"
                              id="hireDate"
                              placeholder="123456789"
                              value={employeeData.hireDate}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className="col-md-12 form-group">
                            <Form.Label htmlFor="address">Address :-</Form.Label>
                            <Form.Control
                              type="text"
                              id="address"
                              placeholder="Demo App, Demo City, 12346"
                              value={employeeData.address}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Row>
                        <Button
                          type="button"
                          variant="btn btn-primary"
                          className="mt-2"
                          onClick={handleUpdateEmployee}
                        >
                          <LibraryAddCheckIcon /> Update Employee Details
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Row>
      </Col>
      <ToastContainer />
    </div>
  )
}

export default EmployeeProfile
