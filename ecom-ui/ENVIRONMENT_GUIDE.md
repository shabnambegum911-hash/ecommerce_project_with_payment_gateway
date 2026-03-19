# Environment Configuration Guide

Complete guide for configuring different environments (development, staging, production) for the Angular e-commerce UI.

## Overview

The application supports multiple environments with different configurations:

- **Development**: Local development with backend on localhost:8080
- **Production**: Deployed to production servers

## Environment Files Structure

```
src/environments/
├── environment.ts          # Development (default)
└── environment.prod.ts     # Production
```

## Development Environment

### File: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  stripePublishableKey: 'pk_test_YOUR_TEST_KEY_HERE'
};
```

### Configuration Details

| Property | Value | Description |
|----------|-------|-------------|
| `production` | `false` | Enables development mode |
| `apiUrl` | `http://localhost:8080/api` | Backend API URL |
| `stripePublishableKey` | `pk_test_*` | Stripe test publishable key |

### Stripe Test Keys

Get test keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys):

1. Log in to Stripe Dashboard
2. Navigate to "Developers" → "API keys"
3. Use test keys (starts with `pk_test_`)
4. Copy and paste into `stripePublishableKey`

**Test Cards:**
```
Success:         4242 4242 4242 4242
Decline:         4000 0000 0000 0002
Auth Required:   4000 0025 0000 3155
Exp: Any future (e.g., 12/25), CVC: Any 3 digits (e.g., 123)
```

### Backend Configuration

Ensure backend is running:

```bash
# Terminal 1 - Backend
cd ecom-proj-master
./mvnw spring-boot:run

# Terminal 2 - Frontend
cd ecom-proj-master/ecom-ui
npm start
```

Backend will run on `http://localhost:8080`

### Database Setup

**H2 Database (default for development):**
- Auto-created on server startup
- In-memory or file-based
- No setup required

**MySQL (recommended for development):**

```bash
# Start MySQL using Docker
docker-compose -f docker-compose.yml up -d mysql

# Or install locally
mysql --version

# Create database
mysql -u root -p
CREATE DATABASE ecom_db;
```

Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecom_db
spring.datasource.username=root
spring.datasource.password=password
```

### Redis Setup (Optional)

For product caching in development:

```bash
# Start Redis using Docker
docker-compose -f docker-compose.yml up -d redis

# Or install locally
redis-cli --version
```

Update `application.properties`:
```properties
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

## Production Environment

### File: `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  stripePublishableKey: 'pk_live_YOUR_LIVE_KEY_HERE'
};
```

### Configuration Details

| Property | Value | Description |
|----------|-------|-------------|
| `production` | `true` | Enables production mode |
| `apiUrl` | `https://api.yourdomain.com/api` | Production backend URL |
| `stripePublishableKey` | `pk_live_*` | Stripe live publishable key |

### Stripe Live Keys

1. Ensure Stripe account is verified
2. Navigate to "Developers" → "API keys" in Stripe Dashboard
3. Use live keys (starts with `pk_live_`)
4. Copy and paste into `stripePublishableKey`

**IMPORTANT:** Live keys are for real transactions. Test thoroughly before using.

### Backend Configuration

```properties
# Production database
spring.datasource.url=jdbc:mysql://prod-db-server:3306/ecom_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# Production Redis
spring.data.redis.host=prod-redis-server
spring.data.redis.port=6379
spring.data.redis.password=${REDIS_PASSWORD}

# SSL/TLS
server.ssl.key-store=${KEYSTORE_PATH}
server.ssl.key-store-password=${KEYSTORE_PASSWORD}
```

### Build for Production

```bash
# Build optimized production bundle
npm run build
# or
ng build --configuration production
```

Output in `dist/ecom-ui/`

### Deployment Options

#### 1. **AWS S3 + CloudFront**

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ecom-ui s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

#### 2. **Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
netlify deploy --prod --dir=dist/ecom-ui
```

#### 3. **Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### 4. **Docker**

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/ecom-ui /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build Docker image
docker build -t ecom-ui:latest .

# Run container
docker run -p 80:80 ecom-ui:latest
```

## Environment Variables

### Using Environment Variables

Create `.env` files in root directory:

```bash
# .env
VITE_API_URL=http://localhost:8080/api
VITE_STRIPE_KEY=pk_test_xxxxx
```

Access in code:

```typescript
const apiUrl = process.env['VITE_API_URL'] || 'http://localhost:8080/api';
```

### GitHub Secrets (for CI/CD)

```yaml
# .github/workflows/deploy.yml
env:
  API_URL: ${{ secrets.API_URL }}
  STRIPE_KEY: ${{ secrets.STRIPE_KEY }}
```

## Multi-Environment Configuration

### Development

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  stripePublishableKey: 'pk_test_xxx',
  logLevel: 'debug',
  enableConsoleLogging: true
};
```

### Staging

```typescript
// environment.staging.ts
export const environment = {
  production: false,
  apiUrl: 'https://staging-api.yourdomain.com/api',
  stripePublishableKey: 'pk_test_xxx',
  logLevel: 'info',
  enableConsoleLogging: false
};
```

### Production

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  stripePublishableKey: 'pk_live_xxx',
  logLevel: 'error',
  enableConsoleLogging: false
};
```

