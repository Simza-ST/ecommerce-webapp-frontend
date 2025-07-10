import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

export const Card = ({ item, ProductShow, handleAddToCart, loggedInUser }) => {
    const { id, imageURL, category, price, name } = item;

    const addToCart = () => {
        if (!loggedInUser) {
            toast.error('Please log in to add items to the cart.', {
                style: { border: '1px solid #FF0000', padding: '16px', color: '#FF0000' },
            });
            return;
        }

        console.log('Card addToCart called with item:', item);
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
                        style={{ marginBottom: '10px' }}
                    />
                </div>
                <div className="product-name text-center" style={{ marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>{name}</span>
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
                        <NavLink
                            to={`/product/${id}`}
                            onClick={() => {
                                console.log('Navigating to product:', id);
                                ProductShow(item);
                            }}
                            aria-label={`View details for ${name}`}
                        >
                            <i className="fa-regular fa-eye me-2 cart-icons"></i>
                        </NavLink>
                        <button
                            className="btn btn-link p-0"
                            onClick={addToCart}
                            aria-label={`Add ${name} to cart`}
                            disabled={!loggedInUser}
                        >
                            <i className="fa-solid fa-cart-shopping cart-icons"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        imageURL: PropTypes.string,
        category: PropTypes.string,
        price: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    ProductShow: PropTypes.func.isRequired,
    handleAddToCart: PropTypes.func.isRequired,
    loggedInUser: PropTypes.bool.isRequired,
};