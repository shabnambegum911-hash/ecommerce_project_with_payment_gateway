# Testing Guide

## Test Structure

```
src/test/
└── java/
    └── com/telusko/ecom_proj/
        ├── controller/
        ├── service/
        ├── repo/
        └── util/
```

## Running Tests

### Run All Tests
```bash
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=UserServiceTest
```

### Run Specific Test Method
```bash
mvn test -Dtest=UserServiceTest#testUserRegistration
```

### Run with Coverage
```bash
mvn clean test jacoco:report
# Report: target/site/jacoco/index.html
```

## Test Examples

### Service Test Example

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class ProductServiceTest {

    @Mock
    private ProductRepo productRepo;

    @InjectMocks
    private ProductService productService;

    @Before
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllProducts() {
        // Arrange
        List<Product> products = Arrays.asList(
            new Product(1, "Product 1", BigDecimal.valueOf(100)),
            new Product(2, "Product 2", BigDecimal.valueOf(200))
        );
        when(productRepo.findAll()).thenReturn(products);

        // Act
        List<Product> result = productService.getAllProducts();

        // Assert
        assertEquals(2, result.size());
        verify(productRepo, times(1)).findAll();
    }

    @Test
    public void testGetProductById() {
        // Arrange
        int productId = 1;
        Product product = new Product(productId, "Test Product", BigDecimal.valueOf(99.99));
        when(productRepo.findById(productId)).thenReturn(Optional.of(product));

        // Act
        Product result = productService.getProductById(productId);

        // Assert
        assertNotNull(result);
        assertEquals("Test Product", result.getName());
    }

    @Test(expected = ResourceNotFoundException.class)
    public void testGetProductNotFound() {
        // Arrange
        when(productRepo.findById(999)).thenReturn(Optional.empty());

        // Act
        productService.getProductById(999);
    }
}
```

### Controller Test Example

```java
@RunWith(SpringRunner.class)
@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    public void testGetAllProducts() throws Exception {
        // Arrange
        List<Product> products = Arrays.asList(
            new Product(1, "Product 1", BigDecimal.valueOf(100))
        );
        when(productService.getAllProducts()).thenReturn(products);

        // Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.get("/api/products"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()").value(1));
    }

    @Test
    public void testAddProduct() throws Exception {
        // Arrange
        Product product = new Product(1, "New Product", BigDecimal.valueOf(99.99));
        when(productService.addProduct(any(), any())).thenReturn(product);

        // Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.post("/api/product")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"New Product\",\"price\":99.99}"))
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }
}
```

### Integration Test Example

```java
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ProductIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ProductRepo productRepo;

    @Before
    public void setUp() {
        productRepo.deleteAll();
    }

    @Test
    public void testGetAllProductsIntegration() {
        // Arrange
        Product product = new Product(1, "Test Product", BigDecimal.valueOf(99.99));
        productRepo.save(product);

        // Act
        ResponseEntity<List> response = restTemplate.getForEntity(
                "/api/products", List.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }
}
```

## Test Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Integration Tests**: 60%+ critical paths
- **Controllers**: 70%+ endpoints

## Testing Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **One assertion per test** (when possible)
3. **Meaningful test names**: `test<Method><Scenario><Expected>`
4. **Mock external dependencies**
5. **Use test fixtures** for common setup
6. **Keep tests independent**
7. **Use parameterized tests** for multiple scenarios

## Test Data Builders

```java
@Builder
public class ProductTestBuilder {
    private int id = 1;
    private String name = "Test Product";
    private BigDecimal price = BigDecimal.valueOf(99.99);
    
    public Product build() {
        return new Product(id, name, price);
    }
}

// Usage
Product product = ProductTestBuilder.builder()
    .name("Custom Product")
    .price(BigDecimal.valueOf(199.99))
    .build();
```

## Performance Testing

### JMeter Test Plan

```bash
# Run test
jmeter -n -t test_plan.jmx -l results.jtl

# View results
jmeter -g results.jtl -o results/
```

### Load Testing Script

```bash
#!/bin/bash
# Load test script

echo "Starting load test..."

for i in {1..100}; do
    curl -X GET http://localhost:8080/api/products &
done

wait
echo "Load test completed"
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '21'
      - name: Run tests
        run: mvn clean test
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Test Reporting

Generate test report:
```bash
mvn surefire-report:report
# Report: target/site/surefire-report.html
```

View coverage report:
```bash
mvn jacoco:report
# Report: target/site/jacoco/index.html
```
