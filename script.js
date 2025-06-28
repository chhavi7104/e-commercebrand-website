console.log("✅ script.js successfully loaded");

// Product data - consolidated in one place
const products = {
    "1": {
        id: "1",
        name: "Cartoon Astronaut t-shirts",
        brand: "adidas",
        price: 50.00,
        img: "imgs/1_c443a042-e4e0-4891-9138-ac6d1dc6c6b7.webp",
        description: "Trendy cartoon astronaut t-shirt, perfect for casual wear.",
        stars: 5,
        category: "T-Shirt",
        images: [
            "imgs/1_c443a042-e4e0-4891-9138-ac6d1dc6c6b7.webp",
            
        ]
    },
     "2": {
            id: "2",
            name: "Blue Short Kurti",
            brand: "adidas",
            price: 50.00,
            img: "imgs/-473Wx593H-467099247-blue-MODEL.avif",
            description: "Elegant blue short kurti for semi-formal occasions.",
            stars: 5,
            category: "Kurti",
            images: [
                "imgs/-473Wx593H-467099247-blue-MODEL.avif"
            ]
        },
        "3": {
               id: "3",
               name: "Office wear solid top",
               brand: "adidas",
               price: 50.00,
               img: "imgs/220411_StFrock_Jayde_60580-RED-ORG_0953_2048x.webp",
               description: "Professional top for office settings.",
               stars: 5,
               category: "Office Wear",
               images: ["imgs/220411_StFrock_Jayde_60580-RED-ORG_0953_2048x.webp"]
},
           "4": {
        id: "4",
        name: "Jaipuri printed casual shirt",
        brand: "adidas",
        price: 50.00,
        img: "imgs/images (1).jpg",
        description: "Colorful Jaipuri printed shirt for a casual look.",
        stars: 5,
        category: "Shirt",
        images: [
            "imgs/images (1).jpg"
        ]
    },
    "5": {
        id: "5",
        name: "Grey kaftan top",
        brand: "adidas",
        price: 50.00,
        img: "imgs/PUN6232.jpg",
        description: "Stylish grey kaftan for comfort and flair.",
        stars: 5,
        category: "Kaftan",
        images: [
            "imgs/PUN6232.jpg"
        ]
    },
    "6": {
        id: "6",
        name: "100% cotton peplum top",
        brand: "adidas",
        price: 50.00,
        img: "imgs/luna-653705.webp",
        description: "Breathable cotton peplum top for everyday wear.",
        stars: 5,
        category: "Top",
        images: [
            "imgs/luna-653705.webp"
        ]
    },
    "7": {
        id: "7",
        name: "Polo neck crop top",
        brand: "Zara",
        price: 50.00,
        img: "imgs/1_c7a472f2-22f1-41d5-972c-a59d9ef6f117_360x504.webp",
        description: "Trendy crop top with polo neck style from Zara.",
        stars: 5,
        category: "Crop Top",
        images: [
            "imgs/1_c7a472f2-22f1-41d5-972c-a59d9ef6f117_360x504.webp"
        ]
    },
    "8": {
        id: "8",
        name: "Rose gold satin shirt",
        brand: "adidas",
        price: 50.00,
        img: "imgs/300984596DUSTYPINK_1_800x.webp",
        description: "Elegant satin shirt in rose gold hue.",
        stars: 5,
        category: "Satin Shirt",
        images: [
            "imgs/300984596DUSTYPINK_1_800x.webp"
        ]
    }
    // ... (keep all your other product definitions)
};

// Cart functionality
function setupCart() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('buyNow') === 'true') {
        const tempCart = JSON.parse(localStorage.getItem('tempCart')) || [];
        if (tempCart.length > 0) {
            cartItems = tempCart;
            localStorage.removeItem('tempCart');
        }
    }

    const cartTableBody = document.querySelector('#cart tbody');
    const subtotalTable = document.querySelector('#subtotal table');
    const proceedBtn = document.querySelector('#subtotal button.normal');
    const couponInput = document.querySelector('#coupon input');
    const couponBtn = document.querySelector('#coupon button.normal');

    function renderCart() {
        if (!cartTableBody) return;
        
        cartTableBody.innerHTML = '';

        cartItems.forEach(item => {
            const product = products[item.id] || item;
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            
            row.innerHTML = `
                <td><a href="#" class="remove-item" data-id="${item.id}"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${product.img || product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity || 1}" min="1" class="quantity-input" data-id="${item.id}"></td>
                <td class="item-subtotal">$${(product.price * (item.quantity || 1)).toFixed(2)}</td>
            `;
            
            cartTableBody.appendChild(row);
        });

        updateTotals();
    }

    function updateTotals() {
        if (!subtotalTable) return;
        
        const subtotal = cartItems.reduce((sum, item) => {
            const product = products[item.id] || item;
            return sum + (product.price * (item.quantity || 1));
        }, 0);
        
        const total = subtotal;
        
        subtotalTable.innerHTML = `
            <tr>
                <td>Cart Subtotal</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Shipping</td>
                <td>Free</td>
            </tr>
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>$${total.toFixed(2)}</strong></td>
            </tr>
        `;
    }

    function removeItem(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCart();
        showNotification('Item removed from cart');
    }

    function updateQuantity(id, newQuantity) {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            item.quantity = parseInt(newQuantity);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart();
        }
    }

    function applyCoupon(code) {
        if (code.toLowerCase() === 'save10') {
            showNotification('Coupon applied! 10% discount');
        } else {
            showNotification('Invalid coupon code');
        }
    }

    // Event listeners for cart
    if (cartTableBody) {
        document.addEventListener('click', function(e) {
            if (e.target.closest('.remove-item')) {
                e.preventDefault();
                const id = e.target.closest('.remove-item').dataset.id;
                removeItem(id);
            }
            
            if (e.target === proceedBtn) {
                e.preventDefault();
                if (cartItems.length > 0) {
                    window.location.href = 'pay.html';
                } else {
                    showNotification('Your cart is empty');
                }
            }
            
            if (e.target === couponBtn) {
                e.preventDefault();
                const couponCode = couponInput.value.trim();
                if (couponCode) {
                    applyCoupon(couponCode);
                } else {
                    showNotification('Please enter a coupon code');
                }
            }
        });

        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('quantity-input')) {
                const id = e.target.dataset.id;
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity >= 1) {
                    updateQuantity(id, newQuantity);
                } else {
                    e.target.value = 1;
                    updateQuantity(id, 1);
                }
            }
        });

        renderCart();
    }
}

