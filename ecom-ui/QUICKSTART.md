# Quick Start Guide - Angular UI

Get the Angular UI up and running in 5 minutes!

## Prerequisites

Ensure the **Spring Boot backend** is running on `http://localhost:8080`

```bash
cd ecom-proj-master
./mvnw spring-boot:run
```

## Setup Steps

### Step 1: Install Dependencies

```bash
cd ecom-ui
npm install
```

Expected output:
```
added 1,234 packages in 45s
```

### Step 2: Verify Configuration

Check `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  stripePublishableKey: 'pk_test_...'
};
```

> **Note**: Get your Stripe test publishable key from [Stripe Dashboard](https://dashboard.stripe.com/apikeys). Use test key starting with `pk_test_`.

### Step 3: Start Development Server

```bash
npm start
```

You should see:
```
✔ Compiled successfully.
✔ Compiled successfully. Compilation complete. Watching for file changes...

➜  Local:   http://localhost:4200
➜  Press `o` to open in browser
```

### Step 4: Open in Browser

Navigate to `http://localhost:4200/`

## First Steps

### 1. **Register a New Account**

- Click "Register" or go to `/register`
- Fill in email, password, and username
- Click "Register"

**Test credentials:**
```
Email: test@example.com
Password: Password@123
Username: testuser
```

### 2. **Browse Products**

- Click "Products" or go to `/products`
- View product list (defaults to 5 demo products from backend)
- Search for products using the search box

### 3. **Add to Cart**

- Click on any product to view details
- Enter quantity and click "Add to Cart"
- Verify in cart icon (shows item count)

### 4. **Checkout**

- Click cart icon or go to `/cart`
- Review items and total price
- Click "Proceed to Checkout"

### 5. **Make Test Payment**

On checkout page:
- Enter email and cardholder name
- Use **Stripe test card**: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)
- Click "Pay Now"

### 6. **View Orders**

- Go to `/orders`
- See order history with status badges

## Test Data

### Demo Products (from Backend)

| ID | Name | Price |
|----|------|-------|
| 1 | Laptop | $999.99 |
| 2 | Phone | $699.99 |
| 3 | Tablet | $399.99 |
| 4 | Headphones | $199.99 |
| 5 | Keyboard | $79.99 |

### Stripe Test Cards

| Card | Number | Status |
|------|--------|--------|
| Success | 4242 4242 4242 4242 | ✅ Charges |
| Decline | 4000 0000 0000 0002 | ❌ Declined |
| Auth Required | 4000 0025 0000 3155 | ⚠️ 3D Secure |

**All use:** Any future expiry + any CVC

## Verify Installation

### Check Angular Version
```bash
npm list @angular/core
```
Should show `17.x.x`

### Check Backend Connection
```bash
curl http://localhost:8080/api/products
```
Should return JSON array of products

### View API calls
1. Open browser DevTools: `F12`
2. Go to Network tab
3. Reload page
4. Check API requests to `/api/`

## Common Issues

### ❌ "Cannot GET /products"
- Backend not running
- API URL in environment.ts is wrong
- CORS not configured on backend

**Fix:**
```bash
# Terminal 1 - Backend
cd ecom-proj-master
./mvnw spring-boot:run

# Terminal 2 - Frontend
cd ecom-proj-master/ecom-ui
npm start
```

### ❌ "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Port 4200 already in use
```bash
ng serve --port 4201
```

### ❌ Stripe key not working
- Check key starts with `pk_test_`
- Copy from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Update in `environment.ts`
- Clear browser cache and restart

## Navigation

```
Home (/) 
├── Products (/products)
│   └── Product Detail (/product/:id)
├── Cart (/cart)
│   └── Checkout (/checkout)
├── Orders (/orders)
├── Login (/login)
└── Register (/register)
```

## File Structure

```
ecom-ui/
├── src/
│   ├── app/
│   │   ├── pages/           # Pages (8 components)
│   │   ├── components/      # Navbar
│   │   ├── services/        # API services (5)
│   │   ├── models/          # TypeScript interfaces
│   │   ├── interceptors/    # Auth interceptor
│   │   ├── app.routes.ts
│   │   └── app.component.ts
│   ├── environments/        # Config files
│   └── styles.css
├── package.json
├── angular.json
└── README.md
```

## Development Commands

```bash
# Start dev server (http://localhost:4200)
npm start

# Build for production
npm run build

# Run unit tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## Next Steps

### Ready for testing?

1. ✅ Backend running → `./mvnw spring-boot:run`
2. ✅ Frontend running → `npm start`
3. ✅ Register account
4. ✅ Browse products
5. ✅ Test checkout with Stripe test card

### Want to add features?

See [README.md](README.md) for:
- Component architecture
- Service documentation
- Deployment guides
- Production checklist

### Need help?

Check [troubleshooting section](#common-issues) or review:
- Backend errors: Check `mvn` output or `logs/`
- Frontend errors: Open browser DevTools (`F12`)
- API errors: Network tab in DevTools

## Production Checklist

Before deploying to production:

- [ ] Change API URL to production backend
- [ ] Use Stripe live publishable key (pk_live_...)
- [ ] Set `production: true` in environment.prod.ts
- [ ] Run `npm run build`
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Add environment variables for secrets
- [ ] Test full payment flow
- [ ] Add error logging service
- [ ] Enable performance monitoring

## Useful Links

- [Angular Docs](https://angular.io)
- [Bootstrap Docs](https://getbootstrap.com)
- [Stripe Test Mode](https://stripe.com/docs/testing)
- [RxJS Operators](https://rxjs.dev/guide/operators)

---

**Enjoy building! 🚀**

For more details, see [README.md](README.md)
