# Stripe Integration Guide

## Overview
This ecommerce application now integrates with **Stripe**, a leading free payment gateway service. Stripe provides a powerful, flexible payment infrastructure for businesses of all sizes.

## Getting Started with Stripe

### 1. Create a Stripe Account
- Go to [https://stripe.com](https://stripe.com)
- Sign up for a free account
- Navigate to the Dashboard

### 2. Get API Keys
- In your Stripe Dashboard, go to **Developers** > **API Keys**
- Copy your **Secret Key** (starts with `sk_test_` for test mode)
- Copy your **Publishable Key** (starts with `pk_test_` for test mode)

### 3. Configure Application
Update `application.properties` with your Stripe Secret Key:
```properties
stripe.api.key=sk_test_YOUR_STRIPE_SECRET_KEY
```

## Payment Processing Flow

### Two-Step Payment Process

#### Step 1: Create Payment Intent
Create a PaymentIntent which represents your customer's intent to pay.

**Endpoint:** `POST /api/payments/stripe/create-intent`

**Request Body:**
```json
{
  "orderId": 123,
  "amount": 99.99,
  "currency": "USD",
  "description": "Order for products",
  "customerEmail": "customer@example.com",
  "paymentMethod": "CARD"
}
```

**Response:**
```json
{
  "paymentIntentId": "pi_1234567890",
  "clientSecret": "pi_1234567890_secret_abc123",
  "status": "REQUIRES_PAYMENT_METHOD",
  "message": "Payment intent created. Please provide payment method."
}
```

**Usage:** Send the `clientSecret` to your frontend to collect payment details using Stripe.js

#### Step 2: Confirm Payment
Confirm the payment with the customer's card token.

**Endpoint:** `POST /api/payments/stripe/confirm`

**Parameters:**
- `paymentIntentId`: The PaymentIntent ID
- `token`: Stripe token from Stripe.js
- `orderId`: The order ID

**Response:**
```json
{
  "transactionId": "1",
  "status": "SUCCESS",
  "message": "Payment confirmed successfully"
}
```

## Frontend Integration (JavaScript)

### Using Stripe.js

```html
<script src="https://js.stripe.com/v3/"></script>

<script>
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Create payment intent
async function createPaymentIntent(orderId, amount) {
  const response = await fetch('/api/payments/stripe/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: orderId,
      amount: amount,
      currency: 'USD',
      customerEmail: 'customer@example.com'
    })
  });
  return await response.json();
}

// Confirm payment
async function confirmPayment(paymentIntentId, orderId) {
  const {token} = await stripe.createToken(cardElement);
  
  if (token) {
    const response = await fetch('/api/payments/stripe/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `paymentIntentId=${paymentIntentId}&token=${token.id}&orderId=${orderId}`
    });
    return await response.json();
  }
}
</script>
```

## Rest Endpoints

### 1. Create Payment Intent
- **URL:** `/api/payments/stripe/create-intent`
- **Method:** `POST`
- **Auth:** Required
- **Body:** StripePaymentRequest

### 2. Confirm Payment
- **URL:** `/api/payments/stripe/confirm`
- **Method:** `POST`
- **Auth:** Required
- **Params:** `paymentIntentId`, `token`, `orderId`

### 3. Get Payment Details
- **URL:** `/api/payments/{id}`
- **Method:** `GET`
- **Auth:** Required

### 4. Get Payment by Order
- **URL:** `/api/payments/order/{orderId}`
- **Method:** `GET`
- **Auth:** Required

### 5. Get Payment by Transaction ID
- **URL:** `/api/payments/transaction/{transactionId}`
- **Method:** `GET`
- **Auth:** Required

### 6. Update Payment Status
- **URL:** `/api/payments/{id}/status`
- **Method:** `PUT`
- **Auth:** Required
- **Params:** `status`

## Testing

### Stripe Test Cards

Use these test card numbers in development:

| Card | Number | Expiry | CVC |
|------|--------|--------|-----|
| Visa | 4242 4242 4242 4242 | 12/25 | 123 |
| Mastercard | 5555 5555 5555 4444 | 12/25 | 123 |
| Amex | 3782 822463 10005 | 12/25 | 1234 |

### Test Scenarios

- **Successful Payment:** Use `4242 4242 4242 4242`
- **Failed Payment:** Use `4000 0000 0000 0002`
- **3D Secure Required:** Use `4000 0025 0000 3155`

## Currency Support

Stripe supports 135+ currencies. Set the currency in your payment request:

```json
{
  "currency": "USD"  // or EUR, GBP, INR, etc.
}
```

## Security Best Practices

1. **Never log API keys** - Keep your secret key safe
2. **Use HTTPS** - Always use HTTPS in production
3. **Validate amounts** - Verify payment amounts on the backend
4. **Use idempotency keys** - Prevent duplicate charges
5. **Implement webhooks** - Listen for payment events
6. **Store customer tokens** - For recurring payments

## Production Checklist

- [ ] Switch to live API keys
- [ ] Set up webhook endpoints
- [ ] Enable 3D Secure for fraud prevention
- [ ] Configure SSL/TLS certificates
- [ ] Set up PCI compliance
- [ ] Test refund functionality
- [ ] Implement rate limiting
- [ ] Add payment event logging

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Java Library](https://stripe.com/docs/libraries/java)

## Troubleshooting

### Issue: "API key not found"
**Solution:** Ensure `stripe.api.key` is configured in `application.properties`

### Issue: "Invalid amount"
**Solution:** Amounts must be greater than 0

### Issue: "Token error"
**Solution:** Ensure the token is valid and not expired

### Issue: "Payment intent not found"
**Solution:** Verify the paymentIntentId is correct

## Support

For Stripe support, visit: [https://support.stripe.com](https://support.stripe.com)
