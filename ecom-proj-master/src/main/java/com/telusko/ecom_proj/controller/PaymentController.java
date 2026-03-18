package com.telusko.ecom_proj.controller;

import com.stripe.exception.StripeException;
import com.telusko.ecom_proj.dto.StripePaymentRequest;
import com.telusko.ecom_proj.dto.StripePaymentResponse;
import com.telusko.ecom_proj.model.Payment;
import com.telusko.ecom_proj.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Create a Stripe PaymentIntent
     */
    @PostMapping("/stripe/create-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody StripePaymentRequest request) {
        try {
            StripePaymentResponse response = paymentService.processStripePayment(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Stripe error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Confirm a Stripe PaymentIntent with token
     */
    @PostMapping("/stripe/confirm")
    public ResponseEntity<?> confirmPayment(
            @RequestParam String paymentIntentId,
            @RequestParam String token,
            @RequestParam int orderId) {
        try {
            StripePaymentResponse response = paymentService.confirmPaymentIntent(paymentIntentId, token, orderId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Stripe error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable int id) {
        Payment payment = paymentService.getPaymentById(id);
        if (payment != null) {
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrder(@PathVariable int orderId) {
        Payment payment = paymentService.getPaymentByOrderId(orderId);
        if (payment != null) {
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getPaymentByTransaction(@PathVariable String transactionId) {
        Payment payment = paymentService.getPaymentByTransactionId(transactionId);
        if (payment != null) {
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Payment> updatePaymentStatus(
            @PathVariable int id,
            @RequestParam String status) {
        Payment payment = paymentService.updatePaymentStatus(id, status);
        if (payment != null) {
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}