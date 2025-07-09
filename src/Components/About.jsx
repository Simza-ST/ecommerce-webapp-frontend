import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AboutPage.css'; // Make sure to import the CSS

const About = () => {
    return (
        <Container className="about-section mx-auto" style={{ marginTop: '80px' }}>
            <Row className="justify-content-center mt-5">
                <Col lg={8}>
                    <h2 className="about-heading">Our Story</h2>
                    <p className="about-text">
                        At Thembi's Bold Bite Bazaar, our story is one woven with love, tradition, and a fiery passion for flavor. Nestled in the heart of our kitchen, where every jar is crafted with care, lies the secret to our beloved Atchar and Chilli.
                    </p>
                    <p className="about-text">
                        It all began generations ago, with recipes passed down from our ancestors, each flavor-infused memory a testament to our heritage. From the vibrant spices to the freshest produce, every ingredient tells a story of its own, carefully selected to evoke a symphony of taste.
                    </p>
                    <p className="about-text">
                        What sets us apart is not just the ingredients we use, but the love and dedication infused into every jar. Our artisans pour their hearts into every batch, stirring in memories of laughter and the warmth of family gatherings. It's this essence that makes each spoonful a journey through time and tradition.
                    </p>
                    <p className="about-text">
                        As we stir the pot, we're not just creating condiments; we're crafting experiences that bring people together. From the first tangy bite to the lingering heat that dances on your tongue, our Atchar and Chilli are more than just flavors – they're a celebration of life, love, and the joy of sharing good food with those we cherish.
                    </p>
                    <p className="about-text">
                        So, when you taste our Atchar and Chilli, know that you're not just savoring a condiment; you're tasting the love and passion of generations. From our kitchen to your table, we invite you to join us on this flavorful journey and experience the magic of Thembi's Bold Bite Bazaar.
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
