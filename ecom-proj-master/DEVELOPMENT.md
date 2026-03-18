# Development Guide

## Project Structure

```
ecom-proj/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/telusko/ecom_proj/
│   │   │       ├── controller/          # REST API endpoints
│   │   │       ├── service/             # Business logic
│   │   │       ├── model/               # JPA entities
│   │   │       ├── repo/                # Data access
│   │   │       ├── config/              # Configuration classes
│   │   │       ├── exception/           # Custom exceptions
│   │   │       ├── interceptor/         # Request interceptors
│   │   │       ├── dto/                 # Data transfer objects
│   │   │       └── util/                # Utility classes
│   │   └── resources/
│   │       └── application.properties   # Application config
│   └── test/
│       └── java/                        # Unit tests
├── pom.xml                              # Maven configuration
├── README.md                            # Project documentation
└── docker-compose.yml                   # Docker configuration
```

## Development Setup

### 1. Import Project into IDE

**IntelliJ IDEA:**
1. File → Open
2. Select the project root directory
3. Choose "Open as Project"
4. Wait for Maven to download dependencies

**VS Code:**
1. Install Extension Pack for Java
2. Open project folder
3. Maven will auto-detect pom.xml

### 2. Run Application

**From IDE:**
- Right-click on `EcomProjApplication.java` → Run

**From Command Line:**
```bash
mvn spring-boot:run
```

**Debug Mode:**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"
```

### 3. Database Setup

**H2 Console (In-Memory):**
- Automatically initialized
- Access at: http://localhost:8080/h2-console
- Username: `sa`
- Password: (empty)

**MySQL Setup:**
```sql
CREATE DATABASE ecommerce;
CREATE USER 'ecom_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecom_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Redis Setup

**Windows (using Chocolatey):**
```bash
choco install redis
redis-server
```

**Mac (using Homebrew):**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

**Verify Redis:**
```bash
redis-cli ping  # Should return PONG
```

## Common Development Tasks

### Adding a New Entity

1. Create entity class in `model/`
```java
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    // fields...
}
```

2. Create repository in `repo/`
```java
@Repository
public interface NewEntityRepo extends JpaRepository<NewEntity, Integer> {
    // custom queries
}
```

3. Create service in `service/`
4. Create controller in `controller/`

### Adding Caching

```java
@Service
public class MyService {
    @Cacheable("cacheName")
    public Result getResult(String key) {
        // Method body
    }

    @CacheEvict("cacheName", key = "#id")
    public void update(int id) {
        // Method body
    }
}
```

### Exception Handling

Use custom exceptions in services:
```java
throw new ResourceNotFoundException("Resource not found");
throw new PaymentException("Payment failed");
```

Exception handler automatically returns proper HTTP response.

### Logging

```java
private static final Logger logger = LoggerFactory.getLogger(ClassName.class);

logger.info("User login successful: {}", username);
logger.warn("Low inventory for product: {}", productId);
logger.error("Payment processing failed", exception);
```

## Testing

### Unit Tests

```bash
mvn test
mvn test -Dtest=UserServiceTest
```

### Integration Tests

```bash
mvn verify
```

### API Testing with Postman

1. Import API collection from `postman-collection.json`
2. Set environment variables:
   - `base_url`: http://localhost:8080
   - `auth_token`: (set after login)
3. Run requests

## Build & Deployment

### Build JAR

```bash
mvn clean package -DskipTests
```

### Build with Docker

```bash
docker build -t ecom-app:latest .
docker run -p 8080:8080 ecom-app:latest
```

### Docker Compose

```bash
docker-compose up -d
```

## Performance Monitoring

### Enable Spring Boot Actuator

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Access metrics at:
- http://localhost:8080/actuator/health
- http://localhost:8080/actuator/metrics

## Debugging Tips

### 1. Check Application Logs
```bash
tail -f logs/ecom-app.log
```

### 2. Enable Debug Logging
In `application.properties`:
```properties
logging.level.com.telusko=DEBUG
logging.level.org.springframework.web=DEBUG
```

### 3. Check Database
```bash
# H2 Console
http://localhost:8080/h2-console

# MySQL
mysql -u root -p ecommerce
SELECT * FROM user;
```

### 4. Check Redis
```bash
redis-cli
> KEYS *
> GET key_name
> FLUSHALL  # Clear all cache
```

### 5. API Debugging
Use Postman or cURL to test endpoints:
```bash
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Basic dXNlcjpwYXNz"
```

## Code Quality

### Static Analysis

```bash
mvn checkstyle:check
```

### Code Coverage

```bash
mvn clean test jacoco:report
# Report: target/site/jacoco/index.html
```

## Best Practices

1. **Always use services** for business logic, never directly in controllers
2. **Use DTOs** for API requests/responses
3. **Validate input** using annotations or ValidationUtil
4. **Handle exceptions** gracefully
5. **Add logging** for important operations
6. **Use caching** for frequently accessed data
7. **Keep transactions simple** and minimal
8. **Test thoroughly** before committing

## Useful Maven Commands

```bash
mvn clean              # Clean build
mvn compile            # Compile only
mvn test               # Run tests
mvn package            # Create JAR
mvn dependency:tree    # Show dependencies
mvn dependency:check   # Check for updates
```

## IDE Shortcuts and Tips

**IntelliJ IDEA:**
- `Ctrl+Shift+A`: Find action
- `Ctrl+Alt+L`: Format code
- `Ctrl+/`: Comment/uncomment
- `Alt+Enter`: Quick fix suggestions

**VS Code:**
- `Ctrl+Shift+P`: Command palette
- `Ctrl+/`: Toggle comment
- `F5`: Debug
- `Ctrl+F5`: Restart debugger

## Troubleshooting Common Issues

### Port 8080 Already in Use
```bash
# Find process using port
netstat -tlnp | grep 8080
# Kill process
kill -9 <PID>
```

### Maven Dependency Issues
```bash
mvn clean install -DskipTests -U
```

### Spring Boot Won't Start
- Check logs for errors
- Verify database connection
- Check Redis connection
- Ensure all required properties are set

## Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Maven Docs](https://maven.apache.org/guides/)
- [Redis Docs](https://redis.io/documentation)
- [Stripe Docs](https://stripe.com/docs)
