package com.telusko.ecom_proj.repo;

import com.telusko.ecom_proj.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart, Integer> {

    Optional<Cart> findByUserId(int userId);

}
