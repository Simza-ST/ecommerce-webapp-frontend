import { useEffect, useState } from "react";
import { Card } from "./Card";

export const Products = ({ handleAddToCart, ProductShow}) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/product/');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <section className="shop container">
            <h2 className="section-title text-center">Shop Products</h2>
            <div className="shop-content">
                <div className="row gy-2">
                    {products.map((item, index) => (
                        <Card key={index} item={{ ...item, qty: 1 }} ProductShow={ProductShow} handleAddToCart={handleAddToCart} loggedInUser={!!localStorage.getItem('token')} />
                    ))}
                </div>
            </div>
        </section>
    );
};
