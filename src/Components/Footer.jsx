import React from 'react'

export const Footer = () => {
    return (
        <>
            <footer className=" mt-5 section bg-footer bg-dark">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="">
                                <h6 className="footer-heading text-uppercase text-white">
                                    Company
                                </h6>
                                <ul className="list-unstyled footer-link mt-4">
                                    <li>
                                        <a href="/about">About Us</a>
                                    </li>
                                    <li>
                                        <a href="/home">Home</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="">
                                <h6 className="footer-heading text-uppercase text-white">
                                    Shop
                                </h6>
                                <ul className="list-unstyled footer-link mt-4">
                                    <li>
                                        <a href="/">View products</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="">
                                <h6 className="footer-heading text-uppercase text-white">Help</h6>
                                <ul className="list-unstyled footer-link mt-4">
                                    <li>
                                        <a href="/home">Address </a>
                                    </li>
                                    <li>
                                        <a href="/home">353 Matsulu -C, Nelspruit Mpumalanga</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="">
                                <h6 className="footer-heading text-uppercase text-white">
                                    Contact Us
                                </h6>
                                <p className="contact-info mt-4">
                                    Contact us if need help withanything
                                </p>
                                <p className="contact-info">+27 79 264 7735</p>
                                <div className="mt-5">
                                    <ul className="list-inline">
                                        <li className="list-inline-item">
                                            <a href="#">
                                                <i className="fab facebook footer-social-icon fa-facebook-f" />
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#">
                                                <i className="fab twitter footer-social-icon fa-twitter" />
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#">
                                                <i className="fab google footer-social-icon fa-google" />
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#">
                                                <i className="fab apple footer-social-icon fa-apple" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>             
            </footer>

        </>


    )
}
