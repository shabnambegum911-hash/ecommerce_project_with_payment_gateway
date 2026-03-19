# API Documentation - Angular UI

Complete API reference for the e-commerce backend endpoints and how to use them from the Angular frontend.

## Base URL

```
http://localhost:8080/api
```

## Authentication

All endpoints (except auth endpoints) require Basic Authentication.

### Header Format

```
Authorization: Basic base64(username:password)
```

The AuthInterceptor automatically adds this header to all requests using credentials stored in localStorage.

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Product APIs](#product-apis)
3. [Cart APIs](#cart-apis)
4. [Order APIs](#order-apis)
5. [Payment APIs](#payment-apis)
6. [Response Format](#response-format)
7. [Error Codes](#error-codes)

---

## Authentication APIs

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```typescript
{
  username: string;
  email: string;
  password: string;
}
```

**Example:**
```typescript
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword@123"
}
```

**Response:**
```typescript
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "message": "User registered successfully"
}
```

**Usage in Angular:**
```typescript
this.authService.register({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'SecurePassword@123'
}).subscribe({
  next: (response) => {
    console.log('Registration successful', response);
    this.router.navigate(['/login']);
  },
  error: (error) => {
    console.error('Registration failed', error);
  }
});
```

---

### Login User

**Endpoint:** `POST /auth/login`

**Request Body:**
```typescript
{
  username: string;
  password: string;
}
```

**Example:**
```typescript
{
  "username": "john_doe",
  "password": "SecurePassword@123"
}
```

**Response:**
```typescript
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "message": "Login successful"
}
```

**Usage in Angular:**
```typescript
this.authService.login({
  username: 'john_doe',
  password: 'SecurePassword@123'
}).subscribe({
  next: (response) => {
    console.log('Login successful', response);
    // Token is auto-saved by AuthService
    this.router.navigate(['/products']);
  },
  error: (error) => {
    console.error('Login failed', error);
  }
});
```

---

## Product APIs

### Get All Products

**Endpoint:** `GET /products`

**Parameters:** None

**Response:**
```typescript
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "quantity": 50
  },
  // ... more products
]
```

**Usage in Angular:**
```typescript
this.productService.getAllProducts().subscribe({
  next: (products) => {
    this.products = products;
  },
  error: (error) => {
    console.error('Failed to load products', error);
  }
});
```

**Cached:** ✅ Yes (via @Cacheable annotation on backend)

---

### Get Product by ID

**Endpoint:** `GET /products/{id}`

**Parameters:**
- `id` (path parameter): Product ID

**Example:** `GET /products/1`

**Response:**
```typescript
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "quantity": 50
}
```

**Usage in Angular:**
```typescript
this.productService.getProductById(1).subscribe({
  next: (product) => {
    this.product = product;
  },
  error: (error) => {
    console.error('Product not found', error);
  }
});
```

---

### Search Products

**Endpoint:** `GET /products/search`

**Parameters:**
- `keyword` (query parameter): Search keyword

**Example:** `GET /products/search?keyword=laptop`

**Response:**
```typescript
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99
  }
]
```

**Usage in Angular:**
```typescript
this.productService.searchProducts('laptop').subscribe({
  next: (products) => {
    this.searchResults = products;
  },
  error: (error) => {
    console.error('Search failed', error);
  }
});
```

---

## Cart APIs

### Get Cart

**Endpoint:** `GET /cart/{userId}`

**Parameters:**
- `userId` (path parameter): User ID

**Example:** `GET /cart/1`

**Response:**
```typescript
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "productName": "Laptop",
      "quantity": 1,
      "price": 999.99
    }
  ],
  "totalPrice": 999.99
}
```

**Usage in Angular:**
```typescript
this.cartService.getCart(userId).subscribe({
  next: (cart) => {
    this.cart = cart;
    this.totalPrice = cart.totalPrice;
  },
  error: (error) => {
    console.error('Failed to load cart', error);
  }
});
```

---

### Add to Cart

**Endpoint:** `POST /cart/{userId}/add`

**Parameters:**
- `userId` (path parameter): User ID
- `productId` (query parameter): Product ID
- `quantity` (query parameter): Quantity (default: 1)

**Example:** `POST /cart/1/add?productId=1&quantity=2`

**Response:**
```typescript
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "productName": "Laptop",
      "quantity": 2,
      "price": 999.99
    }
  ],
  "totalPrice": 1999.98
}
```

**Usage in Angular:**
```typescript
this.cartService.addToCart(userId, productId, 2).subscribe({
  next: (updatedCart) => {
    console.log('Item added to cart');
    this.cart = updatedCart;
  },
  error: (error) => {
    console.error('Failed to add to cart', error);
  }
});
```

---

### Remove from Cart

**Endpoint:** `DELETE /cart/{userId}/{productId}`

**Parameters:**
- `userId` (path parameter): User ID
- `productId` (path parameter): Product ID

**Example:** `DELETE /cart/1/1`

**Response:**
```typescript
{
  "id": 1,
  "userId": 1,
  "items": [],
  "totalPrice": 0
}
```

**Usage in Angular:**
```typescript
this.cartService.removeFromCart(userId, productId).subscribe({
  next: (updatedCart) => {
    console.log('Item removed from cart');
    this.cart = updatedCart;
  },
  error: (error) => {
    console.error('Failed to remove from cart', error);
  }
});
```

---

### Update Cart Item

**Endpoint:** `PUT /cart/{userId}/{productId}`

**Parameters:**
- `userId` (path parameter): User ID
- `productId` (path parameter): Product ID
- `quantity` (query parameter): New quantity

**Example:** `PUT /cart/1/1?quantity=5`

**Response:**
```typescript
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "productName": "Laptop",
      "quantity": 5,
      "price": 999.99
    }
  ],
  "totalPrice": 4999.95
}
```

**Usage in Angular:**
```typescript
this.cartService.updateCartItem(userId, productId, 5).subscribe({
  next: (updatedCart) => {
    console.log('Cart updated');
    this.cart = updatedCart;
  },
  error: (error) => {
    console.error('Failed to update cart', error);
  }
});
```

---

### Clear Cart

**Endpoint:** `DELETE /cart/{userId}/clear`

**Parameters:**
- `userId` (path parameter): User ID

**Example:** `DELETE /cart/1/clear`

**Response:**
```typescript
{
  "id": 1,
  "userId": 1,
  "items": [],
  "totalPrice": 0
}
```

**Usage in Angular:**
```typescript
this.cartService.clearCart(userId).subscribe({
  next: (emptyCart) => {
    console.log('Cart cleared');
    this.cart = emptyCart;
  },
  error: (error) => {
    console.error('Failed to clear cart', error);
  }
});
```

---

## Order APIs

### Create Order

**Endpoint:** `POST /orders`

**Request Body:**
```typescript
{
  "userId": number;
  "items": [
    {
      "productId": number;
      "quantity": number;
      "price": number;
    }
  ]
}
```

**Example:**
```typescript
{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 999.99
    }
  ]
}
```

**Response:**
```typescript
{
  "id": 1,
  "userId": 1,
  "orderDate": "2024-01-15T10:30:00",
  "status": "PENDING",
  "items": [
    {
      "productId": 1,
      "productName": "Laptop",
      "quantity": 2,
      "price": 999.99
    }
  ],
  "totalAmount": 1999.98
}
```

**Usage in Angular:**
```typescript
const orderItems = this.cart.items.map((item: any) => ({
  productId: item.productId,
  quantity: item.quantity,
  price: item.price
}));

this.orderService.createOrder(userId, orderItems).subscribe({
  next: (newOrder) => {
    console.log('Order created', newOrder);
    this.processPayment(newOrder.id);
  },
  error: (error) => {
    console.error('Failed to create order', error);
  }
});
```

---

### Get Order by ID

**Endpoint:** `GET /orders/{id}`

**Parameters:**
- `id` (path parameter): Order ID

**Example:** `GET /orders/1`

**Response:**
```typescript
{
  "id": 1,
  "userId": 1,
  "orderDate": "2024-01-15T10:30:00",
  "status": "DELIVERED",
  "items": [
    {
      "productId": 1,
      "productName": "Laptop",
      "quantity": 2,
      "price": 999.99
    }
  ],
  "totalAmount": 1999.98
}
```

**Usage in Angular:**
```typescript
this.orderService.getOrder(orderId).subscribe({
  next: (order) => {
    this.order = order;
  },
  error: (error) => {
    console.error('Order not found', error);
  }
});
```

---

### Get User Orders

**Endpoint:** `GET /orders/user/{userId}`

**Parameters:**
- `userId` (path parameter): User ID

**Example:** `GET /orders/user/1`

**Response:**
```typescript
[
  {
    "id": 1,
    "userId": 1,
    "orderDate": "2024-01-15T10:30:00",
    "status": "DELIVERED",
    "items": [...],
    "totalAmount": 1999.98
  },
  {
    "id": 2,
    "userId": 1,
    "orderDate": "2024-01-20T14:20:00",
    "status": "PENDING",
    "items": [...],
    "totalAmount": 499.99
  }
]
```

**Usage in Angular:**
```typescript
this.orderService.getOrdersByUser(userId).subscribe({
  next: (orders) => {
    this.userOrders = orders;
  },
  error: (error) => {
    console.error('Failed to load orders', error);
  }
});
```

---

## Payment APIs

### Create Stripe Payment Intent

**Endpoint:** `POST /payments/create-intent`

**Request Body:**
```typescript
{
  "orderId": number;
  "amount": number;
  "currency": string;  // "USD", "EUR", "GBP", "INR"
}
```

**Example:**
```typescript
{
  "orderId": 1,
  "amount": 1999.98,
  "currency": "USD"
}
```

**Response:**
```typescript
{
  "clientSecret": "pi_test_123456789_secret_abcdef",
  "paymentIntentId": "pi_test_123456789",
  "status": "requires_payment_method"
}
```

**Usage in Angular:**
```typescript
this.paymentService.createStripeIntent({
  orderId: orderId,
  amount: totalAmount,
  currency: 'USD'
}).subscribe({
  next: (response) => {
    this.clientSecret = response.clientSecret;
    // Initialize Stripe payment form
  },
  error: (error) => {
    console.error('Failed to create payment intent', error);
  }
});
```

---

### Confirm Payment

**Endpoint:** `POST /payments/confirm`

**Request Body:**
```typescript
{
  "paymentIntentId": string;
  "stripeToken": string;
  "orderId": number;
}
```

**Example:**
```typescript
{
  "paymentIntentId": "pi_test_123456789",
  "stripeToken": "tok_test_123456789",
  "orderId": 1
}
```

**Response:**
```typescript
{
  "id": 1,
  "orderId": 1,
  "paymentIntentId": "pi_test_123456789",
  "amount": 1999.98,
  "currency": "USD",
  "status": "succeeded",
  "paymentDate": "2024-01-15T10:35:00"
}
```

**Usage in Angular:**
```typescript
this.paymentService.confirmPayment(
  paymentIntentId,
  stripeToken,
  orderId
).subscribe({
  next: (payment) => {
    console.log('Payment successful', payment);
    this.router.navigate(['/orders']);
  },
  error: (error) => {
    console.error('Payment failed', error);
  }
});
```

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Auth Required: `4000 0025 0000 3155`

---

### Get Payment

**Endpoint:** `GET /payments/{id}`

**Parameters:**
- `id` (path parameter): Payment ID

**Example:** `GET /payments/1`

**Response:**
```typescript
{
  "id": 1,
  "orderId": 1,
  "paymentIntentId": "pi_test_123456789",
  "amount": 1999.98,
  "currency": "USD",
  "status": "succeeded",
  "paymentDate": "2024-01-15T10:35:00"
}
```

**Usage in Angular:**
```typescript
this.paymentService.getPayment(paymentId).subscribe({
  next: (payment) => {
    this.payment = payment;
  },
  error: (error) => {
    console.error('Payment not found', error);
  }
});
```

---

## Response Format

### Successful Response

```typescript
{
  "data": {
    // Response payload
  },
  "message": "Success message"
}
```

### Error Response

```typescript
{
  "message": "Error message",
  "path": "/api/endpoint",
  "timestamp": "2024-01-15T10:30:00"
}
```

---

## Error Codes

| Code | Status | Message | Solution |
|------|--------|---------|----------|
| 200 | OK | Request successful | None |
| 201 | Created | Resource created | None |
| 400 | Bad Request | Invalid input | Check request body |
| 401 | Unauthorized | Missing/invalid auth | Login again |
| 404 | Not Found | Resource not found | Verify resource ID |
| 409 | Conflict | Resource exists | Use unique identifier |
| 500 | Server Error | Backend error | Check backend logs |

---

## Request Headers

Add these headers to all requests:

```
Content-Type: application/json
Authorization: Basic base64(username:password)
Accept: application/json
```

The AuthInterceptor automatically adds these to all requests.

---

## Rate Limiting

Currently not implemented. Future versions will include rate limiting.

---

## API Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Create requests for each endpoint
4. Set Authorization type to "Basic Auth"
5. Enter username and password
6. Test endpoints

### Example Request

```
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePassword@123"
}
```

---

## Pagination (Future)

Pagination will be added in future versions. Current API returns all results.

---

## WebSocket Support (Future)

Real-time order status updates will be added in future versions.

---

## API Versioning

Current API version: `v1` (default)

Future versions: `/api/v2/`, `/api/v3/`, etc.

---

## Deprecation Policy

Deprecated endpoints will be marked with `@Deprecated` annotation and documented.
Users will have 6 months notice before removal.

---

## Support

For API issues, check:
1. Backend logs: `./mvnw spring-boot:run`
2. Network tab in browser DevTools
3. API response error messages
4. Backend database status

---

**Last Updated:** January 2024
**API Version:** 1.0.0
