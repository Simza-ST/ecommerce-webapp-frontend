import React from 'react';
import image1 from '/images/homeBackground.jpg';
import image2 from '/images/businessOwner.jpg';
import atcharImage from '/images/atcharHome.jpg';
import chilliImage from '/images/chillHome.jpg';
import { Container, Row, Col, Card, Button, Form, Carousel } from 'react-bootstrap';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';

const Home = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const message = e.target.elements.message.value;
        const url = `mailto:thembimthethwa74@gmail.com?subject=Message from website&body=${message}`;
        window.location.href = url;
    };

    const navigate = useNavigate(); // Hook for navigation

    const handleOrderProducts = () => {
        navigate('/'); // Navigate to the Products route
    };
    return (
        <div>
            <Container fluid>
                <Row className="align-items-center justify-content-center mt-2">
                    <Col>
                        <Carousel>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={image1}
                                    alt="First slide"
                                    style={{ height: '550px' ,marginTop: '30px' }}
                                />
                                <Carousel.Caption className="carousel-caption-custom">
                                    <h1>Welcome to Thembi's Bold Bite Bazaar</h1>
                                    <p>Selling the best Atchar and Chilli around!</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={image2}
                                    alt="Second slide"
                                    style={{ height: '550px', marginTop: '30px' }}
                                />
                                <Carousel.Caption className="carousel-caption-custom">
                                    <h1>Making delicious home-made atchar since '09!</h1>
                                    <p>"Bringing life and soul to the dinner table is what we do"</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                <Row className="align-items-center justify-content-center mt-4 ms-8 text-center">
                    <Col>
                        <h1 className="text-center heading-animate">Click Below To Check Out Our Products!</h1>
                        <Carousel className="category-carousel">
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={atcharImage}
                                    alt="Atchar"
                                    style={{ height: '500px' }}
                                />
                                <Carousel.Caption>
                                    <h2 className="carousel-caption-custom">Explore our delicious Atchar collection.</h2>
                                    <Button className="order-button" onClick={handleOrderProducts}>Order Products</Button>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={chilliImage}
                                    alt="Chilli"
                                    style={{ height: '500px' }}
                                />
                                <Carousel.Caption>
                                    <h2 className="carousel-caption-custom">Discover our succulent spicy Chilli products.</h2>
                                    <Button className="order-button" onClick={handleOrderProducts}>Order Products</Button>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                </Row>
                <Row className="align-items-center justify-content-center my-5">
                    <Col lg={8} className="testimonial-container">
                        <h2 className="testimonial-heading">Testimonials</h2>
                        <Card className="mb-4 testimonial-card">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                    <AiFillStar className="star-icon" />
                                    <Card.Title className="ms-2">John Doe</Card.Title>
                                </div>
                                <Card.Text>
                                    "The Atchar from Thembi's Bold Bite Bazaar is absolutely delicious! Highly recommended."
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="testimonial-card">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                    <AiFillStar className="star-icon" />
                                    <Card.Title className="ms-2">Jane Smith</Card.Title>
                                </div>
                                <Card.Text>
                                    "I can't get enough of the Chilli products from Thembi's Bold Bite Bazaar. They add the perfect kick to my meals!"
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Container fluid className="contact-form-container bg-black">
                    <Row className="align-items-center justify-content-center">
                        <Col lg={8} md={10}>
                            <h2 className="text-center text-grey-900 contact-heading">Contact Us</h2>
                            <Form onSubmit={handleSubmit} className="custom-form">
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label className="text-white">Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your name" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className="text-white">Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter your email" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicMessage">
                                    <Form.Label className="text-white">Message</Form.Label>
                                    <Form.Control as="textarea" rows={3} placeholder="Enter your message" name="message" />
                                </Form.Group>
                                <Button className="submit-button" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </div>
    );
};

export default Home;