import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProducts } from '../hooks/Api';
import { Card } from './Card';
import { Spinner } from 'react-bootstrap';

export const Products = ({ handleAddToCart, loggedInUser }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await getProducts();
                console.log('Fetched products:', response.data);
                setProducts(response.data || []);
            } catch (error) {
                const message = error.response?.data?.message || 'Could not load products';
                toast.error(message);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const ProductShow = (productId) => {
        console.log('Navigating to product:', productId);
        navigate(`/product/${productId}`);
    };

    const handleAddProductToCart = (product) => {
        console.log('Adding product to cart from Products:', product);
        handleAddToCart(product);
    };

    return (
        <div className="products">
            <div className="container">
                <div className="row">
                    {isLoading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center my-5">
                            <p>No products available.</p>
                        </div>
                    ) : (
                        products.map((item) => (
                            <Card
                                key={item.id}
                                item={item}
                                handleAddToCart={handleAddProductToCart}
                                ProductShow={() => ProductShow(item.id)}
                                loggedInUser={loggedInUser}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

Products.propTypes = {
    handleAddToCart: PropTypes.func.isRequired,
    loggedInUser: PropTypes.bool.isRequired,
};