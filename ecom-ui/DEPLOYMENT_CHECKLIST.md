# Deployment Checklist

Complete checklist for deploying the e-commerce application to production.

## Pre-Deployment Review

### Code Quality

- [ ] All code passes linting (`npm run lint`)
- [ ] No TypeScript errors (`ng build --prod`)
- [ ] No console warnings or errors
- [ ] Code follows Angular best practices
- [ ] Components use OnPush change detection
- [ ] No memory leaks (unsubscribe properly)
- [ ] No unused imports or variables
- [ ] Proper error handling in all services

### Testing

- [ ] Unit tests pass (`npm test`)
- [ ] All critical user flows tested manually
- [ ] Cross-browser testing completed
- [ ] Mobile/responsive testing done
- [ ] Accessibility testing (WCAG 2.1 AA)
- [ ] Performance testing completed
- [ ] Load testing performed

### Security

- [ ] No hardcoded secrets in code
- [ ] All sensitive data in environment variables
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention (backend)
- [ ] Authentication/authorization working
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Secrets not committed to Git

### Performance

- [ ] Bundle size optimized (<1MB min)
- [ ] Lazy loading configured for routes
- [ ] Images optimized and compressed
- [ ] Caching strategies implemented
- [ ] CDN configured for static assets
- [ ] Gzip compression enabled
- [ ] Database queries optimized
- [ ] API response times acceptable (<200ms)
- [ ] Lighthouse score >90
- [ ] Mobile performance optimized

### Backend Preparation

- [ ] Production database configured
- [ ] Database migrations tested and working
- [ ] Redis cache configured (if used)
- [ ] Backup strategy in place
- [ ] Monitoring and logging setup
- [ ] Error tracking (Sentry) configured
- [ ] API rate limiting configured
- [ ] CORS properly configured for production domain
- [ ] SSL/TLS certificates valid
- [ ] Firewall rules configured
- [ ] Database backups automated
- [ ] Load balancer configured (if multi-instance)

---

## Frontend Deployment

### Environment Configuration

- [ ] Update `environment.prod.ts`:
  ```typescript
  export const environment = {
    production: true,
    apiUrl: 'https://api.yourdomain.com/api',
    stripePublishableKey: 'pk_live_YOUR_LIVE_KEY'
  };
  ```

- [ ] Remove all `console.log` statements from production code
- [ ] Update API base URL
- [ ] Use live Stripe keys (starts with `pk_live_`)
- [ ] Disable debug mode
- [ ] Configure error tracking (Sentry)

### Build Process

- [ ] Run production build:
  ```bash
  npm run build --configuration=production
  ```

- [ ] Verify build output:
  ```bash
  ls -la dist/ecom-ui/
  ```

- [ ] Check bundle size:
  ```bash
  npm run analyze  # if script exists
  ```

- [ ] Test production build locally:
  ```bash
  npm install -g http-server
  http-server dist/ecom-ui
  ```

### Deployment Options

#### Option A: AWS S3 + CloudFront

- [ ] Create S3 bucket: `yourdomain-ui`
- [ ] Enable static website hosting
- [ ] Upload dist files:
  ```bash
  aws s3 sync dist/ecom-ui/ s3://yourdomain-ui
  ```
- [ ] Create CloudFront distribution
- [ ] Update DNS CNAME to CloudFront URL
- [ ] Enable SSL certificate
- [ ] Set cache policies (TTL: 1 hour for index.html, 1 year for others)
- [ ] Configure error handling (404 → index.html)

#### Option B: Netlify

