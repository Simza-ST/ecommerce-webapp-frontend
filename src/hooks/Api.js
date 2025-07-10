import axios from 'axios';

const Api = axios.create({
    baseURL: 'http://localhost:8089',
    headers: { 'Content-Type': 'application/json' }
});

export const getProductById = (productId) => Api.get(`/product/${productId}`);

export const getProducts = () => Api.get('/product/');

export const getCart = (token) => Api.get('/cart/', {
    headers: { Authorization: `Bearer ${token}` }
});

export const addToCart = (token, productId, quantity) => {
    console.log('Making addToCart request:', { productId, quantity, token });
    return Api.post('/cart/add', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const removeFromCart = (token, cartItemId) => Api.delete(`/cart/delete/${cartItemId}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const updateCartQuantity = (token, cartItemId, quantity) => Api.patch(`/cart/update/${cartItemId}`, { quantity }, {
    headers: { Authorization: `Bearer ${token}` }
});

export const createOrder = (orderData) => Api.post('/order/create-checkout-session', orderData, {
    headers: { Authorization: `Bearer ${orderData.token}` }
});

export const validateToken = (token) => Api.get('/auth/validate', {
    headers: { Authorization: `Bearer ${token}` }
});
export const signup = (userData) => Api.post('/user/signup', userData);

export const signin = (credentials) => Api.post('/user/signin', credentials);
export default Api;