// Productdetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const Productdetail = ({ handleAddToCart }) => {
    const [product, setProduct] = useState(null);
    const { productId } = useParams();

    useEffect(() => {
        const getProductDetails = async () => {
            if (!productId) {
                toast.error("Product ID is undefined");
                return;
            }
            try {
                const response = await axios.get(`https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/product/${productId}`);
                setProduct(response.data); // Assuming the response has a `product` property
            } catch (error) {
                toast.error("Failed to load product details");
            }
        };
        getProductDetails();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
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
                                <button className="btn btn-dark py-2 rounded-0 text-warning" onClick={() => handleAddToCart(product)}>
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