- [ ] Connect Git repository
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist/ecom-ui`
- [ ] Set environment variables:
  ```
  STRIPE_KEY=pk_live_xxx
  API_URL=https://api.yourdomain.com/api
  ```
- [ ] Enable HTTPS (automatic)
- [ ] Configure custom domain
- [ ] Enable Netlify Analytics

#### Option C: Vercel

- [ ] Connect Git repository
- [ ] Configure project:
  - Framework: Angular
  - Build: `npm run build`
  - Output: `dist/ecom-ui`
- [ ] Set environment variables
- [ ] Enable HTTPS (automatic)
- [ ] Configure custom domain
- [ ] Set up preview deployments

#### Option D: Docker + Container Registry

- [ ] Build Docker image:
  ```bash
  docker build -t ecom-ui:latest .
  ```

- [ ] Tag for registry:
  ```bash
  docker tag ecom-ui:latest youraccount/ecom-ui:latest
  ```

- [ ] Push to registry:
  ```bash
  docker push youraccount/ecom-ui:latest
  ```

- [ ] Deploy to K8s/ECS/Docker Compose

---

## Backend Deployment

### Java Application

- [ ] Ensure Spring Boot version is latest stable
- [ ] Update `application-prod.properties`:
  ```properties
  spring.datasource.url=jdbc:mysql://prod-db:3306/ecom_db
  spring.datasource.username=${DB_USER}
  spring.datasource.password=${DB_PASSWORD}
  spring.jpa.hibernate.ddl-auto=validate
  spring.data.redis.host=prod-redis
  spring.data.redis.port=6379
  ```

- [ ] Build JAR:
  ```bash
  ./mvnw clean package -DskipTests -Pprod
  ```

- [ ] Verify JAR size and integrity
- [ ] Test JAR locally before deployment

### Database

- [ ] Create production database:
  ```sql
  CREATE DATABASE ecom_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

- [ ] Run migrations:
  ```bash
  ./mvnw flyway:migrate -Dspring.profiles.active=prod
  ```

- [ ] Enable SSL connections
- [ ] Configure automatic backups
- [ ] Set up monitoring alerts
- [ ] Test disaster recovery procedure

### Redis Cache

- [ ] Deploy Redis instance
- [ ] Configure password authentication
- [ ] Enable persistence:
  ```
  appendonly yes
  appendfsync everysec
  ```
- [ ] Set up monitoring
- [ ] Configure eviction policy

### Server Configuration

- [ ] Install Java 21+:
  ```bash
  java -version
  ```

- [ ] Configure firewall rules
- [ ] Open necessary ports (443, 80)
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Enable SSL/TLS
- [ ] Configure log rotation

---

## Monitoring & Observability

### Application Monitoring

- [ ] Enable application performance monitoring (APM)
- [ ] Set up error tracking (Sentry/Rollbar)
- [ ] Configure logging aggregation (ELK/Splunk)
- [ ] Set up alerts for:
  - High error rates (>1%)
  - Response time degradation (>500ms)
  - Server down
  - Database errors
  - API failures

### Frontend Monitoring

- [ ] Add Google Analytics/Mixpanel
- [ ] Configure Real User Monitoring (RUM)
- [ ] Set up Core Web Vitals tracking
- [ ] Monitor JavaScript errors
- [ ] Track user sessions

### Backend Monitoring

- [ ] Monitor database performance
- [ ] Monitor Redis cache hit rate
- [ ] Monitor API response times
- [ ] Monitor database connection pool
- [ ] Monitor server CPU/memory/disk

---

## Security Hardening

### SSL/TLS

