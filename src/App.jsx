import './App.css';
import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { Products } from './Components/Products';
import {Cart} from './Components/Cart';
import { Productdetail } from './Components/Productdetail';
import Home from './Components/Home';
import About from './Components/About';
import { Footer } from './Components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { getProductById, getCart, addToCart, removeFromCart, updateCartQuantity, validateToken } from './hooks/Api';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validateUserToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await validateToken(token);
          setLoggedInUser(true);
        } catch (error) {
          localStorage.removeItem('token');
          setLoggedInUser(false);
          toast.error('Session expired. Please log in again.');
        }
      }
    };
    validateUserToken();
  }, []);

  const updateUserState = (token) => {
    console.log('Updating user state with token:', token);
    if (token) {
      localStorage.setItem('token', token);
      setLoggedInUser(true);
    } else {
      localStorage.removeItem('token');
      setLoggedInUser(false);
      setCartItems([]);
      setSubTotal(0);
    }
  };

  const fetchProductById = async (productId) => {
    try {
      const response = await getProductById(productId);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load product details';
      toast.error(message);
      return null;
    }
  };

  const loadCartItems = useCallback(async () => {
    if (loggedInUser) {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in again.');
        setCartItems([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await getCart(token);
        const items = response.data.cartItems || [];
        console.log('Loaded cart items:', items);
        setCartItems(items);
        calculateSubTotal(items);
      } catch (error) {
        const message = error.response?.data?.message || 'Could not load cart items';
        toast.error(message);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCartItems([]);
      setSubTotal(0);
    }
  }, [loggedInUser]);

  const calculateSubTotal = useCallback((items) => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
    setSubTotal(total);
  }, []);

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  const handleAddToCart = async (product) => {
    if (!loggedInUser) {
      toast.error('Please log in to add items to your cart.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in again.');
      return;
    }

    if (!product) {
      toast.error('Product is undefined.');
      return;
    }

    const productId = product.id || product.productId;
    if (!productId) {
      toast.error('Product ID is missing.');
      console.error('Invalid product object:', product);
      return;
    }

    console.log('Adding to cart:', { productId, product });

    const isProductInCart = cartItems.some(item => item.product.id === productId);
    if (isProductInCart) {
      toast.error('Item already in cart!', {
        style: {
          border: '1px solid #FFA500',
          padding: '16px',
          color: '#FFA500',
        },
        iconTheme: {
          primary: '#FFA500',
          secondary: '#FFFAEE',
        },
      });
      return;
    }

    try {
      const response = await addToCart(token, productId, 1);
      console.log('Add to cart response:', response.data);
      if ([200, 201].includes(response.status)) {
        toast.success('Item added to cart');
        await loadCartItems();
      } else {
        throw new Error(`Unexpected status code ${response.status}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      console.error('Add to cart error:', error, 'Response data:', error.response?.data);
      toast.error(message);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in again.');
      return;
    }

    try {
      const response = await removeFromCart(token, cartItemId);
      if ([200, 204].includes(response.status)) {
        toast.success('Item removed from cart');
        await loadCartItems();
      } else {
        throw new Error(`Unexpected status code ${response.status}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(message);
    }
  };

  const handleUpdateCartQuantity = async (cartItemId, newQuantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in again.');
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }

    try {
      const response = await updateCartQuantity(token, cartItemId, newQuantity);
      if ([200, 201].includes(response.status)) {
        toast.success('Cart updated');
        await loadCartItems();
      } else {
        throw new Error(`Unexpected status code ${response.status}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
    }
  };

  const initializeNewCart = useCallback(() => {
    setCartItems([]);
    calculateSubTotal([]);
  }, [calculateSubTotal]);

  const createPDF = useCallback((formData, cartItems, totalAmount) => {
    if (!formData?.country || !formData?.province || !formData?.suburb || !formData?.city || !formData?.streetName || !formData?.areaCode || !cartItems?.length) {
      toast.error('Invalid order data for PDF generation');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice', 105, 20, null, null, 'center');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()} - to be delivered in 5-10 working days`, 10, 30);
    doc.text('Bill To:', 10, 40);
    doc.text(`Country: ${formData.country}`, 10, 45);
    doc.text(`Province: ${formData.province}`, 10, 50);
    doc.text(`City: ${formData.city}`, 10, 55);
    doc.text(`Suburb: ${formData.suburb}`, 10, 60);
    doc.text(`Street: ${formData.streetName}`, 10, 65);
    doc.text(`Area Code: ${formData.areaCode}`, 10, 70);

    const tableColumn = 80;
    doc.setFontSize(12);
    doc.text('Item', 10, tableColumn);
    doc.text('Quantity', 60, tableColumn);
    doc.text('Price', 110, tableColumn);
    doc.text('Total', 160, tableColumn);

    let yPosition = tableColumn + 10;
    cartItems.forEach(item => {
      doc.text(item.product.name, 10, yPosition);
      doc.text(item.quantity.toString(), 60, yPosition);
      doc.text(`R${item.product.price.toFixed(2)}`, 110, yPosition);
      doc.text(`R${(item.quantity * item.product.price).toFixed(2)}`, 160, yPosition);
      yPosition += 10;
    });

    doc.setFontSize(14);
    doc.text(`Total: R${totalAmount.toFixed(2)}`, 160, yPosition + 10);
    doc.save('invoice.pdf');

    setOrderDetails(null);
    initializeNewCart();
    toast.success('Your invoice has been created!');
  }, [initializeNewCart]);

  const createOrder = async (orderData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in again.');
      return;
    }

    try {
      const response = await createOrder({ ...orderData, token });
      if (response.status === 200) {
        toast.success('Order created successfully!');
        return response;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      toast.error(message);
      throw error;
    }
  };

  return (
      <BrowserRouter>
        <>
          <Navbar
              count={cartItems.length ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0}
              loggedInUser={loggedInUser}
              setLoggedInUser={updateUserState}
          />
          {isLoading && <div>Loading cart...</div>}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products handleAddToCart={handleAddToCart} loggedInUser={loggedInUser} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} handleRemoveFromCart={handleRemoveFromCart} handleUpdateCartQuantity={handleUpdateCartQuantity} subTotal={subTotal} createOrder={createOrder} createPDF={createPDF} orderDetails={orderDetails} setOrderDetails={setOrderDetails} isLoading={isLoading} />} />
            <Route path="/product/:productId" element={<Productdetail handleAddToCart={handleAddToCart} fetchProductById={fetchProductById} />} />
          </Routes>
          <Footer />
          <Toaster
              toastOptions={{
                style: {
                  border: '1px solid #713200',
                  padding: '16px',
                  color: '#713200',
                },
                iconTheme: {
                  primary: '#713200',
                  secondary: '#FFFAEE',
                },
              }}
          />
        </>
      </BrowserRouter>
  );
}

export default App;