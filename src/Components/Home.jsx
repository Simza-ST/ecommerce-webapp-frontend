import React from 'react';
import image1 from '/images/BusinessCar1.jpg';
import image2 from '/images/BusinessOwer.jpg';
import atcharImage from '/images/chickprod3.jpg';
import chilliImage from '/images/prodchick1.jpg';
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
                                                  <h1>Welcome to Mom Lindi's Chickens</h1>
                                    <p>Selling the best and biggest chickens you have ever seen!</p>
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
                                    <h1>gets delivered at you own door steps when you buy more than 10</h1>
                                    <p>"you can also get them defeather and comes with every part on it except feathers"</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                <Row className="align-items-center justify-content-center mt-4 ms-8 text-center">
                    <Col>
                        <h1 className="text-center heading-animate">Click Below To Check Our Product!</h1>
                        <Carousel className="category-carousel">
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={atcharImage}
                                    alt="Atchar"
                                    style={{ height: '500px' }}
                                />
                                <Carousel.Caption>
                                    <h2 className="carousel-caption-custom">keeping our customers happy is our calling.</h2>
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
                                    <h2 className="carousel-caption-custom">The best you have ever seen delivered at your door step.</h2>
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
                                    <Card.Title className="ms-2">Sipho skhosane</Card.Title>
                                </div>
                                <Card.Text>
                                    "Ngiyativuma mine ngitsi i "Highly recommended them!!!""
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="testimonial-card">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-3">
                                    <AiFillStar className="star-icon" />
                                    <Card.Title className="ms-2">Themba Sibitane</Card.Title>
                                </div>
                                <Card.Text>
                                    "Both me and my wife work but we love our chicken freshly defeather it tests very refreshing and @Mom lindi always delivers the best !"
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