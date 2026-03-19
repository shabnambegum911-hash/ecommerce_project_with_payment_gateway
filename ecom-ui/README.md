# E-Commerce Angular UI

A modern, responsive Angular 17 single-page application for the e-commerce platform. Built with standalone components, reactive forms, and Bootstrap 5.

## Features

✅ **User Authentication** - Login and registration with token-based auth
✅ **Product Browsing** - Browse and search products with caching
✅ **Shopping Cart** - Add/remove items, update quantities
✅ **Secure Checkout** - Stripe payment integration
✅ **Order Tracking** - View and track user orders
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Error Handling** - Comprehensive error messages and validation
✅ **State Management** - Services-based state management with RxJS

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI 17.x (optional, but recommended)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Endpoint

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',  // Update if backend runs on different port
  stripePublishableKey: 'pk_test_YOUR_KEY'
};
```

### 3. Start Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Project Structure

```
src/
├── app/
│   ├── components/          # Shared UI components
│   │   └── navbar/
│   ├── pages/               # Page components
│   │   ├── home/
│   │   ├── products/
│   │   ├── product-detail/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── login/
│   │   └── register/
│   ├── services/            # API services
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   └── payment.service.ts
│   ├── models/              # TypeScript interfaces
│   ├── interceptors/        # HTTP interceptors
│   ├── app.routes.ts        # Routing configuration
│   └── app.component.ts     # Root component
├── environments/            # Environment configurations
├── styles.css               # Global styles
├── main.ts                  # Bootstrap file
└── index.html               # HTML entry point
```

## Navigation Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/products` | Products | Browse all products |
| `/product/:id` | ProductDetail | Product details page |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Payment page |
| `/orders` | Orders | User orders |
| `/login` | Login | User login |
| `/register` | Register | User registration |

## Key Components

### Authentication
- **Login**: User login with Basic Auth
- **Register**: New user registration

### Product Management
- **Products**: List all products with search
- **Product Detail**: Detailed view with add to cart

### Cart & Checkout
- **Cart**: View, update, and manage cart items
- **Checkout**: Order creation and Stripe payment processing

### Order Management
- **Orders**: View all user orders with status tracking

## Services

### AuthService
Handles user authentication and session management.

```typescript
register(user: User): Observable<ApiResponse<User>>
login(user: User): Observable<ApiResponse<User>>
getCurrentUser(): User | null
isLoggedIn(): boolean
```

### ProductService
Manages product data retrieval and search.

```typescript
getAllProducts(): Observable<Product[]>
getProductById(id: number): Observable<Product>
searchProducts(keyword: string): Observable<Product[]>
```

### CartService
Handles shopping cart operations.

```typescript
getCart(userId: number): Observable<Cart>
addToCart(userId: number, productId: number, quantity: number): Observable<Cart>
removeFromCart(userId: number, productId: number): Observable<Cart>
updateCartItem(userId: number, productId: number, quantity: number): Observable<Cart>
clearCart(userId: number): Observable<Cart>
```

### OrderService
Manages order creation and retrieval.

```typescript
createOrder(userId: number, items: OrderItem[]): Observable<Order>
getOrder(id: number): Observable<Order>
getOrdersByUser(userId: number): Observable<Order[]>
```

### PaymentService
Handles Stripe payment processing.

```typescript
createStripeIntent(request: StripePaymentRequest): Observable<StripePaymentResponse>
confirmPayment(paymentIntentId: string, token: string, orderId: number): Observable<StripePaymentResponse>
getPayment(id: number): Observable<Payment>
```

## Authentication Flow

1. User registers/logs in
2. Credentials encoded as Base64
3. Token stored in localStorage
4. AuthInterceptor adds token to all API requests
5. Backend validates and returns user data

## Styling

The application uses:
- **Bootstrap 5** - UI framework
- **Custom CSS** - Global styles in `styles.css`
- **Responsive Design** - Mobile-first approach

## Build for Production

```bash
npm run build
# or
ng build --configuration production
```

Output files will be in `dist/ecom-ui/`.

## Testing

### Run Unit Tests
```bash
npm test
# or
ng test
```

### Run E2E Tests
```bash
npm run e2e
# or
ng e2e
```

## Deployment

### Build Docker Image

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist/ecom-ui /app/dist
EXPOSE 4200
CMD ["http-server", "dist", "-p", "4200"]
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy dist folder to Netlify
```

### Deploy to AWS S3

```bash
npm run build
aws s3 sync dist/ecom-ui s3://your-bucket-name
```

## Common Development Tasks

### Add New Component

```bash
ng generate component pages/new-page
```

### Add New Service

```bash
ng generate service services/new-service
```

### Generate Interface

```bash
ng generate interface models/new-model
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

1. **Lazy Loading** - Routes are lazy loaded components
2. **Standalone Components** - Reduces bundle size
3. **OnPush CD** - Use ChangeDetectionStrategy.OnPush for components
4. **Tree Shaking** - Unused code is removed during build
5. **Compression** - Enable gzip compression on server

## Troubleshooting

### CORS Issues
- Ensure backend server is running
- Check backend CORS configuration
- Update API URL in environment files

### Authentication Issues
- Clear localStorage and re-login
- Check browser console for token
- Verify backend token validation

### Build Errors
- Delete node_modules: `rm -rf node_modules`
- Reinstall dependencies: `npm install`
- Clear Angular cache: `ng cache clean`

## API Integration

All API calls are made through services. The `AuthInterceptor` automatically adds authentication headers.

Example API call:

```typescript
this.cartService.addToCart(userId, productId, quantity).subscribe({
  next: (cart) => {
    // Success
  },
  error: (error) => {
    // Handle error
  }
});
```

## Security Considerations

1. **Basic Auth** - Credentials base64 encoded and sent over HTTPS
2. **Token Storage** - localStorage used for browser storage
3. **XSS Protection** - Angular sanitizes HTML by default
4. **CSRF Prevention** - Handled by backend

For production:
- Use JWT tokens instead of Basic Auth
- Implement secure storage
- Enable HTTPS
- Add CORS headers properly

## Resources

- [Angular Documentation](https://angular.io/docs)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [RxJS Documentation](https://rxjs.dev/)
- [Stripe Documentation](https://stripe.com/docs)

## Support

For issues and questions, please check:
1. Browser console for errors
2. Network tab in DevTools
3. Backend logs
4. GitHub Issues

## License

MIT - See LICENSE file for details
