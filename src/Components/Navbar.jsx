import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import logo from '/images/logo.png';
import toast from 'react-hot-toast';
import './NavbarPage.css';
import { signup, signin } from '../hooks/Api';

export const Navbar = ({ count, loggedInUser, setLoggedInUser }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [signupForm, setSignupForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [signupErrors, setSignupErrors] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSignupInputChange = (e) => {
        const { name, value } = e.target;
        setSignupForm({ ...signupForm, [name]: value });
        setSignupErrors({ ...signupErrors, [name]: '' });
    };

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setLoginForm({ ...loginForm, [name]: value });
        setLoginErrors({ ...loginErrors, [name]: '' });
    };

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!signupForm.firstName.trim()) errors.firstName = 'First name is required';
        if (!signupForm.lastName.trim()) errors.lastName = 'Last name is required';
        if (!signupForm.email) errors.email = 'Email address is required';
        else if (!validateEmail(signupForm.email)) errors.email = 'Invalid email format';
        if (!signupForm.password) errors.password = 'Password is required';
        else if (signupForm.password.length < 6) errors.password = 'Password must be at least 6 characters';

        setSignupErrors(errors);

        if (Object.keys(errors).length === 0) {
            try {
                await signup(signupForm);
                toast.success('Signup successful. Please log in.', {
                    style: { border: '1px solid #4BB543', padding: '16px', color: '#4BB543' },
                    iconTheme: { primary: '#4BB543', secondary: '#FFFAEE' },
                });
                setSignupForm({ firstName: '', lastName: '', email: '', password: '' });
                setShowSignupModal(false);
                setShowLoginModal(true);
            } catch (error) {
                const message = error.response?.data?.message || 'Signup failed';
                toast.error(message, {
                    style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
                });
            }
        } else {
            Object.values(errors).forEach((error) =>
                toast.error(error, {
                    style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
                })
            );
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!loginForm.email) errors.email = 'Email address is required';
        else if (!validateEmail(loginForm.email)) errors.email = 'Invalid email format';
        if (!loginForm.password) errors.password = 'Password is required';
        else if (loginForm.password.length < 6) errors.password = 'Password must be at least 6 characters';

        setLoginErrors(errors);

        if (Object.keys(errors).length === 0) {
            try {
                const response = await signin(loginForm);
                const { token } = response.data;
                if (token) {
                    setLoggedInUser(token);
                    toast.success('Logged in successfully', {
                        style: { border: '1px solid #4BB543', padding: '16px', color: '#4BB543' },
                        iconTheme: { primary: '#4BB543', secondary: '#FFFAEE' },
                    });
                    setLoginForm({ email: '', password: '' });
                    setShowLoginModal(false);
                } else {
                    throw new Error('No token received');
                }
            } catch (error) {
                const message =
                    error.response?.status === 401
                        ? 'Invalid email or password'
                        : error.response?.data?.message || 'Login failed';
                toast.error(message, {
                    style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
                });
            }
        } else {
            Object.values(errors).forEach((error) =>
                toast.error(error, {
                    style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
                })
            );
        }
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
        setShowSignupModal(false);
        setSignupForm({ firstName: '', lastName: '', email: '', password: '' });
        setSignupErrors({ firstName: '', lastName: '', email: '', password: '' });
        setLoginForm({ email: '', password: '' });
        setLoginErrors({ email: '', password: '' });
    };

    const handleLoginModal = () => {
        setShowLoginModal(true);
        setShowSignupModal(false);
    };

    const handleSignupModal = () => {
        setShowSignupModal(true);
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        toast.success('Logged out successfully', {
            style: { border: '1px solid #4BB543', padding: '16px', color: '#4BB543' },
            iconTheme: { primary: '#4BB543', secondary: '#FFFAEE' },
        });
    };

    const checkUserLoggedIn = (e) => {
        e.preventDefault();
        if (!loggedInUser) {
            toast.error('Please log in to view your cart.', {
                style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
            });
        } else {
            navigate('/cart');
        }
    };

    const renderNavLinks = () => (
        <>
            <li className="nav-item">
                <NavLink to="/home" className="nav-link" activeClassName="active">
                    Home
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/products" className="nav-link" activeClassName="active">
                    Products
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/about" className="nav-link" activeClassName="active">
                    About
                </NavLink>
            </li>
            <li className="nav-item">
                <a href="/cart" onClick={checkUserLoggedIn} className="btn py-2 text-warning">
                    <i className="fa-solid fa-bag-shopping shopping-bag fs-5 position-relative">
            <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
              {count || 0}
            </span>
                    </i>
                </a>
            </li>
            <li className="nav-item dropdown">
                <button
                    className="btn btn-dark dropdown-toggle w-100 my-2"
                    type="button"
                    id="accountDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Account
                </button>
                <ul className="dropdown-menu w-100" aria-labelledby="accountDropdown">
                    {loggedInUser ? (
                        <li>
                            <button className="dropdown-item btn btn-dark" onClick={handleLogout}>
                                Log Out
                            </button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <button className="dropdown-item btn btn-dark" onClick={handleLoginModal}>
                                    Log In
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item btn btn-dark" onClick={handleSignupModal}>
                                    Sign Up
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </li>
        </>
    );

    return (
        <>
            <nav className="navbar navbar-dark navbar-expand-md bg-dark w-100" style={{ height: '100px' }}>
                <div className="container">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#navbarOffcanvas"
                        aria-controls="navbarOffcanvas"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <NavLink to="/home" className="navbar-brand">
                        <img src={logo} alt="Company Logo" className="w-250 items-center mb-8" width="300" height="70" />
                    </NavLink>
                    <div id="navbarCollapse" className="d-inline-flex">
                        <ul className="navbar-nav ms-auto d-sm-none d-md-inline-flex d-lg-inline-flex d-none">
                            {renderNavLinks()}
                        </ul>
                    </div>
                    <div className="offcanvas offcanvas-start bg-dark" id="navbarOffcanvas" tabIndex="-1" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title text-light" id="offcanvasNavbarLabel"></h5>
                            <button type="button" className="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">{renderNavLinks()}</ul>
                        </div>
                    </div>
                </div>
            </nav>

            <Modal show={showLoginModal} onHide={handleCloseModal} centered className="theme-modal">
                <Modal.Header closeButton className="theme-modal-header">
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body className="theme-modal-body">
                    <div className="text-center">
                        <img src={logo} alt="Company Logo" />
                        <h5 className="mt-3 mb-4">Log In</h5>
                    </div>
                    <Form onSubmit={handleLoginSubmit}>
                        <Form.Group controlId="formLoginEmail" className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={loginForm.email}
                                onChange={handleLoginInputChange}
                                isInvalid={!!loginErrors.email}
                            />
                            <Form.Control.Feedback type="invalid">{loginErrors.email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formLoginPassword" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={loginForm.password}
                                onChange={handleLoginInputChange}
                                isInvalid={!!loginErrors.password}
                            />
                            <Form.Control.Feedback type="invalid">{loginErrors.password}</Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Log In
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showSignupModal} onHide={handleCloseModal} centered className="theme-modal">
                <Modal.Header closeButton className="theme-modal-header">
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body className="theme-modal-body">
                    <div className="text-center">
                        <img src={logo} alt="Company Logo" />
                        <h5 className="mt-3 mb-4">Sign Up</h5>
                    </div>
                    <Form onSubmit={handleSignupSubmit}>
                        <Form.Group controlId="formSignupFirstName" className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                name="firstName"
                                value={signupForm.firstName}
                                onChange={handleSignupInputChange}
                                isInvalid={!!signupErrors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">{signupErrors.firstName}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formSignupLastName" className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                name="lastName"
                                value={signupForm.lastName}
                                onChange={handleSignupInputChange}
                                isInvalid={!!signupErrors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">{signupErrors.lastName}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formSignupEmail" className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={signupForm.email}
                                onChange={handleSignupInputChange}
                                isInvalid={!!signupErrors.email}
                            />
                            <Form.Control.Feedback type="invalid">{signupErrors.email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formSignupPassword" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Create a password"
                                name="password"
                                value={signupForm.password}
                                onChange={handleSignupInputChange}
                                isInvalid={!!signupErrors.password}
                            />
                            <Form.Control.Feedback type="invalid">{signupErrors.password}</Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Sign Up
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

Navbar.propTypes = {
    count: PropTypes.number.isRequired,
    loggedInUser: PropTypes.bool.isRequired,
    setLoggedInUser: PropTypes.func.isRequired,
};