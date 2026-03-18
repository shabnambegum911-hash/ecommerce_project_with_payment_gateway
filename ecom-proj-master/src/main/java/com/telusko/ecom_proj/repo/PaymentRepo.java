package com.telusko.ecom_proj.repo;

import com.telusko.ecom_proj.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByOrderId(int orderId);

    Optional<Payment> findByTransactionId(String transactionId);

}