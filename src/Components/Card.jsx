import { NavLink } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

export const Card = ({ item, ProductShow, handleAddToCart, loggedInUser }) => {
    const { id, imageURL, category, price, name } = item;

    const addToCart = async () => {
        if (!loggedInUser) {
            toast.error("Please log in to add items to the cart.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        
        // Directly using handleAddToCart passed from App.jsx
        handleAddToCart(item);
    };

    return (
        <div className="products-card col-sm-6 col-md-6 col-lg-4 col-xl-3">
            <div className="card border-0 rounded-0 shadow p-4 card-box">
                <div className="card-image d-flex justify-content-center align-items-center">
                    <img
                        src={imageURL}
                        className="card-img-top rounded-0"
                        alt={name}
                        style={{ marginBottom: "10px" }}
                    />
                </div>
                <div className="product-name text-center" style={{ marginBottom: "10px" }}>
                    <span style={{ fontWeight: "bold" }}>{name}</span>
                </div>
                <div className="card-body mt-3 mb-3">
                    <div className="row">
                        <div className="card-category text-center">
                            <h5>{category}</h5>
                        </div>
                    </div>
                </div>
                <div className="row align-items-center text-center g-0">
                    <div className="col-6">
                        <h5 className="products-price text-warning">R{price.toFixed(0)}</h5>
                    </div>
                    <div className="col-6">
                        <NavLink to={`/product/${id}`} onClick={() => ProductShow(item)}>
                            <i className="fa-regular fa-eye me-2 cart-icons"></i>
                        </NavLink>
                        <i className="fa-solid fa-cart-shopping cart-icons" onClick={addToCart}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};