## Build for Specific Environment

### Development (Default)

```bash
npm start
# or
ng serve
```

### Production

```bash
npm run build
# or
ng build --configuration production
```

### Custom Environment

```bash
# Add to angular.json first
ng build --configuration=staging
```

## Environment File Injection

### Using Environment in Components

```typescript
// any.component.ts
import { environment } from 'src/environments/environment';

export class AnyComponent {
  apiUrl = environment.apiUrl;
  stripeKey = environment.stripePublishableKey;

  isProduction = environment.production;
}
```

### Conditional Logic

```typescript
if (environment.production) {
  // Production-only code
  enableErrorReporting();
} else {
  // Development-only code
  console.log('Development mode');
}
```

## Domain Configuration

### Update API URL by Domain

```typescript
// app.config.ts
export function getApiUrl(): string {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8080/api';
  } else if (hostname === 'staging.example.com') {
    return 'https://staging-api.example.com/api';
  } else {
    return 'https://api.example.com/api';
  }
}
```

## SSL/TLS Configuration

### Production HTTPS

1. **Obtain SSL Certificate:**
   - AWS Certificate Manager
   - Let's Encrypt
   - DigiCert/GoDaddy

2. **Configure Backend (Spring Boot):**
   ```properties
   server.ssl.key-store=/path/to/keystore.jks
   server.ssl.key-store-password=${KEYSTORE_PASSWORD}
   server.ssl.key-store-type=JKS
   ```

3. **Update API URL:**
   ```typescript
   apiUrl: 'https://api.yourdomain.com/api'
   ```

## CORS Configuration

### Development

Backend allows localhost:

```java
// SecurityConfig.java
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

### Production

```java
.allowedOrigins("https://yourdomain.com")
```

## Logging

### Development

```typescript
if (!environment.production) {
  console.log('API URL:', environment.apiUrl);
  console.log('Stripe Key:', environment.stripePublishableKey);
}
```

### Production

Disable console logging:

```typescript
if (environment.production) {
  // Remove console.log in production
  console.log = () => {};
}
```

## Feature Flags

### Environment-based Features

```typescript
export interface EnvironmentConfig {
  production: boolean;
  apiUrl: string;
  features: {
    enableProductReviews: boolean;
    enableWishlist: boolean;
    enableAdminPanel: boolean;
  };
}

// environment.ts
features: {
  enableProductReviews: true,
  enableWishlist: true,
  enableAdminPanel: true
}

// environment.prod.ts
features: {
  enableProductReviews: true,
  enableWishlist: false,
  enableAdminPanel: false
}
```

### Using Features

```typescript
if (environment.features.enableWishlist) {
  // Show wishlist button
}
```

## Security Checklist

### Development ✅
- [ ] Use HTTP for local development
- [ ] Use test Stripe keys
- [ ] Enable console logging
- [ ] Use file-based database

### Production ✅
- [ ] Use HTTPS only
- [ ] Use live Stripe keys (for real payments)
- [ ] Disable console logging
- [ ] Use production database
- [ ] Enable security headers
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable CSRF protection

## Performance Optimization

### Production Build

```bash
# Build with optimization
ng build --configuration production --optimization --build-optimizer
```

### Gzip Compression

Enable on server (nginx/Apache):

```nginx
# nginx.conf
gzip on;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/javascript;
```

## Monitoring & Logging

### Add Sentry for Error Tracking

```bash
npm install @sentry/angular
```

```typescript
// main.ts
import * as Sentry from '@sentry/angular';

if (environment.production) {
  Sentry.init({
    dsn: 'https://your-sentry-dsn@sentry.io/project-id',
    environment: 'production',
    tracesSampleRate: 0.1
  });
}
```

## Secrets Management

### Use Environment Variables

Never commit secrets. Store in `.env` or secret manager:

```bash
# .env (add to .gitignore)
STRIPE_KEY=pk_test_xxxxx
API_URL=http://localhost:8080/api
```

Access:

```bash
npm run build -- --base-href=/app/
```

### Manage with CI/CD

```bash
# GitHub Actions
- name: Build
  env:
    STRIPE_KEY: ${{ secrets.STRIPE_KEY }}
  run: npm run build
```

## Rollback Strategy

### Keep Previous Versions

```bash
# Tag releases
git tag -a v1.0.0 -m "Release 1.0.0"

# Rollback if needed
git checkout v0.9.9
npm run build
```

## Environment Parity

Ensure all environments have:

- ✅ Same backend API (v1.0)
- ✅ Same database schema
- ✅ Same Redis configuration
- ✅ Same Stripe API version

## Troubleshooting

### API Not Accessible
- Verify backend is running
- Check `apiUrl` in environment file
- Verify CORS configuration

### Stripe Not Working
- Confirm `stripePublishableKey` is correct
- Ensure key matches environment (test/live)
- Check browser console for errors

### Build Fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

---

**Last Updated:** January 2024
