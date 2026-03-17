package com.telusko.ecom_proj.repo;

import com.telusko.ecom_proj.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {

    List<Order> findByUserId(int userId);

}