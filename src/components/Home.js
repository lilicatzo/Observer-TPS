import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import pilpres1 from './images/pilpres1.jpg';
import pilpres2 from './images/pilpres2.jpg';
import pilpres3 from './images/pilpres3.jpg';
import pilpres4 from './images/pilpres4.jpg';
import am1 from './images/am1.jpg';
import pg2 from './images/pg2.jpg';
import gm3 from './images/gm3.jpeg';
import './Home.css'; 

const Home = () => {
    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <div className="upper-section"> {/* Upper section with background image */}
                <Container className="mt-5 flex-grow-1">
                    <Row>
                        <Col md={6}>
                            <Carousel interval={2000} prevIcon={<span className="carousel-control-prev-icon"></span>} nextIcon={<span className="carousel-control-next-icon"></span>} className="custom-carousel">
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={pilpres1}
                                        alt="Pilpres 1"
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={pilpres2}
                                        alt="Pilpres 2"
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={pilpres3}
                                        alt="Pilpres 3"
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={pilpres4}
                                        alt="Pilpres 4"
                                    />
                                </Carousel.Item>
                            </Carousel>
                        </Col>
                        <Col md={6}>
                            <div className="text-box">
                                <h1>Welcome to Observer TPS</h1>
                                <p>Observer TPS is your gateway to easily access data about the presidential voting in Indonesia for the 2024 election.</p>
                                <p>We provide comprehensive information sourced from the <a href="https://data-pemilu.vercel.app/" target="_blank" rel="noopener noreferrer">SIREKAP API</a>, allowing you to stay informed about the voting trends and results.</p>
                                <p>Explore the latest data and make informed decisions with Observer TPS.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="lower-section"> {/* Lower section with plain white background */}
                <Container>
                    <Row>
                        <Col md={12}>
                            <h2 className="text-center mt-5">Hasil Akhir Rekapitulasi KPU (Final Results of KPU Recapitulation)</h2>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col md={4} className="text-center">
                            <div className="rounded-image-container">
                                <img
                                    className="rounded-image"
                                    src={am1}
                                    alt="Anis Muhaimin"
                                />
                            </div>
                            <h5><strong>Anies Baswedan-Muhaimin Iskandar:</strong> 40,971,906 suara</h5>
                        </Col>
                        <Col md={4} className="text-center">
                            <div className="rounded-image-container">
                                <img
                                    className="rounded-image"
                                    src={pg2}
                                    alt="Prabowo Gibran"
                                />
                            </div>
                            <h5><strong>Prabowo-Gibran:</strong> 96,214,691 suara</h5>
                        </Col>
                        <Col md={4} className="text-center">
                            <div className="rounded-image-container">
                                <img
                                    className="rounded-image"
                                    src={gm3}
                                    alt="Ganjar Mahfud"
                                />
                            </div>
                            <h5><strong>Ganjar Pranowo-Mahfud MD:</strong> 27,040,878 suara</h5>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Home;