// Product page functionality
function setupProductPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId || !products[productId]) {
        const productDetail = document.getElementById('product-detail');
        if (productDetail) {
            productDetail.innerHTML = '<h2>Product not found.</h2>';
        }
        return;
    }

    const product = products[productId];
    
    // Update product details
    const breadcrumb = document.getElementById('product-breadcrumb');
    const title = document.getElementById('product-title');
    const price = document.getElementById('product-price');
    const description = document.getElementById('product-description');
    
    if (breadcrumb) breadcrumb.textContent = `Home / ${product.category}`;
    if (title) title.textContent = product.name;
    if (price) price.textContent = `$${product.price.toFixed(2)}`;
    if (description) description.textContent = product.description;

    // Update main image
    const mainImg = document.getElementById('MainImg');
    if (mainImg) {
        mainImg.src = product.images[0];
        mainImg.alt = product.name;
    }

    // Update thumbnails
    const thumbnailContainer = document.getElementById('thumbnail-container');
    if (thumbnailContainer) {
        thumbnailContainer.innerHTML = '';
        
        product.images.forEach((imgSrc, index) => {
            const thumbnailCol = document.createElement('div');
            thumbnailCol.className = 'small-img-col';
            
            const thumbnail = document.createElement('img');
            thumbnail.src = imgSrc;
            thumbnail.width = '100%';
            thumbnail.className = 'small-img';
            thumbnail.alt = `${product.name} - Image ${index + 1}`;
            
            thumbnail.addEventListener('click', () => {
                if (mainImg) mainImg.src = imgSrc;
            });
            
            thumbnailCol.appendChild(thumbnail);
            thumbnailContainer.appendChild(thumbnailCol);
        });
    }

    // Update stars rating
    const starsContainer = document.getElementById('product-stars');
    if (starsContainer) {
        let starsHTML = '';
        for (let i = 0; i < product.stars; i++) {
            starsHTML += '<i class="fa-solid fa-star"></i> ';
        }
        starsContainer.innerHTML = starsHTML;
    }

    // Add to cart button
    const addToCartBtn = document.querySelector('.single-product-details button.normal');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const size = document.querySelector('select').value;
            const quantity = parseInt(document.querySelector('input[type="number"]').value);
            
            if (size === 'Select Size') {
                alert('Please select a size');
                return;
            }
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = cart.findIndex(item => 
                item.id === product.id && item.size === size
            );
            
            if (existingItemIndex >= 0) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    size: size,
                    quantity: quantity,
                    img: product.images[0]
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            showNotification(`${quantity} ${product.name} (${size}) added to cart!`);
        });
    }

    // Buy now button
    const buyNowBtn = document.querySelector('.single-product-details button:nth-of-type(2)');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const size = document.querySelector('select').value;
            const quantity = parseInt(document.querySelector('input[type="number"]').value);
            
            if (size === 'Select Size') {
                alert('Please select a size');
                return;
            }
            
            const tempCart = [{
                id: product.id,
                name: product.name,
                price: product.price,
                size: size,
                quantity: quantity,
                img: product.images[0]
            }];
            
            localStorage.setItem('tempCart', JSON.stringify(tempCart));
            window.location.href = 'pay.html?buyNow=true';
        });
    }
}

