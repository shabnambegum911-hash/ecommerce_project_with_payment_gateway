package com.telusko.ecom_proj.controller;

import com.telusko.ecom_proj.model.Cart;
import com.telusko.ecom_proj.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable int userId) {
        Cart cart = cartService.getCart(userId);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<Cart> addToCart(
            @PathVariable int userId,
            @RequestParam int productId,
            @RequestParam int quantity) {
        Cart cart = cartService.addToCart(userId, productId, quantity);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable int userId,
            @PathVariable int productId) {
        Cart cart = cartService.removeFromCart(userId, productId);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PutMapping("/{userId}/update/{productId}")
    public ResponseEntity<Cart> updateCartItem(
            @PathVariable int userId,
            @PathVariable int productId,
            @RequestParam int quantity) {
        Cart cart = cartService.updateCartItem(userId, productId, quantity);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Cart> clearCart(@PathVariable int userId) {
        Cart cart = cartService.clearCart(userId);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

}
