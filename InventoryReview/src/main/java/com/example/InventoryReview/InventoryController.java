package com.example.InventoryReview;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    // Add inventory
    @PostMapping
    public Inventory addInventory(@RequestBody Inventory inventory) {
        return service.addInventory(inventory);
    }

    // Get all inventory
    @GetMapping
    public List<Inventory> getAllInventory() {
        return service.getAllInventory();
    }

    // Get inventory by ID
    @GetMapping("/{id}")
    public Inventory getInventory(@PathVariable Long id) {
        return service.getInventory(id);
    }

    // Get inventory by product
    @GetMapping("/product/{productId}")
    public List<Inventory> getByProductId(
            @PathVariable Long productId) {

        return service.getByProductId(productId);
    }

    // Get inventory by warehouse
    @GetMapping("/warehouse/{warehouseName}")
    public List<Inventory> getByWarehouse(
            @PathVariable String warehouseName) {

        return service.getByWarehouse(warehouseName);
    }

    // Update inventory
    @PutMapping("/{id}")
    public Inventory updateInventory(
            @PathVariable Long id,
            @RequestBody Inventory inventory) {

        return service.updateInventory(id, inventory);
    }

    // Reduce stock
    @PutMapping("/{id}/reduce/{quantity}")
    public String reduceStock(
            @PathVariable Long id,
            @PathVariable int quantity) {

        return service.reduceStock(id, quantity);
    }

    // Add stock
    @PutMapping("/{id}/add/{quantity}")
    public String addStock(
            @PathVariable Long id,
            @PathVariable int quantity) {

        return service.addStock(id, quantity);
    }

    // Delete inventory
    @DeleteMapping("/{id}")
    public String deleteInventory(@PathVariable Long id) {
        return service.deleteInventory(id);
    }
}