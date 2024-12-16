import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../js/api';

const ViewOffer = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const offer_id = searchParams.get('offer_id');

    const [offerEmailData, setOfferEmailData] = useState({
        offer_title: '',
        offer_description: '',
        offer_img_url: '',
    });

    useEffect(() => {
        if (offer_id) {
            fetchOfferEmailData(offer_id);
        }
    }, [offer_id]);

    const fetchOfferEmailData = async (offer_id) => {
        try {
            const response = await axiosInstance.get(`/offer/get?id=${offer_id}`);

            // Check if response contains data
            if (response.data && response.data.data) {
                const offerData = response.data.data[0];

                setOfferEmailData({
                    offer_title: offerData.offer_title,
                    offer_description: offerData.offer_description,
                    offer_img_url: offerData.offer_img_url,
                });
            } else {
                console.error('No data found for Offer:', offer_id);
                toast.error('No data found for Offer');
            }
        } catch (error) {
            console.error('Error fetching Offer data:', error);
            toast.error('Error fetching Offer data');
        }
    };

    return (
        <div className='margintop'>
            <Row>
                <Col xl="12" lg="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Offer Details</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="new-user-info">
                                <form>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="offer_title">Offer Title :-</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="offer_title"
                                                    value={offerEmailData.offer_title}
                                                    readOnly
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="offer_description">Offer Description:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="offer_description"
                                                    value={offerEmailData.offer_description}
                                                    readOnly
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Form.Label>Offer Photo :</Form.Label>
                                        <Col md={12}>
                                            <img
                                                alt='Offer Phot'
                                                src={offerEmailData.offer_img_url}
                                                style={{ borderRadius: '10px', width: '20%' }}
                                            />
                                        </Col>
                                        <Col md={12}>
                                            <Link to='/offer-email' className="btn btn-primary mt-4">
                                                Go Back
                                            </Link>
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

export default ViewOffer;
