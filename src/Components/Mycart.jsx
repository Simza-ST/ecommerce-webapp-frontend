import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MycartPage.css';

export const Cart = ({ cartItems, handleRemoveFromCart, handleUpdateCartQuantity, subTotal, createOrder, createPDF,orderDetails,setOrderDetails }) => {

    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [orderCreated, setOrderCreated] = useState(false);


    const handlePaymentMethodChange = (event) => {
        const method = event.target.checked ? 'online' : 'cash';
        setPaymentMethod(method);
        toast(`Chosen: ${method === 'online' ? 'Online Payment with PayFast' : 'Pay With Cash on Delivery'}`);
    };

    const [formData, setFormData] = useState({
        country: '',
        province: '',
        subrub: '',
        city: '',
        streetName: '',
        areaCode: '',
    });

    const handleFormDataChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value, // Use "name" attribute to update the form data
        }));
    };

    const validateFormData = () => {
        // Implement validation logic here
        // For example, check if all the fields are filled:
        for (let field in formData) {
            if (!formData[field]) {
                toast.error(`Please fill in the ${field} field.`);
                return false;
            }
        }
        return true;
    };

    const handleCheckout = async () => {
        if (validateFormData()) {
          const orderData = {
            token: localStorage.getItem('token'),
            totalPrice: subTotal,
            prodIDs: cartItems.map(item => item.product.id),
            quantities: cartItems.map(item => item.quantity),
            ...formData
          };
          // Call the createOrder function passed as a prop
          await createOrder(orderData);
        }
      };

    return (
        <>
            <div className="shopping-cart">
                <div className='d-flex title bg-dark text-white justify-content-between align-items-center'>
                    <div className="s-title">
                        <span>Shopping Bag</span>
                    </div>
                    <div className='shopping-items justify-content-end'>
                        <span>Items : <span className='text-warning'>{cartItems.length}</span></span>
                    </div>
                </div>
                {
                    cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <i className="fa fa-shopping-cart"></i>
                            <p>Your Cart Is empty</p>
                        </div>
                    ) : (
                        <>
                            {cartItems.map((cartItem) => {
                                const { id, quantity, product } = cartItem; // Use destructuring to extract data
                                return (
                                    <div key={id} className="row item ">
                                        <div className="col-lg-3 col-md-3 image d-flex justify-content-center align-items-center flex-column">
                                            <div className="item-image ">
                                                <img src={product.imageURL} alt={product.name} />
                                            </div>
                                            <div className="remove">
                                                <p className='mb-2 remove-item text-danger' onClick={() => handleRemoveFromCart(id)}>Remove</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-3 description d-flex justify-content-center flex-column align-items-center">
                                            <span>{product.name}</span>
                                            <span className="pt-md-2 pt-lg-2">R{product.price.toFixed(0)}</span>
                                        </div>
                                        <div className='col-lg-3 col-md-3 quantity d-flex justify-content-center align-items-center'>
                                            <button className="minus-btn" type="button" onClick={() => handleUpdateCartQuantity(id, quantity - 1)}>
                                                <i className='fa fa-minus'></i>
                                            </button>
                                            <input type="text" name="qty" value={quantity} readOnly />
                                            <button className="plus-btn" type="button" onClick={() => handleUpdateCartQuantity(id, quantity + 1)}>
                                                <i className='fa fa-plus'></i>
                                            </button>
                                        </div>
                                        <div className="total-price col-lg-3 col-md-3 d-flex justify-content-center align-items-center">
                                            R{(quantity * product.price).toFixed(0)}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className='total-amount d-flex justify-content-end align-items-center'>
                                <p>Total Amount :<span className='text-danger'>R{subTotal.toFixed(0)}</span></p>
                            </div>
                            <div>
                                <div className='payment-method-switch d-flex align-items-center justify-content-center mt-3 mb-3'>
                                    <label className="switch">
                                        <input type="checkbox" onChange={handlePaymentMethodChange} />
                                        <span className="slider round"></span>
                                    </label>
                                    <p className='payment-method-indicator ms-3 text-dark mb-0 p-0 text-center '>Switch Between Online Payment And Cash On Delivery</p>
                                </div>
                                {paymentMethod === 'online' ? (
                                    <div className='online-payment-form p-3 mb-3 mt-3 text-center bg-light rounded shadow p-4 '>
                                        {/* Form for online payment address details */}
                                            {/* Add form fields for address here */}
                                            <form action="https://sandbox.payfast.co.za/eng/process" method="post">
                                                <input type="hidden" name="merchant_id" value="23233039"/>
                                                <input type="hidden" name="merchant_key" value="ntcgzdeugho8j"/>
                                                <input type="hidden" name="return_url" value="http://www.yoursite.com/return" />
                                                <input type="hidden" name="cancel_url" value="http://www.yoursite.com/cancel" />
                                                <input type="hidden" name="notify_url" value="http://www.yoursite.com/notify" />
                                                                                
                                                                                
                                                <input type="hidden" name="m_payment_id" value="01AB" />
                                                <input type="hidden" name="amount" value="100.00" />
                                                                                
                                                <button type="submit" className="btn-checkout">Checkout with Payfast</button>
                                            </form>
                                    </div>
                                ) : (
                                    <div className='cash-on-collection-address p-3 mb-3 mt-3 text-center bg-light rounded shadow p-4  '>
                                        <strong>Please Enter Your Details In The Form Below To Checkout And Pay With Cash</strong>
                                        <div className="cash-on-collection-form mt-4">
                                            <form className="container">
                                                {/* Iterate over form data to create form elements */}
                                                {Object.keys(formData).map((key) => (
                                                    <div className="mb-3" key={key}>
                                                        <label htmlFor={key} className="form-label">
                                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                                        </label>
                                                        <input
                                                            type={key === "areaCode" ? "number" : "text"}
                                                            className="form-control"
                                                            name={key} // Use "name" attribute that matches the formData properties
                                                            value={formData[key]}
                                                            onChange={handleFormDataChange}
                                                            autoComplete=''
                                                        />
                                                    </div>
                                                ))}
                                                {!orderDetails && cartItems.length > 0 && (
                                                    <>
                                                        {/* ... render checkout form and switch */}
                                                        <button type="button" className="btn btn-block btn-checkout" onClick={handleCheckout}>
                                                        Checkout And Make Order!
                                                        </button>
                                                    </>
                                                    )}
                                                    {orderDetails && (
                                                    <button type="button" className="btn btn-block btn-checkout" onClick={() => createPDF(formData, cartItems, subTotal)}>
                                                        Save Order as PDF
                                                    </button>
                                                    )}
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <ToastContainer position="top-center" />
                        </>
                    )
                }
            </div>
        </>
    );
};

export default Cart