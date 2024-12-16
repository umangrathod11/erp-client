import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../js/api';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const AddOffer = () => {
    const [offerEmail, setOfferEmail] = useState({
        offer_title: '',
        offer_description: '',
        offer_img_url: '',
        selectedFile: null, // Add selectedFile to state
    });

    const handleChange = (e) => {
        const { id, value, files } = e.target;

        if (id === 'fileInput' && files.length > 0) {
            const file = files[0];
            setOfferEmail({
                ...offerEmail,
                selectedFile: file,
                offer_img_url: URL.createObjectURL(file),
            });
        } else {
            setOfferEmail((prevData) => ({
                ...prevData,
                [id]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !offerEmail.offer_title ||
            !offerEmail.offer_description ||
            !offerEmail.selectedFile
        ) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            const formDataForUpload = new FormData();
            formDataForUpload.append('file', offerEmail.selectedFile);
            const uploadResponse = await axiosInstance.post('/file-upload', formDataForUpload);
            const imageUrl = uploadResponse.data.data.fileURL;

            const offerEmailToSend = {
                ...offerEmail,
                offer_img_url: imageUrl,
            };

            await axiosInstance.post('/offer/create', offerEmailToSend);

            setOfferEmail({
                offer_title: '',
                offer_description: '',
                offer_img_url: '',
                selectedFile: null,
            });

            toast.success('Offer Created successfully!');
        } catch (error) {
            console.error('Error Creating Offer:', error);
            toast.error('Error Creating Offer');
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
                                <h4 className="card-title">Create Offer</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="new-user-info">
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="offer_title">Offer Title :-</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="offer_title"
                                                    value={offerEmail.offer_title}
                                                    onChange={handleChange}
                                                    placeholder="Enter First Name"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="offer_description">Offer Description:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="offer_description"
                                                    value={offerEmail.offer_description}
                                                    onChange={handleChange}
                                                    placeholder="Enter Last Name"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <img
                                                alt='Photos'
                                                src={offerEmail.offer_img_url}
                                                style={{ borderRadius: '10px', width: '20%' }}
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
                                        <Col md={12}>
                                            <Button type="submit" className="btn btn-primary mt-4">
                                                Create Offer
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

export default AddOffer;
