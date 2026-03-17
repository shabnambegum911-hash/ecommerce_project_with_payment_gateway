package com.telusko.ecom_proj.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId; // Reference to User

    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderItem> items;

    private BigDecimal totalAmount;

    private Date orderDate;

    private String status; // e.g., PENDING, CONFIRMED, SHIPPED, DELIVERED

}