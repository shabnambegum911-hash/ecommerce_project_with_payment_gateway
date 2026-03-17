package com.telusko.ecom_proj.service;

import com.telusko.ecom_proj.model.Order;
import com.telusko.ecom_proj.model.OrderItem;
import com.telusko.ecom_proj.model.Product;
import com.telusko.ecom_proj.repo.OrderRepo;
import com.telusko.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private ProductRepo productRepo;

    public Order createOrder(int userId, List<OrderItem> items) {
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : items) {
            Product product = productRepo.findById(item.getProductId()).orElse(null);
            if (product != null) {
                item.setProductName(product.getName());
                item.setPrice(product.getPrice());
                total = total.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setItems(items);
        order.setTotalAmount(total);
        order.setOrderDate(new Date());
        order.setStatus("PENDING");

        return orderRepo.save(order);
    }

    public List<Order> getOrdersByUser(int userId) {
        return orderRepo.findByUserId(userId);
    }

    public Order getOrderById(int id) {
        return orderRepo.findById(id).orElse(null);
    }

}