import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { Spinner } from 'react-bootstrap';

export const Productdetail = ({ handleAddToCart, fetchProductById }) => {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { productId } = useParams();

    useEffect(() => {
        const getProductDetails = async () => {
            if (!productId) {
                setError('Product ID is undefined');
                toast.error('Product ID is undefined');
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchProductById(productId);
                if (!data || !data.id || !data.name || !data.price) {
                    throw new Error('Invalid product data');
                }
                console.log('Fetched product details:', data);
                setProduct(data);
            } catch (error) {
                const message = error.message || 'Failed to load product details';
                setError(message);
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        };
        getProductDetails();
    }, [productId, fetchProductById]);

    const handleAddProductToCart = (product) => {
        console.log('Adding product to cart from Productdetail:', product);
        handleAddToCart(product);
    };

    if (isLoading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center my-5 text-danger">
                <h4>Error</h4>
                <p>{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center my-5">
                <p>No product found.</p>
            </div>
        );
    }

    return (
        <div className="pd-wrap">
            <div className="container">
                <div className="heading-section">
                    <h2>Product Details</h2>
                </div>
                <div className="row gy-4">
                    <div className="col-md-6 col-lg-6 col-xl-6">
                        <div className="product-detail-image">
                            <img src={product.imageURL} alt={product.name} className="img-fluid" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="product-dtl">
                            <div className="product-info">
                                <div className="product-name">{product.name}</div>
                                <div className="product-price-discount">
                                    <span>R{product.price.toFixed(0)}</span>
                                </div>
                            </div>
                            <p>{product.description}</p>
                            <div className="my-4">
                                <button
                                    className="btn btn-dark py-2 rounded-0 text-warning"
                                    onClick={() => handleAddProductToCart(product)}
                                    aria-label={`Add ${product.name} to cart`}
                                >
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Productdetail.propTypes = {
    handleAddToCart: PropTypes.func.isRequired,
    fetchProductById: PropTypes.func.isRequired,
};