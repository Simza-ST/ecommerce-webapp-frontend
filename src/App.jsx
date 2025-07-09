  // App.css and other imports
  import './App.css';
  import { useEffect, useState, useCallback } from 'react';
  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import { Navbar } from './Components/Navbar';
  import { Products } from './Components/Products';
  import Cart from './Components/Mycart';
  import { Productdetail } from './Components/Productdetail';
  import Home from './Components/Home';
  import About from './Components/About';
  import { Footer } from './Components/Footer';
  import toast, { Toaster } from 'react-hot-toast';
  import axios from 'axios';
  import { jsPDF } from "jspdf";

  function App() {
    const [cartItems, setCartItems] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [subTotal, setSubTotal] = useState(0);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          setLoggedInUser(true);
      }
    }, []);
  
    const updateUserState = (token) => {
      console.log('Updating user state...');
      if (token) {
          console.log('Token stored:', token);
          localStorage.setItem('token', token);
          setLoggedInUser(true); // Only set loggedInUser to true or false based on the token
      } else {
          console.error('Logging out.');
          localStorage.removeItem('token');
          setLoggedInUser(false);
      }
  };
    const fetchProductById = async (productId) => {
      try {
        const response = await axios.get(`https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/product/${productId}`);
        return response.data;
      } catch (error) {
        toast.error("Failed to load product details");
      }
    };

    const loadCartItems = useCallback(async () => {
      if (loggedInUser) {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/cart/', {
            params: { token }
          });
          setCartItems(response.data.cartItems);
          calculateSubTotal(response.data.cartItems);
        } catch (error) {
          console.error('Error loading cart items:', error.response.data);
          toast.error(`Could not load cart items: ${error.response.data.message}`);
        }
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
        toast.error("Please log in to add items to your cart.");
        return;
      }
    
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }
    
      const productId = product.id || product.productId;
      console.log('Product ID:', productId);
      if (!productId) {
        toast.error("Product ID is missing.");
        return;
      }
    
      // Check if the product is already in the cart
      const isProductInCart = cartItems.some(item => item.product.id === productId);
      if (isProductInCart) {
        toast.error("Item already in cart!", {
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
        const response = await axios.post(
          'https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/cart/add/', 
          { productId, quantity: 1 }, // The payload is a plain object, no need to stringify
          {
              params: { token } 
          }
        );
        console.log('Response:', response);
        if (response.status === 200 || response.status === 201) { // Some APIs might return 200 OK instead of 201 Created
          toast.success("Item added to cart");
          await loadCartItems();
        } else {
          throw new Error(`Received unexpected status code ${response.status}`);
        }
      } catch (error) {
        console.error('Error adding item to cart:', error);
        // The error message should provide more details about why the request failed
        const errorMessage = error.response && error.response.data 
          ? JSON.stringify(error.response.data, null, 2) 
          : error.message;
        toast.error(`Failed to add item to cart: ${errorMessage}`);
      }
    };

    const handleRemoveFromCart = async (cartItemId) => {
      console.log('Attempting to remove item from cart');
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        toast.error("Please log in again.");
        return;
      }

      console.log('Cart Item ID:', cartItemId);

      try {
        const response = await axios.delete(
          `https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/cart/delete/${cartItemId}`,
          {
            params: { token } // Sending the token as query parameters
          }
        );
        console.log('Response:', response);
        toast.success("Item removed from cart");
        loadCartItems();
      } catch (error) {
        console.error('Error removing item from cart:', error);
        toast.error("Failed to remove item from cart");
      }
    };

    const handleUpdateCartQuantity = async (cartItemId, newQuantity) => {
      console.log('Attempting to update cart quantity');
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      if (!token) {
        toast.error("Please log in again.");
        return;
      }
      

      console.log('Cart Item ID:', cartItemId);
      console.log('Quantity:', newQuantity);

      if (newQuantity <= 0) {
        handleRemoveFromCart(cartItemId);
        return;
      }

      try {
        const response = await axios.patch(
          `https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/cart/update/${cartItemId}`,
          { quantity: newQuantity },
          {
            headers:{

            },
            params: { token }, // Sending the token as query parameters
          }
        );
        console.log('Response:', response);
        toast.success("Cart updated");
        loadCartItems();
      } catch (error) {
        console.error('Error updating cart:', error);
        toast.error("Failed to update cart");
      }
    };

    const initializeNewCart = useCallback(() => {
      setCartItems([]);
      calculateSubTotal([]);
    }, [setCartItems, calculateSubTotal]);
  
    // ... existing handleAddToCart, handleRemoveFromCart, and handleUpdateCartQuantity
  
    // Updated createPDF function
    const createPDF = useCallback((formData, cartItems, totalAmount) => {
      const doc = new jsPDF();
      
      // Title of the invoice
      doc.setFontSize(18);
      doc.text('Invoice', 105, 20, null, null, 'center');
      
      // Customer information
      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleDateString()} - to be deilvered in 5-10 working days`, 10, 30);
      doc.text(`Bill To:`, 10, 40);
      doc.text(`Country: ${formData.country}`, 10, 45);
      doc.text(`Province: ${formData.province}`, 10, 50);
      doc.text(`City: ${formData.city}`, 10, 55);
      doc.text(`Suburb: ${formData.suburb}`, 10, 60);
      doc.text(`Street: ${formData.streetName}`, 10, 65);
      doc.text(`Area Code: ${formData.areaCode}`, 10, 70);
      
      // Table headers
      const tableColumn = 80;
      doc.setFontSize(12);
      doc.text('Item', 10, tableColumn);
      doc.text('Quantity', 60, tableColumn);
      doc.text('Price', 110, tableColumn);
      doc.text('Total', 160, tableColumn);
      
      // Listing all cart items
      let yPosition = tableColumn + 10;
      cartItems.forEach(item => {
        doc.text(item.product.name, 10, yPosition);
        doc.text(item.quantity.toString(), 60, yPosition);
        doc.text(`R${item.product.price.toFixed(2)}`, 110, yPosition);
        doc.text(`R${(item.quantity * item.product.price).toFixed(2)}`, 160, yPosition);
        yPosition += 10;
      });
      
      // Total amount
      doc.setFontSize(14);
      doc.text(`Total: R${totalAmount.toFixed(2)}`, 160, yPosition + 10);
      
      // Save the PDF
      doc.save('invoice.pdf');
      
      // Reset orderDetails after saving PDF
      setOrderDetails(null);
      initializeNewCart();
      toast.success('Your invoice has been created!');
    }, [initializeNewCart, setOrderDetails]);
  
    // Updated createOrder function
    const createOrder = async (orderData) => {
      const token = localStorage.getItem('token');
      if (token) {
        orderData.token = token;
        try {
          const response = await axios.post(
            'https://thembis-bold-bite-backend-1f5615026bca.herokuapp.com/order/create-checkout-session',
            orderData
          );
          if (response.status === 200) {
            toast.success('Order created successfully!');
            console.log(response.data);
            setOrderDetails(response.data);
          } else {
            toast.error('Failed to create order. Please try again.');
          }
        } catch (error) {
          toast.error(`Failed to create order: ${error.message}`);
        }
      } else {
        toast.error('Authentication token not found. Please log in again.');
      }
    };

    return (
      <BrowserRouter>
        <>
          <Navbar count={cartItems.reduce((acc, item) => acc + item.quantity, 0)} loggedInUser={loggedInUser} setLoggedInUser={updateUserState} />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Products handleAddToCart={handleAddToCart} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} handleRemoveFromCart={handleRemoveFromCart} handleUpdateCartQuantity={handleUpdateCartQuantity} subTotal={subTotal} createOrder={createOrder} createPDF={createPDF} orderDetails={orderDetails} setOrderDetails={setOrderDetails} />} />
            <Route path="/product/:productId" element={<Productdetail handleAddToCart={handleAddToCart} />} />
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