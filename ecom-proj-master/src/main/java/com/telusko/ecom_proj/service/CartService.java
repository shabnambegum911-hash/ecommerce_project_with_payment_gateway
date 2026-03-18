package com.telusko.ecom_proj.service;

import com.telusko.ecom_proj.exception.ResourceNotFoundException;
import com.telusko.ecom_proj.model.Cart;
import com.telusko.ecom_proj.model.CartItem;
import com.telusko.ecom_proj.model.Product;
import com.telusko.ecom_proj.repo.CartRepo;
import com.telusko.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;

@Service
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    public Cart getCart(int userId) {
        return cartRepo.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
    }

    public Cart addToCart(int userId, int productId, int quantity) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for product: " + productId);
        }

        Cart cart = cartRepo.findByUserId(userId).orElseGet(() -> createNewCart(userId));

        CartItem cartItem = new CartItem();
        cartItem.setProductId(productId);
        cartItem.setQuantity(quantity);
        cartItem.setPrice(product.getPrice());
        cartItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));

        cart.getItems().add(cartItem);
        updateCartTotal(cart);

        return cartRepo.save(cart);
    }

    public Cart removeFromCart(int userId, int productId) {
        Cart cart = getCart(userId);
        cart.getItems().removeIf(item -> item.getProductId() == productId);
        updateCartTotal(cart);
        return cartRepo.save(cart);
    }

    public Cart updateCartItem(int userId, int productId, int quantity) {
        Cart cart = getCart(userId);
        cart.getItems().stream()
                .filter(item -> item.getProductId() == productId)
                .forEach(item -> {
                    item.setQuantity(quantity);
                    item.setTotalPrice(item.getPrice().multiply(BigDecimal.valueOf(quantity)));
                });
        updateCartTotal(cart);
        return cartRepo.save(cart);
    }

    public Cart clearCart(int userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear();
        cart.setTotalPrice(BigDecimal.ZERO);
        return cartRepo.save(cart);
    }

    private Cart createNewCart(int userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setItems(new ArrayList<>());
        cart.setTotalPrice(BigDecimal.ZERO);
        cart.setCreatedDate(new Date());
        cart.setUpdatedDate(new Date());
        return cart;
    }

    private void updateCartTotal(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalPrice(total);
        cart.setUpdatedDate(new Date());
    }

}
