package com.example.InventoryReview;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository repository;

    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }

    // Add inventory
    public Inventory addInventory(Inventory inventory) {
        return repository.save(inventory);
    }

    // Get all inventory
    public List<Inventory> getAllInventory() {
        return repository.findAll();
    }

    // Get inventory by ID
    public Inventory getInventory(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Get inventory by product
    public List<Inventory> getByProductId(Long productId) {
        return repository.findByProductId(productId);
    }

    // Get inventory by warehouse
    public List<Inventory> getByWarehouse(String warehouseName) {
        return repository.findByWarehouseName(warehouseName);
    }

    // Update inventory
    public Inventory updateInventory(Long id, Inventory inventory) {

        Inventory existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setProductId(inventory.getProductId());
        existing.setWarehouseName(inventory.getWarehouseName());
        existing.setWarehouseLocation(inventory.getWarehouseLocation());
        existing.setQuantity(inventory.getQuantity());
        existing.setReorderLevel(inventory.getReorderLevel());

        return repository.save(existing);
    }

    // Reduce stock when order is placed
    public String reduceStock(Long id, int quantity) {

        Inventory inventory = repository.findById(id).orElse(null);

        if (inventory == null) {
            return "Inventory not found";
        }

        if (quantity <= 0) {
            return "Quantity must be greater than 0";
        }

        if (inventory.getQuantity() < quantity) {
            return "Insufficient stock";
        }

        int remainingStock = inventory.getQuantity() - quantity;

        inventory.setQuantity(remainingStock);

        repository.save(inventory);

        if (remainingStock <= inventory.getReorderLevel()) {
            return "Stock reduced successfully. LOW STOCK ALERT: " + remainingStock;
        }

        return "Stock reduced successfully. Remaining stock: " + remainingStock;
    }

    // Add stock / restock
    public String addStock(Long id, int quantity) {

        Inventory inventory = repository.findById(id).orElse(null);

        if (inventory == null) {
            return "Inventory not found";
        }

        if (quantity <= 0) {
            return "Quantity must be greater than 0";
        }

        inventory.setQuantity(inventory.getQuantity() + quantity);

        repository.save(inventory);

        return "Stock added successfully. Current stock: "
                + inventory.getQuantity();
    }

    // Delete inventory
    public String deleteInventory(Long id) {

        if (!repository.existsById(id)) {
            return "Inventory not found";
        }

        repository.deleteById(id);

        return "Inventory deleted successfully";
    }
}