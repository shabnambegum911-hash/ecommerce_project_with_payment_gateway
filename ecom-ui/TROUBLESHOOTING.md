# Troubleshooting Guide - Angular UI & Backend Integration

Solutions to common issues encountered while developing and running the e-commerce application.

## Table of Contents

1. [Frontend Issues](#frontend-issues)
2. [Backend Issues](#backend-issues)
3. [Integration Issues](#integration-issues)
4. [Database Issues](#database-issues)
5. [Payment (Stripe) Issues](#payment-stripe-issues)
6. [Deployment Issues](#deployment-issues)
7. [Performance Issues](#performance-issues)

---

## Frontend Issues

### Problem: `npm install` fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! While resolving: ecom-ui@1.0.0
```

**Solution:**

```bash
# Option 1: Use legacy peer dependencies flag
npm install --legacy-peer-deps

# Option 2: Clear npm cache
npm cache clean --force
npm install

# Option 3: Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: Port 4200 already in use

**Symptoms:**
```
✖ Port 4200 already in use.
```

**Solution:**

```bash
# Option 1: Use different port
ng serve --port 4201

# Option 2: Kill process on port 4200
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :4200
kill -9 <PID>
```

---

### Problem: `ng serve` crashes with no output

**Symptoms:**
```
Compilation complete!
(and then crashes silently)
```

**Solution:**

```bash
# Clear Angular cache
ng cache clean

# Restart dev server
ng serve

# If still failing, check available memory
# Windows
tasklist /v | find "node"

# macOS/Linux
ps aux | grep node
```

---

### Problem: "Cannot find module" errors

**Symptoms:**
```
ERROR in src/app/pages/products/products.component.ts
Cannot find module '@angular/common' or its corresponding type declarations.
```

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify Angular CLI version
ng version

# Update Angular CLI if needed
npm install -g @angular/cli@latest
```

---

### Problem: TypeScript compilation errors

**Symptoms:**
```
src/app/services/product.service.ts(15,5): error TS2339:
Property 'apiUrl' does not exist on type 'environment'.
```

**Solution:**

1. Check `environment.ts` has all required properties:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     stripePublishableKey: 'pk_test_xxx'
   };
   ```

2. Restart development server:
   ```bash
   ng serve
   ```

3. Clear TypeScript cache:
   ```bash
   rm -rf dist/ .angular/
   ng serve
   ```

---

### Problem: Components not rendering

**Symptoms:**
- Blank page
- "Cannot match any routes" error

**Solution:**

1. Check browser console (`F12`) for errors
2. Verify routing configuration in `app.routes.ts`
3. Check component imports in routes:
   ```typescript
   {
     path: 'products',
     loadComponent: () => import('./pages/products/products.component')
       .then(m => m.ProductsComponent)
   }
   ```
4. Verify component is standalone:
   ```typescript
   @Component({
     standalone: true,
     imports: [CommonModule]
   })
   ```

---

### Problem: Styles not applying

**Symptoms:**
- CSS from component files not visible
- Global styles not loading

**Solution:**

1. Check `styles.css` is imported in `main.ts`:
   ```typescript
   import './styles.css';
   ```

2. Verify component CSS file path:
   ```typescript
   @Component({
     styleUrls: ['./my.component.css']  // Check file exists
   })
   ```

3. Restart dev server:
   ```bash
   ng serve
   ```

4. Hard refresh browser (`Ctrl+Shift+R` or `Cmd+Shift+R`)

---

### Problem: Bootstrap not loading

**Symptoms:**
- No Bootstrap styling (no colors, no layout)
- HTML rendered but unstyled

**Solution:**

1. Check Bootstrap CDN in `index.html`:
   ```html
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
   ```

2. Or install via npm:
   ```bash
   npm install bootstrap
   ```

3. Import in `main.ts` or component:
   ```typescript
   import 'bootstrap/dist/css/bootstrap.css';
   ```

4. Hard refresh (`Ctrl+Shift+R`)

---

## Backend Issues

### Problem: Backend won't start

**Symptoms:**
```
Exception in Application context initialization
NoClassDefFoundError
```

**Solution:**

```bash
# Check Java version (requires 21+)
java -version

# Clean and rebuild
./mvnw clean install

# Run with debug output
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx1024m"
```

---

### Problem: "Port 8080 already in use"

**Symptoms:**
```
Address already in use
```

**Solution:**

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>

# Or use different port
./mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

---

### Problem: CORS errors in browser console

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/products'
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solution:**

1. Check backend SecurityConfig has CORS enabled:
   ```java
   @Bean
   public WebMvcConfigurer corsConfigurer() {
     return new WebMvcConfigurer() {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
         registry.addMapping("/api/**")
           .allowedOrigins("http://localhost:4200")
           .allowedMethods("*");
       }
     };
   }
   ```

2. Restart backend:
   ```bash
   ./mvnw spring-boot:run
   ```

---

### Problem: Database connection errors

**Symptoms:**
```
java.sql.SQLException: No suitable driver found
Cannot get a connection, pool error Timeout waiting for idle object
```

**Solution:**

1. Check `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecom_db
   spring.datasource.username=root
   spring.datasource.password=password
   ```

2. Verify MySQL is running:
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

3. Create database if missing:
   ```bash
   mysql -u root -p
   CREATE DATABASE ecom_db;
   ```

4. Check MySQL driver in `pom.xml`:
   ```xml
   <dependency>
     <groupId>mysql</groupId>
     <artifactId>mysql-connector-java</artifactId>
     <version>8.0.33</version>
   </dependency>
   ```

---

## Integration Issues

### Problem: Frontend can't connect to backend

**Symptoms:**
- API calls fail with "Failed to fetch"
- DevTools Network tab: FAILED (no response)
- Console: `ERR_CONNECTION_REFUSED`

**Troubleshooting Steps:**

1. **Verify backend is running:**
   ```bash
   # Terminal 1
   cd ecom-proj-master
   ./mvnw spring-boot:run
   ```

2. **Check API URL in environment:**
   ```typescript
   // src/environments/environment.ts
   apiUrl: 'http://localhost:8080/api'
   ```

3. **Test backend directly:**
   ```bash
   # Terminal
   curl http://localhost:8080/api/products
   ```

4. **Check Services use correct URL:**
   ```typescript
   // product.service.ts
   private apiUrl = `${environment.apiUrl}/products`;
   ```

5. **Restart dev server:**
   ```bash
   ng serve
   ```

---

### Problem: Authentication not working

**Symptoms:**
- Login fails with 401 Unauthorized
- API calls return 401 even after login
- "Invalid credentials"

**Solution:**

1. **Verify user exists in database:**
   ```bash
   mysql -u root -p ecom_db
   SELECT * FROM users;
   ```

2. **Check credentials are correct:**
   ```typescript
   // login.component.ts
   {
     username: 'testuser',
     password: 'TestPassword@123'
   }
   ```

3. **Verify AuthInterceptor is injecting token:**
   ```typescript
   // DevTools → Network → Request Headers
   Authorization: Basic dGVzdHVzZXI6VGVzdFBhc3N3b3JkQDEyMw==
   ```

4. **Base64 encoding check:**
   ```typescript
   // Should encode "username:password"
   btoa('testuser:TestPassword@123')
   // Result: "dGVzdHVzZXI6VGVzdFBhc3N3b3JkQDEyMw=="
   ```

5. **Register new user if needed:**
   - Go to `/register`
   - Fill in email, username, password
   - Click Register
   - Then login

---

### Problem: Cart not persisting across page reload

**Symptoms:**
- Cart data lost when refreshing page
- Cart shows items, but after reload it's empty

**Solution:**

This is expected behavior - cart is session-level. To persist:

1. **Backend:** Cart is stored in database, associated with userId
2. **Frontend:** Cart is loaded on demand after login

**Proper workflow:**
1. Login (userId is saved)
2. Add items to cart
3. Cart is stored in backend database
4. After page refresh, load cart again:
   ```typescript
   ngOnInit() {
     this.cartService.getCart(this.userId).subscribe(...);
   }
   ```

---

## Database Issues

### Problem: "Unknown database" error

**Symptoms:**
```
Unknown database 'ecom_db'
```

**Solution:**

```bash
# Create database
mysql -u root -p
CREATE DATABASE ecom_db;
USE ecom_db;

# Verify
SHOW DATABASES;
SHOW TABLES;
```

---

### Problem: Tables not created automatically

**Symptoms:**
- Database exists but no tables
- "Table 'ecom_db.users' doesn't exist"

**Solution:**

Check `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=create-drop  # or 'create' / 'update'
```

Options:
- `validate` - Validaty schema (must already exist)
- `update` - Update schema (recommended for production)
- `create` - Create fresh schema every startup
- `create-drop` - Create on startup, drop on shutdown

Change to:
```properties
spring.jpa.hibernate.ddl-auto=create
```

Restart backend:
```bash
./mvnw spring-boot:run
```

---

### Problem: "Timezone" errors with MySQL

**Symptoms:**
```
The server time zone value 'UTC' is unrecognized or represents an invalid time zone
```

**Solution:**

Update MySQL connection URL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecom_db?userServerPrepStmts=false&useUnicode=yes&characterEncoding=UTF-8&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
```

---

### Problem: H2 database data lost after restart

**Symptoms:**
- Data persists during session
- After server restart, data is gone

**Solution:**

This is expected with in-memory H2. For persistent H2:

```properties
# Use file-based H2 instead of in-memory
spring.datasource.url=jdbc:h2:file:./data/ecom_db
spring.h2.console.enabled=true
```

For permanent storage, use MySQL:
```bash
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password mysql:latest
```

---

## Payment (Stripe) Issues

### Problem: Stripe key not working

**Symptoms:**
```
Uncaught ReferenceError: Stripe is not defined
```

**Solution:**

1. **Add Stripe.js library to `index.html`:**
   ```html
   <script src="https://js.stripe.com/v3/"></script>
   ```

2. **Copy correct publishable key:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy test key starting with `pk_test_`
   - Paste into `environment.ts`:
   ```typescript
   stripePublishableKey: 'pk_test_YOUR_KEY_HERE'
   ```

3. **Verify in environment:**
   ```typescript
   console.log(environment.stripePublishableKey);
   ```

---

### Problem: "Payment intent not found" error

**Symptoms:**
```
Error: Payment intent not found
```

**Solution:**

1. **Verify orderId is valid:**
   - Order must be created first
   - Check order exists in database

2. **Check createStripeIntent call:**
   ```typescript
   this.paymentService.createStripeIntent({
     orderId: validOrderId,  // Must exist
     amount: totalAmount,
     currency: 'USD'
   }).subscribe(...);
   ```

3. **Test with sample data:**
   - Create order manually in database
   - Use that orderId for payment

---

### Problem: Stripe payment decline

**Symptoms:**
```
Card declined
Your card was declined
```

**Solution:**

1. **Use correct test card:**
   ```
   4242 4242 4242 4242  (Success)
   4000 0000 0000 0002  (Decline)
   4000 0025 0000 3155  (Requires auth)
   ```

2. **Use test mode key (pk_test_):**
   - Test keys in `environment.ts`
   - Live keys in `environment.prod.ts`

3. **Check card details:**
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)

---

### Problem: "Token mismatch" in payment confirmation

**Symptoms:**
```
Token does not match payment intent
```

**Solution:**

1. **Ensure clientSecret matches:**
   ```typescript
   // After creating intent
   this.clientSecret = response.clientSecret;
   
   // When confirming payment
   this.confirmPayment(response.paymentIntentId, token)
   ```

2. **Generate token correctly:**
   ```typescript
   const token = await stripe.createToken(cardElement);
   // Use token.token.id in payment confirmation
   ```

---

## Deployment Issues

### Problem: Application crashes after deployment

**Symptoms:**
```
HTTP 502 Bad Gateway
HTTP 503 Service Unavailable
```

**Solution:**

1. **Check logs:**
   ```bash
   # Docker
   docker logs container-name

   # Heroku
   heroku logs --tail
   ```

2. **Verify environment variables:**
   - API_URL set correctly
   - Stripe key configured
   - Database connected

3. **Check resource limits:**
   - Memory available
   - CPU usage
   - Database connections

---

### Problem: Client-side build errors in production

**Symptoms:**
```
Blank page after deployment
Console errors about missing files
```

**Solution:**

```bash
# Rebuild locally
npm run build

# Verify dist/ folder has all files
ls -la dist/ecom-ui/

# Check for typos in angular.json
cat angular.json | grep "outputPath"

# Deploy again
```

---

### Problem: API URL wrong after deployment

**Symptoms:**
- Frontend works locally
- Breaks after deployed
- API calls to wrong URL

**Solution:**

1. **Update environment.prod.ts:**
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-production-domain.com/api'
   };
   ```

2. **Build for production:**
   ```bash
   ng build --configuration production
   ```

3. **Redeploy**

---

## Performance Issues

### Problem: Slow page load

**Symptoms:**
- Takes 5+ seconds to load page
- DevTools shows large bundle size

**Solution:**

1. **Analyze bundle size:**
   ```bash
   ng build --stats-json
   npm install -g webpack-bundle-analyzer
   webpack-bundle-analyzer dist/ecom-ui/stats.json
   ```

2. **Enable compression:**
   - Nginx: Enable gzip
   - Backend: Configure compression

3. **Lazy load routes:**
   ```typescript
   // Already done in app.routes.ts
   loadComponent: () => import('./pages/products/products.component')
     .then(m => m.ProductsComponent)
   ```

4. **Optimize images:**
   - Use WebP format
   - Compress before upload
   - Use CDN for static files

---

### Problem: High memory usage

**Symptoms:**
- Browser becomes slow
- DevTools shows increasing memory

**Solution:**

1. **Unsubscribe from observables:**
   ```typescript
   private destroy$ = new Subject<void>();

   ngOnDestroy() {
     this.destroy$.next();
     this.destroy$.complete();
   }
   ```

2. **Use trackBy in *ngFor:**
   ```html
   <div *ngFor="let item of items; trackBy: trackByFn">
   ```

3. **Implement OnPush change detection:**
   ```typescript
   changeDetection: ChangeDetectionStrategy.OnPush
   ```

---

## Status Check

### Health Check Command

```bash
# Frontend running?
curl http://localhost:4200

# Backend running?
curl http://localhost:8080/api/products

# MySQL running?
mysql -u root -p -e "SELECT 1;"

# Redis running?
redis-cli ping
```

All should return without errors.

---

## Getting Help

### Provide Information

When asking for help, provide:

1. **Error message** (full stack trace if possible)
2. **Steps to reproduce**
3. **Environment:**
   - OS (Windows/Mac/Linux)
   - Node/Java/MySQL versions
   - Browser and version
4. **Logs:**
   - Browser console log
   - Backend logs
   - Network tab requests/responses

### Resources

- [Angular Documentation](https://angular.io/docs)
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/)
- [Stripe Documentation](https://stripe.com/docs)
- [Mozilla MDN - Web Docs](https://developer.mozilla.org/)

---

**Last Updated:** January 2024
**Version:** 1.0.0
