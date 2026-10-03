package com.example.orderReview;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final InventoryClient inventoryClient;

    public OrderService(OrderRepository repository,
                        InventoryClient inventoryClient) {
        this.repository = repository;
        this.inventoryClient = inventoryClient;
    }

    // Create Order
    public Order createOrder(Order order) {

        // Reduce inventory stock
        inventoryClient.reduceStock(
                order.getWarehouseId(),
                1
        );

        // Set order details automatically
        order.setOrderStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());

        // Save order in database
        return repository.save(order);
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    // Get order by ID
    public Order getOrder(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update order
    public Order updateOrder(Long id, Order order) {

        Order existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setCustomerId(order.getCustomerId());
        existing.setWarehouseId(order.getWarehouseId());
        existing.setOrderStatus(order.getOrderStatus());
        existing.setTotalAmount(order.getTotalAmount());

        // Keep the original order date
        return repository.save(existing);
    }

    // Delete order
    public String deleteOrder(Long id) {

        if (!repository.existsById(id)) {
            return "Order not found";
        }

        repository.deleteById(id);

        return "Order deleted successfully";
    }
}