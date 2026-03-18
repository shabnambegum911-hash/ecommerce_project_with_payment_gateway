package com.telusko.ecom_proj.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StripePaymentResponse {

    private String transactionId;

    private String status;

    private String message;

    private String clientSecret; // For frontend integration

    private String paymentIntentId;

}