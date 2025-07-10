import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import './MycartPage.css';
import { Spinner } from 'react-bootstrap';

export const Cart = ({
                         cartItems,
                         handleRemoveFromCart,
                         handleUpdateCartQuantity,
                         subTotal,
                         createOrder,
                         createPDF,
                         orderDetails,
                         setOrderDetails,
                         isLoading,
                     }) => {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [formData, setFormData] = useState({
        country: '',
        province: '',
        suburb: '',
        city: '',
        streetName: '',
        areaCode: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePaymentMethodChange = (event) => {
        const method = event.target.checked ? 'online' : 'cash';
        setPaymentMethod(method);
        toast.success(`Chosen: ${method === 'online' ? 'Online Payment with PayFast' : 'Pay With Cash on Delivery'}`, {
            style: { border: '1px solid #4BB543', padding: '16px', color: '#4BB543' },
            iconTheme: { primary: '#4BB543', secondary: '#FFFAEE' },
        });
    };

    const handleFormDataChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const validateFormData = () => {
        const errors = {};
        if (!formData.country.trim()) errors.country = 'Country is required';
        if (!formData.province.trim()) errors.province = 'Province is required';
        if (!formData.suburb.trim()) errors.suburb = 'Suburb is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.streetName.trim()) errors.streetName = 'Street name is required';
        if (!formData.areaCode.trim()) errors.areaCode = 'Area code is required';
        else if (!/^\d+$/.test(formData.areaCode)) errors.areaCode = 'Area code must be numeric';

        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) =>
                toast.error(error, {
                    style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
                })
            );
            return false;
        }
        return true;
    };

    const handleCheckout = async () => {
        if (!cartItems.length) {
            toast.error('Cart is empty', {
                style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
            });
            return;
        }
        if (paymentMethod === 'cash' && !validateFormData()) {
            return;
        }
        setIsSubmitting(true);
        try {
            const orderData = {
                token: localStorage.getItem('token'),
                totalPrice: subTotal,
                prodIDs: cartItems.map((item) => item.product.id),
                quantities: cartItems.map((item) => item.quantity),
                ...formData,
            };
            const response = await createOrder(orderData);
            if (response.status === 200) {
                setOrderDetails(response.data);
                toast.success('Order created successfully', {
                    style: { border: '1px solid #4BB543', padding: '16px', color: '#4BB543' },
                    iconTheme: { primary: '#4BB543', secondary: '#FFFAEE' },
                });
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create order';
            toast.error(message, {
                style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePayFastCheckout = async (e) => {
        e.preventDefault();
        if (!cartItems.length) {
            toast.error('Cart is empty', {
                style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
            });
            return;
        }
        if (!validateFormData()) {
            return;
        }
        setIsSubmitting(true);
        try {
            const orderData = {
                token: localStorage.getItem('token'),
                totalPrice: subTotal,
                prodIDs: cartItems.map((item) => item.product.id),
                quantities: cartItems.map((item) => item.quantity),
                ...formData,
            };
            const response = await createOrder(orderData);
            if (response.status === 200) {
                setOrderDetails(response.data);
                // Simulate PayFast form submission (in a real app, redirect to PayFast)
                toast.success('Order created, proceeding to PayFast', {
                    style: { border: '1px solid #4BB543', padding: '16px', color: '#4BB543' },
                    iconTheme: { primary: '#4BB543', secondary: '#FFFAEE' },
                });
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to initiate PayFast payment';
            toast.error(message, {
                style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="shopping-cart">
            <div className="d-flex title bg-dark text-white justify-content-between align-items-center">
                <div className="s-title">
                    <span>Shopping Bag</span>
                </div>
                <div className="shopping-items justify-content-end">
          <span>
            Items: <span className="text-warning">{cartItems.length}</span>
          </span>
                </div>
            </div>
            {isLoading || isSubmitting ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : cartItems.length === 0 ? (
                <div className="cart-empty text-center my-5">
                    <i className="fa fa-shopping-cart fa-2x"></i>
                    <p>Your Cart Is Empty</p>
                </div>
            ) : (
                <>
                    {cartItems.map((cartItem) => {
                        const { id, quantity, product } = cartItem;
                        return (
                            <div key={id} className="row item">
                                <div className="col-lg-3 col-md-3 image d-flex justify-content-center align-items-center flex-column">
                                    <div className="item-image">
                                        <img src={product.imageURL} alt={product.name} className="img-fluid" />
                                    </div>
                                    <div className="remove">
                                        <p
                                            className="mb-2 remove-item text-danger cursor-pointer"
                                            onClick={() => handleRemoveFromCart(id)}
                                            role="button"
                                            aria-label={`Remove ${product.name} from cart`}
                                        >
                                            Remove
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-3 description d-flex justify-content-center flex-column align-items-center">
                                    <span>{product.name}</span>
                                    <span className="pt-md-2 pt-lg-2">R{product.price.toFixed(0)}</span>
                                </div>
                                <div className="col-lg-3 col-md-3 quantity d-flex justify-content-center align-items-center">
                                    <button
                                        className="minus-btn"
                                        type="button"
                                        onClick={() => handleUpdateCartQuantity(id, quantity - 1)}
                                        aria-label={`Decrease quantity of ${product.name}`}
                                        disabled={isSubmitting}
                                    >
                                        <i className="fa fa-minus"></i>
                                    </button>
                                    <input type="text" name="qty" value={quantity} readOnly />
                                    <button
                                        className="plus-btn"
                                        type="button"
                                        onClick={() => handleUpdateCartQuantity(id, quantity + 1)}
                                        aria-label={`Increase quantity of ${product.name}`}
                                        disabled={isSubmitting}
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                                <div className="total-price col-lg-3 col-md-3 d-flex justify-content-center align-items-center">
                                    R{(quantity * product.price).toFixed(0)}
                                </div>
                            </div>
                        );
                    })}
                    <div className="total-amount d-flex justify-content-end align-items-center">
                        <p>
                            Total Amount: <span className="text-danger">R{subTotal.toFixed(0)}</span>
                        </p>
                    </div>
                    <div className="payment-method-switch d-flex align-items-center justify-content-center mt-3 mb-3">
                        <label className="switch" htmlFor="paymentSwitch">
                            <input
                                id="paymentSwitch"
                                type="checkbox"
                                onChange={handlePaymentMethodChange}
                                disabled={isSubmitting}
                            />
                            <span className="slider round"></span>
                        </label>
                        <p className="payment-method-indicator ms-3 text-dark mb-0 p-0 text-center">
                            Switch Between Online Payment And Cash On Delivery
                        </p>
                    </div>
                    {paymentMethod === 'online' ? (
                        <div className="online-payment-form p-3 mb-3 mt-3 text-center bg-light rounded shadow p-4">
                            <strong>Enter Your Details for Online Payment</strong>
                            <form className="container mt-4" onSubmit={handlePayFastCheckout}>
                                {Object.keys(formData).map((key) => (
                                    <div className="mb-3" key={key}>
                                        <label htmlFor={key} className="form-label">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </label>
                                        <input
                                            type={key === 'areaCode' ? 'number' : 'text'}
                                            className="form-control"
                                            id={key}
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleFormDataChange}
                                            disabled={isSubmitting}
                                            autoComplete={key === 'areaCode' ? 'postal-code' : 'street-address'}
                                        />
                                    </div>
                                ))}
                                <input type="hidden" name="merchant_id" value="23233039" />
                                <input type="hidden" name="merchant_key" value="ntcgzdeugho8j" />
                                <input type="hidden" name="return_url" value="http://localhost:3000/return" />
                                <input type="hidden" name="cancel_url" value="http://localhost:3000/cancel" />
                                <input type="hidden" name="notify_url" value="http://localhost:3000/notify" />
                                <input type="hidden" name="m_payment_id" value={`ORDER_${Date.now()}`} />
                                <input type="hidden" name="amount" value={subTotal.toFixed(2)} />
                                <button
                                    type="submit"
                                    className="btn btn-block btn-checkout"
                                    disabled={isSubmitting}
                                    aria-label="Checkout with PayFast"
                                >
                                    {isSubmitting ? 'Processing...' : 'Checkout with PayFast'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="cash-on-collection-address p-3 mb-3 mt-3 text-center bg-light rounded shadow p-4">
                            <strong>Please Enter Your Details to Checkout and Pay with Cash</strong>
                            <div className="cash-on-collection-form mt-4">
                                <form className="container">
                                    {Object.keys(formData).map((key) => (
                                        <div className="mb-3" key={key}>
                                            <label htmlFor={key} className="form-label">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </label>
                                            <input
                                                type={key === 'areaCode' ? 'number' : 'text'}
                                                className="form-control"
                                                id={key}
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleFormDataChange}
                                                disabled={isSubmitting}
                                                autoComplete={key === 'areaCode' ? 'postal-code' : 'street-address'}
                                            />
                                        </div>
                                    ))}
                                    {!orderDetails && cartItems.length > 0 && (
                                        <button
                                            type="button"
                                            className="btn btn-block btn-checkout"
                                            onClick={handleCheckout}
                                            disabled={isSubmitting}
                                            aria-label="Checkout and make order"
                                        >
                                            {isSubmitting ? 'Processing...' : 'Checkout and Make Order'}
                                        </button>
                                    )}
                                    {orderDetails && (
                                        <button
                                            type="button"
                                            className="btn btn-block btn-checkout"
                                            onClick={() => createPDF(formData, cartItems, subTotal)}
                                            disabled={isSubmitting}
                                            aria-label="Save order as PDF"
                                        >
                                            Save Order as PDF
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

Cart.propTypes = {
    cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            product: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
                imageURL: PropTypes.string,
            }).isRequired,
        })
    ).isRequired,
    handleRemoveFromCart: PropTypes.func.isRequired,
    handleUpdateCartQuantity: PropTypes.func.isRequired,
    subTotal: PropTypes.number.isRequired,
    createOrder: PropTypes.func.isRequired,
    createPDF: PropTypes.func.isRequired,
    orderDetails: PropTypes.object,
    setOrderDetails: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
};