- [ ] Obtain SSL certificate (Let's Encrypt)
- [ ] Install certificate on server
- [ ] Enable HTTPS only (force redirect)
- [ ] Configure HSTS header:
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  ```

### HTTP Headers

- [ ] Set security headers in nginx/Apache:
  ```
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com
  Referrer-Policy: strict-origin-when-cross-origin
  ```

### CORS Configuration

- [ ] Configure CORS for production domain only:
  ```java
  .allowedOrigins("https://yourdomain.com")
  .allowedMethods("GET", "POST", "PUT", "DELETE")
  .allowedHeaders("*")
  .allowCredentials(true)
  ```

### API Security

- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Output encoding implemented
- [ ] SQL injection protection enabled
- [ ] CSRF tokens if needed
- [ ] Token expiration configured
- [ ] Secure password hashing (BCrypt)

---

## Documentation

- [ ] Production deployment guide written
- [ ] Runbook for common issues created
- [ ] Database schema documented
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Rollback procedure documented
- [ ] Incident response plan created

---

## Post-Deployment Verification

### Immediate Checks (First Hour)

- [ ] Frontend loads without errors
- [ ] Navigation works
- [ ] API calls succeed
- [ ] Database connected
- [ ] Redis working
- [ ] Stripe test payment works
- [ ] Login/Register functional
- [ ] Product listing displays
- [ ] Shopping cart works
- [ ] Checkout process completes
- [ ] Order confirmation shows
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Mobile version works

### Extended Checks (First 24 Hours)

- [ ] Monitor error tracking for issues
- [ ] Review logs for warnings/errors
- [ ] Check database performance
- [ ] Verify backups running
- [ ] Monitor server resources
- [ ] Test payment process with real card
- [ ] Verify email notifications (if implemented)
- [ ] Check search functionality
- [ ] Test cart persistence
- [ ] Verify order history
- [ ] Check user authentication
- [ ] Monitor API response times

### Weekly Checks

- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify backup integrity
- [ ] Test disaster recovery
- [ ] Monitor user feedback
- [ ] Check security alerts

---

## Rollback Plan

### If Issues Occur

1. **Immediate Action:**
   ```bash
   # Revert to previous version
   git revert <commit-hash>
   npm run build
   # Redeploy
   ```

2. **Database:**
   - Restore from backup if data corrupted
   - Verify data consistency

3. **Communication:**
   - Notify team and users
   - Update status page
   - Post incident update

4. **Post-Mortem:**
   - Identify root cause
   - Implement prevention
   - Update runbook

---

## Performance Targets

- [ ] Frontend bundle: < 1 MB gzipped
- [ ] First Contentful Paint: < 2s
- [ ] Largest Contentful Paint: < 2.5s
- [ ] Cumulative Layout Shift: < 0.1
- [ ] API response time: < 200ms (p95)
- [ ] Database query time: < 100ms (p95)
- [ ] Page load time: < 3s (p90)
- [ ] Lighthouse score: > 90
- [ ] Uptime target: 99.95%

---

## Cost Optimization

- [ ] Review server sizing (right-size resources)
- [ ] Enable auto-scaling if using cloud
- [ ] Optimize database indexes
- [ ] Cache frequently accessed data
- [ ] Review CDN usage
- [ ] Monitor data transfer costs
- [ ] Review storage costs
- [ ] Consolidate services where possible

---

## Compliance & Regulations

- [ ] GDPR compliance (if EU users)
- [ ] Terms of Service drafted
- [ ] Privacy Policy created
- [ ] Cookie consent implemented
- [ ] Data retention policy defined
- [ ] User data export functionality (GDPR)
- [ ] User deletion functionality
- [ ] Payment compliance (PCI-DSS)
- [ ] Accessibility compliance (WCAG 2.1)

---

## Handoff Documentation

- [ ] Deployment guide created
- [ ] Operational runbook written
- [ ] On-call documentation prepared
- [ ] Team training completed
- [ ] Support process defined
- [ ] Escalation procedures documented
- [ ] Contact list maintained

---

## Sign-Off

- [ ] Product Owner approval: _______________
- [ ] QA Lead approval: _______________
- [ ] DevOps/Infrastructure Lead: _______________
- [ ] Security Team approval: _______________
- [ ] Deployment Date: _______________
- [ ] Deployed By: _______________

---

## Post-Deployment Notes

```markdown
## Deployment Summary

- **Date:** [Date]
- **Version:** [Version]
- **Environment:** Production
- **Deployed By:** [Name]
- **Changes:** [Summary of changes]
- **Known Issues:** [Any known issues]
- **Notes:** [Additional notes]
```

---

**Template Version:** 1.0.0
**Last Updated:** January 2024

---

## Quick Reference

### Essential Commands

```bash
# Build frontend
npm run build

# Build backend
./mvnw clean package

# Deploy to S3
aws s3 sync dist/ecom-ui s3://bucket-name

# Docker deploy
docker build -t ecom-ui:latest .
docker push youraccount/ecom-ui:latest

# Health check
curl https://yourdomain.com/api/products
```

### Emergency Contacts

- **DevOps Lead:** [Phone/Email]
- **Database Admin:** [Phone/Email]
- **Security Officer:** [Phone/Email]
- **Product Manager:** [Phone/Email]

---

**Remember:** Always test thoroughly before deploying to production!
