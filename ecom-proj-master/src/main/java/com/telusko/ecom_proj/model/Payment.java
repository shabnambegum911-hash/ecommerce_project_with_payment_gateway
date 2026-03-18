package com.telusko.ecom_proj.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int orderId;

    private BigDecimal amount;

    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, NET_BANKING, UPI, PAYPAL

    private String paymentStatus; // PENDING, SUCCESS, FAILED, CANCELLED

    private String transactionId;

    private Date paymentDate;

    private String paymentGateway; // STRIPE, RAZORPAY, PAYPAL, etc.

    private String responseMessage;

}