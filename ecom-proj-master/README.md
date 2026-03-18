# E-Commerce Application - Production Ready

A fully-featured Spring Boot e-commerce application with authentication, payment processing, shopping cart, and Redis caching.

## Features

✅ **User Authentication** - Secure registration and login with BCrypt password encoding
✅ **Product Management** - CRUD operations, search, and Redis caching
✅ **Shopping Cart** - Add/remove items, update quantities, persistent cart storage
✅ **Order Management** - Order creation, tracking, and status management
✅ **Payment Processing** - Stripe integration for secure payments
✅ **Caching** - Redis-based caching for product data
✅ **Exception Handling** - Global exception handler with meaningful error messages
✅ **Request Logging** - Interceptor for comprehensive request/response logging
✅ **Security** - Spring Security with role-based access control

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- MySQL/H2 Database
- Redis Server
- Stripe Account (for payment processing)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecom-proj-master
```

### 2. Configure Application Properties
Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Redis Configuration
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.cache.type=redis

# Stripe Configuration
stripe.api.key=sk_test_YOUR_STRIPE_SECRET_KEY

# Server Configuration
server.port=8080
```

### 3. Install Dependencies
```bash
mvn clean install
```

### 4. Run Redis Server
```bash
redis-server
```

### 5. Start the Application
```bash
mvn spring-boot:run
```

The application will start at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (cached)
- `GET /api/products/{id}` - Get product by ID (cached)
- `GET /api/products/search?keyword=xyz` - Search products
- `POST /api/products` - Add new product (requires auth)
- `PUT /api/products/{id}` - Update product (requires auth)
- `DELETE /api/products/{id}` - Delete product (requires auth)

### Shopping Cart
- `GET /api/cart/{userId}` - Get user cart
- `POST /api/cart/{userId}/add` - Add item to cart
- `PUT /api/cart/{userId}/update/{productId}` - Update cart item
- `DELETE /api/cart/{userId}/remove/{productId}` - Remove item from cart
- `DELETE /api/cart/{userId}/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details
- `GET /api/orders/user/{userId}` - Get user orders (requires auth)

### Payments
- `POST /api/payments/stripe/create-intent` - Create Stripe payment intent
- `POST /api/payments/stripe/confirm` - Confirm payment
- `GET /api/payments/{id}` - Get payment details
- `GET /api/payments/order/{orderId}` - Get payment by order
- `PUT /api/payments/{id}/status` - Update payment status

## Database Schema

### Users
```sql
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);
```

### Products
```sql
CREATE TABLE product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100)
);
```

### Orders
```sql
CREATE TABLE order (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2),
    order_date TIMESTAMP,
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
```

### Payments
```sql
CREATE TABLE payment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    transaction_id VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES order(id)
);
```

## Authentication

The application uses Spring Security with two authentication methods:

### Basic Authentication
For development/testing, use Basic Auth:
```
Authorization: Basic base64(username:password)
```

### Role-Based Access Control
- `ADMIN` - Full access to all endpoints
- `USER` - Limited access to user-specific resources

## Deployment

### Docker Deployment
```dockerfile
FROM openjdk:21-jdk
COPY target/ecom-proj-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Environment Variables
```bash
export STRIPE_API_KEY=sk_test_xxx
export SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/ecommerce
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=password
export SPRING_DATA_REDIS_HOST=redis
```

## Testing

### Run Unit Tests
```bash
mvn test
```

### Test API with cURL

#### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"password123",
    "role":"USER"
  }'
```

#### Add Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic dXNlcjpwYXNz" \
  -d '{
    "name":"Laptop",
    "price":999.99,
    "category":"Electronics"
  }'
```

#### Add to Cart
```bash
curl -X POST http://localhost:8080/api/cart/1/add \
  -H "Authorization: Basic dXNlcjpwYXNz" \
  -d "productId=1&quantity=2"
```

## Performance Optimization

### Caching Strategy
- Product list cached for 10 minutes
- Product by ID cached for 1 hour
- Cache automatically invalidated on updates

### Database Optimization
- Indexed product search
- Connection pooling enabled
- Query optimization with projections

### API Rate Limiting
- 100 requests per minute per IP
- Configurable via properties

## Security Best Practices

1. **Password Security**
   - BCrypt with 10 rounds
   - Minimum 8 characters required
   - Special characters recommended

2. **API Security**
   - CSRF protection disabled for API (enable for web)
   - CORS properly configured
   - SQL injection prevention via JPA

3. **Data Protection**
   - HTTPS enforced in production
   - Sensitive data encrypted at rest
   - Payment data handled by Stripe (PCI compliance)

4. **Operational Security**
   - Request logging enabled
   - Exception handling with proper status codes
   - No sensitive data in logs

## Troubleshooting

### Issue: Connection to Redis Failed
**Solution:** Ensure Redis is running on localhost:6379
```bash
redis-cli ping  # Should return PONG
```

### Issue: Stripe Payment Failed
**Solution:** Verify API key in properties and use test mode keys

### Issue: Port Already in Use
**Solution:** Change port in application.properties
```properties
server.port=8081
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Create a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, create an issue on GitHub or contact support@ecommerce.com

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Guide](https://spring.io/guides/topicals/spring-security-architecture/)
- [Stripe Documentation](https://stripe.com/docs)
- [Redis Documentation](https://redis.io/documentation)
