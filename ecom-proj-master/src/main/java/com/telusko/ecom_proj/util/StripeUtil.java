package com.telusko.ecom_proj.util;

import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Component
public class StripeUtil {

    /**
     * Create a Stripe charge for payment
     */
    public Charge createCharge(String token, BigDecimal amount, String currency, String description, String email)
            throws StripeException {

        // Convert amount to cents
        Long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", amountInCents); // Amount in smallest currency unit
        chargeParams.put("currency", currency.toLowerCase());
        chargeParams.put("source", token);
        chargeParams.put("description", description);
        chargeParams.put("receipt_email", email);

        return Charge.create(chargeParams);
    }

    /**
     * Create a Stripe PaymentIntent (recommended method)
     */
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency, String description, String email)
            throws StripeException {

        // Convert amount to cents
        Long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(currency.toLowerCase())
                .setDescription(description)
                .setReceiptEmail(email)
                .build();

        return PaymentIntent.create(params);
    }

    /**
     * Confirm a PaymentIntent with source token
     */
    public PaymentIntent confirmPaymentIntent(String paymentIntentId, String token) throws StripeException {
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);

        Map<String, Object> params = new HashMap<>();
        params.put("source", token);

        return intent.confirm(params);
    }

    /**
     * Retrieve PaymentIntent status
     */
    public PaymentIntent getPaymentIntent(String paymentIntentId) throws StripeException {
        return PaymentIntent.retrieve(paymentIntentId);
    }

    /**
     * Refund a charge
     */
    public Refund refundCharge(String chargeId) throws StripeException {
        RefundCreateParams params = RefundCreateParams.builder()
                .setCharge(chargeId)
                .build();
        return Refund.create(params);
    }

}