// Checkout functionality
function setupCheckout() {
    const checkoutForm = document.querySelector('.checkout-form');
    const placeOrderBtn = document.querySelector('.place-order');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                processPayment();
            }
        });
    }
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('.method input[type="radio"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            document.querySelectorAll('.method-details').forEach(detail => {
                detail.style.display = 'none';
            });
            
            if (this.checked) {
                const details = this.closest('.method').querySelector('.method-details');
                if (details) {
                    details.style.display = 'block';
                }
            }
        });
    });
    
    // Initially show selected payment method
    const selectedMethod = document.querySelector('.method input[type="radio"]:checked');
    if (selectedMethod) {
        const details = selectedMethod.closest('.method').querySelector('.method-details');
        if (details) {
            details.style.display = 'block';
        }
    }
    
    function validateForm() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
                
                if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('span');
                    errorMsg.classList.add('error-message');
                    errorMsg.style.color = 'red';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.display = 'block';
                    errorMsg.textContent = 'This field is required';
                    field.parentNode.insertBefore(errorMsg, field.nextSibling);
                }
            } else {
                field.style.borderColor = '';
                const errorMsg = field.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
        
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            isValid = false;
            const termsLabel = termsCheckbox.nextElementSibling;
            termsLabel.style.color = 'red';
            
            if (!termsLabel.nextElementSibling || !termsLabel.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('span');
                errorMsg.classList.add('error-message');
                errorMsg.style.color = 'red';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'You must agree to the terms and conditions';
                termsLabel.parentNode.insertBefore(errorMsg, termsLabel.nextSibling);
            }
        } else if (termsCheckbox) {
            const termsLabel = termsCheckbox.nextElementSibling;
            termsLabel.style.color = '';
            const errorMsg = termsLabel.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
        
        return isValid;
    }
    
    function processPayment() {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Processing...';
        
        setTimeout(() => {
            document.getElementById('checkout').style.display = 'none';
            
            const successMessage = document.createElement('div');
            successMessage.className = 'payment-success';
            successMessage.style.textAlign = 'center';
            successMessage.style.padding = '50px 20px';
            successMessage.style.backgroundColor = '#f8f9fa';
            successMessage.style.borderRadius = '8px';
            successMessage.style.margin = '20px auto';
            successMessage.style.maxWidth = '600px';
            
            successMessage.innerHTML = `
                <i class="fas fa-check-circle" style="font-size: 60px; color: #28a745;"></i>
                <h2 style="color: #28a745; margin: 20px 0 10px;">Payment Successful!</h2>
                <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your order. Your payment has been processed successfully.</p>
                <p style="font-size: 14px; margin-bottom: 30px;">Order ID: #${Math.floor(Math.random() * 1000000)}</p>
                <p style="font-size: 14px; margin-bottom: 30px;">A confirmation email has been sent to your registered email address.</p>
                <a href="index.html" class="continue-shopping" style="display: inline-block; padding: 10px 20px; background-color: #222; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">Continue Shopping</a>
            `;
            
            const pageHeader = document.querySelector('.checkout-header');
            if (pageHeader) {
                pageHeader.insertAdjacentElement('afterend', successMessage);
                successMessage.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Clear cart after successful payment
            localStorage.removeItem('cart');
        }, 2000);
    }
}

// Shared functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize appropriate functionality based on page
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
   

    
    // Update cart count on all pages
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems > 0 ? totalItems : '';
        });
    }
    updateCartCount();

    // Initialize page-specific functionality
    if (document.querySelector('.checkout-form')) {
        console.log("Initializing checkout page");
        setupCheckout();
    } else if (document.getElementById('cart')) {
        console.log("Initializing cart page");
        setupCart();
    } else if (document.getElementById('product-detail')) {
        console.log("Initializing product page");
        setupProductPage();
    }

    // Mobile menu toggle (works on all pages)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.getElementById('navbar');
    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
        });
    }

    // Responsive adjustments
    function handleResponsive() {
        const container = document.querySelector('.container');
        if (container) {
            container.style.flexDirection = window.innerWidth < 768 ? 'column' : 'row';
        }
    }
    handleResponsive();
    window.addEventListener('resize', handleResponsive);

   
   function renderPaymentCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.getElementById("payment-cart-body");

  tbody.innerHTML = ""; // Clear existing

  let subtotal = 0;

  cart.forEach(product => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name} × ${product.quantity}</td>
      <td>₹${product.price * product.quantity}</td>
    `;
    tbody.appendChild(row);

    subtotal += product.price * product.quantity;
  });

  // Add Subtotal row
  const subtotalRow = document.createElement("tr");
  subtotalRow.innerHTML = `
    <td>Subtotal</td>
    <td>₹${subtotal}</td>
  `;
  tbody.appendChild(subtotalRow);

  // Add Shipping row
  const shippingRow = document.createElement("tr");
  shippingRow.innerHTML = `
    <td>Shipping</td>
    <td>Free Shipping</td>
  `;
  tbody.appendChild(shippingRow);

  // Add Total row
  const totalRow = document.createElement("tr");
  totalRow.classList.add("total");
  totalRow.innerHTML = `
    <td>Total</td>
    <td>₹${subtotal}</td>
  `;
  tbody.appendChild(totalRow);
}

    renderPaymentCart();
});

