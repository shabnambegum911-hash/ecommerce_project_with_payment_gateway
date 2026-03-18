package com.telusko.ecom_proj.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StripePaymentRequest {

    private int orderId;

    private BigDecimal amount; // Amount in dollars/rupees

    private String currency; // e.g., USD, INR

    private String token; // Stripe token from frontend

    private String description;

    private String customerEmail;

    private String paymentMethod; // CARD, UPI, etc.

}