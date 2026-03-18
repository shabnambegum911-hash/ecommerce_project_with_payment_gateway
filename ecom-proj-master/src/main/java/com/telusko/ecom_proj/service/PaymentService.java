package com.telusko.ecom_proj.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.telusko.ecom_proj.dto.StripePaymentRequest;
import com.telusko.ecom_proj.dto.StripePaymentResponse;
import com.telusko.ecom_proj.model.Payment;
import com.telusko.ecom_proj.repo.PaymentRepo;
import com.telusko.ecom_proj.util.StripeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private StripeUtil stripeUtil;

    /**
     * Process payment using Stripe
     */
    public StripePaymentResponse processStripePayment(StripePaymentRequest request) throws StripeException {
        StripePaymentResponse response = new StripePaymentResponse();

        try {
            // Validate payment amount
            if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                response.setStatus("FAILED");
                response.setMessage("Invalid payment amount");
                return response;
            }

            // Create a PaymentIntent (recommended approach)
            PaymentIntent paymentIntent = stripeUtil.createPaymentIntent(
                    request.getAmount(),
                    request.getCurrency() != null ? request.getCurrency() : "USD",
                    "Order #" + request.getOrderId(),
                    request.getCustomerEmail()
            );

            response.setPaymentIntentId(paymentIntent.getId());
            response.setClientSecret(paymentIntent.getClientSecret());
            response.setStatus("REQUIRES_PAYMENT_METHOD");
            response.setMessage("Payment intent created. Please provide payment method.");

            // If token is provided, confirm the payment immediately
            if (request.getToken() != null && !request.getToken().isEmpty()) {
                PaymentIntent confirmedIntent = stripeUtil.confirmPaymentIntent(paymentIntent.getId(), request.getToken());
                
                // Save payment record
                Payment payment = savePaymentRecord(request, confirmedIntent);
                
                if ("succeeded".equals(confirmedIntent.getStatus())) {
                    response.setTransactionId(payment.getId() + "");
                    response.setStatus("SUCCESS");
                    response.setMessage("Payment processed successfully");
                } else if ("processing".equals(confirmedIntent.getStatus())) {
                    response.setStatus("PROCESSING");
                    response.setMessage("Payment is being processed");
                } else {
                    response.setStatus("FAILED");
                    response.setMessage("Payment failed: " + confirmedIntent.getStatus());
                }
            }

            return response;

        } catch (StripeException e) {
            response.setStatus("FAILED");
            response.setMessage("Stripe error: " + e.getMessage());
            return response;
        }
    }

    /**
     * Confirm a Stripe PaymentIntent with token
     */
    public StripePaymentResponse confirmPaymentIntent(String paymentIntentId, String token, int orderId)
            throws StripeException {
        StripePaymentResponse response = new StripePaymentResponse();

        try {
            PaymentIntent paymentIntent = stripeUtil.confirmPaymentIntent(paymentIntentId, token);
            response.setPaymentIntentId(paymentIntent.getId());

            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Create a mock StripePaymentRequest to save payment
                StripePaymentRequest request = new StripePaymentRequest();
                request.setOrderId(orderId);
                request.setAmount(BigDecimal.valueOf(paymentIntent.getAmount() / 100.0));
                request.setCurrency(paymentIntent.getCurrency());

                Payment payment = savePaymentRecord(request, paymentIntent);
                response.setTransactionId(payment.getId() + "");
                response.setStatus("SUCCESS");
                response.setMessage("Payment confirmed successfully");
            } else {
                response.setStatus(paymentIntent.getStatus().toUpperCase());
                response.setMessage("Payment status: " + paymentIntent.getStatus());
            }

            return response;

        } catch (StripeException e) {
            response.setStatus("FAILED");
            response.setMessage("Error confirming payment: " + e.getMessage());
            return response;
        }
    }

    /**
     * Save payment record to database
     */
    private Payment savePaymentRecord(StripePaymentRequest request, PaymentIntent paymentIntent) {
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD");
        payment.setPaymentGateway("STRIPE");
        payment.setPaymentDate(new Date());
        payment.setTransactionId(paymentIntent.getId());
        
        String status = paymentIntent.getStatus();
        payment.setPaymentStatus(status.equalsIgnoreCase("succeeded") ? "SUCCESS" : status.toUpperCase());
        payment.setResponseMessage("Stripe payment: " + status);

        return paymentRepo.save(payment);
    }

    public Payment getPaymentById(int id) {
        return paymentRepo.findById(id).orElse(null);
    }

    public Payment getPaymentByOrderId(int orderId) {
        return paymentRepo.findByOrderId(orderId).orElse(null);
    }

    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepo.findByTransactionId(transactionId).orElse(null);
    }

    public Payment updatePaymentStatus(int paymentId, String newStatus) {
        Payment payment = paymentRepo.findById(paymentId).orElse(null);
        if (payment != null) {
            payment.setPaymentStatus(newStatus);
            return paymentRepo.save(payment);
        }
        return null;
    }

}