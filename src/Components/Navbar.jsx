import { NavLink, useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import logo from "/images/logo.png";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './NavbarPage.css';
export const Navbar = ({ count, loggedInUser, setLoggedInUser }) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [signupForm, setSignupForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [signupErrors, setSignupErrors] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });

    const handleSignupInputChange = (e) => {
        const { name, value } = e.target;
        setSignupForm({ ...signupForm, [name]: value });
    };

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setLoginForm({ ...loginForm, [name]: value });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        let errors = {};
        // Validation checks
        if (signupForm.firstName.trim() === '') {
            errors.firstName = 'First name is required';
        }
        if (signupForm.lastName.trim() === '') {
            errors.lastName = 'Last name is required';
        }
        if (!signupForm.email.includes('@')) {
            errors.email = 'Invalid email format';
        }
        if (signupForm.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        setSignupErrors(errors);

        if (Object.keys(errors).length === 0) {
            try {
                await axios.post('https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/user/signup', signupForm);
                toast.success("Signup successful. Please log in.", {
                    style: {
                        border: '1px solid #4BB543',
                        padding: '16px',
                        color: '#4BB543',
                    },
                });
                setShowSignupModal(false);
                       
            } catch (error) {
                console.error('Signup error:', error.response.data);
                toast.error(error.response.data.message, {
                style: {
                    border: '1px solid #FF0000',
                    padding: '16px',
                    color: '#FF0000',
                },
                });
            }
        } else {
            Object.values(errors).forEach(error => {
                toast.error(error, {
                    position: "top-center",
                    autoClose: 5000,
                });
            });
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        let errors = {};
        let errorOccurred = false;

        // Validation checks
        if (!loginForm.email) {
            errors.email = 'Email address is required';
            errorOccurred = true;
        } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
            errors.email = 'Invalid email format';
            errorOccurred = true;
        }

        if (!loginForm.password) {
            errors.password = 'Password is required';
            errorOccurred = true;
        } else if (loginForm.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            errorOccurred = true;
        }

        setLoginErrors(errors);

        if (!errorOccurred) {
            try {
                const response = await axios.post('https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/user/signin', loginForm);
                console.log('Login response:', response.data);
                const  token = response.data.token;// Use the passed callback
                if (token) {
                    setLoggedInUser(token);
                    toast.success("Logged in successfully", {
                    style: {
                        border: '1px solid #4BB543',
                        padding: '16px',
                        color: '#4BB543',
                    },
                    });
                    setShowLoginModal(false); 
                }else{
                    throw new Error("Login failed: No token received");
                }
            } catch (error) {
                console.error('Login error:', error.response.data);
                if (error.response && error.response.status === 401) {
                    toast.error("Invalid email or password.", {
                        position: "top-center",
                        autoClose: 5000,
                    });
                } else {
                    // Handle other errors differently
                    toast.error("Your Email or Password is incorrect, Please try again.", {
                        position: "top-center",
                        autoClose: 5000,
                    });
                }
                console.error('Login error:', error.response ? error.response.data : error);
            }
        } else {
            // Show toasts for all the validation errors
            Object.values(errors).forEach(err => {
                toast.error(err, {
                    position: "top-center",
                    autoClose: 5000,
                });
            });
        }
    };

    const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    };

    const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    };

    const handleLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false); // Close signup modal when login modal opens
    };

    const handleSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false); // Close login modal when signup modal opens
    };

    const handleLogout = () => {
        console.log('Logging out...');
        setLoggedInUser(null, null); // Clear user state
        toast.success("Logged out successfully", {
          style: {
            border: '1px solid #4BB543',
            padding: '16px',
            color: '#4BB543',
          },
        });
      };

    let navigate = useNavigate();

    const checkUserLoggedIn = (e) => {
        e.preventDefault(); // Always prevent the default anchor action.
        
        if (!loggedInUser) {
          toast.error("Please log in to view your cart.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          navigate('/cart'); // Navigate only if the user is logged in.
        }
    };

    return (
        <>
            <nav className="navbar navbar-dark navbar-expand-md bg-dark w-100" style={{ height: '100px' }}>
                <div className="container ">
                    <button className="navbar-toggler " type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#navbarOffcanvas" aria-controls="navbarOffcanvas" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <i className="fa-solid fa-bars"></i>

                    </button>
                    < NavLink to="/home" className = "navbar-brand">
                        <img src={logo} alt="." className="w-250 items-center mb-8 " width="300" height="70" />
                    </NavLink>
                   
                    <div id="navbarCollapse" className="d-inline-flex">
                        <ul className="navbar-nav ms-auto d-sm-none d-md-inline-flex d-lg-inline-flex d-none">
                            <li className="nav-item">
                                <a href="/home" className="nav-link active">
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link active">
                                    Products
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/about" className="nav-link active">
                                    About
                                </a>
                            </li>
                            <ul className='navbar-nav d-sm-inline-flex d-md-inline-flex d-lg-inline-flex d-inline-flex'>
                                <li className="nav-item">
                                    <a href="/cart" onClick={checkUserLoggedIn} className="btn py-2 text-warning">
                                        <i className="fa-solid fa-bag-shopping shopping-bag fs-5 position-relative">
                                            <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                                                {count}
                                            </span>
                                        </i>
                                    </a>
                                </li>
                            </ul>
                            <li className="nav-item dropdown">
                                <button className="btn btn-dark dropdown-toggle w-100 my-2" type="button" id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Account
                                </button>
                                <ul className="dropdown-menu w-100" aria-labelledby="accountDropdown">
                                {loggedInUser ? (
                                    <li><button className="dropdown-item btn btn-dark" onClick={handleLogout}>Log Out</button></li>
                                ) : (
                                    <>
                                    <li><button className="dropdown-item btn btn-dark" onClick={handleLoginModal}>Log In</button></li>
                                    <li><button className="dropdown-item btn btn-dark" onClick={handleSignupModal}>Sign Up</button></li>
                                    </>
                                )}
                                </ul>
                            </li>
                        </ul>
                    </div>
                    

                    <div className="offcanvas offcanvas-start bg-dark" id="navbarOffcanvas" tabIndex="-1"
                        aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title text-light" id="offcanvasNavbarLabel"></h5>
                            <button type="button" className="btn-close  btn-close-white text-reset"
                                data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <div className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <a className="menu-item m-3" aria-current="page" href="/home">Home</a>
                                <a className="menu-item m-3" href="/">Products</a>
                                <a className="menu-item m-3" href="/about">About</a>
                                <li className="nav-item dropdown">
                                    <button className="btn btn-dark dropdown-toggle w-100 my-2" type="button" id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    Account
                                    </button>
                                    <ul className="dropdown-menu w-100" aria-labelledby="accountDropdown">
                                    {loggedInUser ? (
                                        <li><button className="dropdown-item btn btn-dark" onClick={handleLogout}>Log Out</button></li>
                                    ) : (
                                        <>
                                        <li><button className="dropdown-item btn btn-dark" onClick={handleLoginModal}>Log In</button></li>
                                        <li><button className="dropdown-item btn btn-dark" onClick={handleSignupModal}>Sign Up</button></li>
                                        </>
                                    )}
                                    </ul>
                                </li>
                                <ul className='navbar-nav d-sm-inline-flex d-md-inline-flex d-lg-inline-flex d-inline-flex'>
                                    <li className="nav-item">
                                        <a href="/cart" onClick={checkUserLoggedIn} className="btn py-2 text-warning">
                                            <i className="fa-solid fa-bag-shopping shopping-bag fs-5 position-relative">
                                                <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                                                    {count}
                                                </span>
                                            </i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Login Modal */}
            <Modal show={showLoginModal} onHide={handleCloseModal} centered className="theme-modal">
            <Modal.Header closeButton className="theme-modal-header">
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body className="theme-modal-body">
                <div className="text-center">
                    <img src={logo} alt="Logo" />
                    <h5 className="mt-3 mb-4">Log In</h5>
                </div>
                <Form onSubmit={handleLoginSubmit}>
                <Form.Group controlId="formLoginEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginInputChange}
                    isInvalid={!!loginErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                    {loginErrors.email}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formLoginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginInputChange}
                    isInvalid={!!loginErrors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                    {loginErrors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <div className="d-grid gap-2 mt-3">
                    <Button variant="primary" type="submit">
                    Log In
                    </Button>
                </div>
                </Form>
            </Modal.Body>
            </Modal>

            {/* Signup Modal */}
            <Modal show={showSignupModal} onHide={handleCloseModal} centered className="theme-modal">
                <Modal.Header closeButton className="theme-modal-header">
                <Modal.Title>Sign Up Form</Modal.Title>
                </Modal.Header>
                <Modal.Body className="theme-modal-body">
                <div className="text-center">
                    <img src={logo} alt="Logo" />
                    <h5 className="mt-3 mb-4">Sign Up</h5>
                </div>
                <Form onSubmit={handleSignupSubmit}>
                    <Form.Group controlId="formSignupFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        name="firstName"
                        value={signupForm.firstName}
                        onChange={handleSignupInputChange}
                    />
                    {signupErrors.firstName && <Form.Text className="text-danger">{signupErrors.firstName}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="formSignupLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        name="lastName"
                        value={signupForm.lastName}
                        onChange={handleSignupInputChange}
                    />
                    {signupErrors.lastName && <Form.Text className="text-danger">{signupErrors.lastName}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="formSignupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={signupForm.email}
                        onChange={handleSignupInputChange}
                        isInvalid={!!signupErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {signupErrors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formSignupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                        type="password"
                        placeholder="Create a password"
                        name="password"
                        value={signupForm.password}
                        onChange={handleSignupInputChange}
                        isInvalid={!!signupErrors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                        {signupErrors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-grid gap-2 mt-3">
                        <Button variant="primary" type="submit">
                        Sign Up
                        </Button>
                    </div>
                    </Form>
                </Modal.Body>
                </Modal>
            <ToastContainer />
        </>
    )
}