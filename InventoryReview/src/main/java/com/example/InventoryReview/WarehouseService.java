package com.example.InventoryReview;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseService {

    private final WarehouseRepository repository;

    public WarehouseService(WarehouseRepository repository) {
        this.repository = repository;
    }

    public Warehouse addWarehouse(Warehouse warehouse) {
        return repository.save(warehouse);
    }

    public List<Warehouse> getAllWarehouses() {
        return repository.findAll();
    }

    public Warehouse getWarehouse(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Warehouse updateWarehouse(Long id, Warehouse warehouse) {

        Warehouse existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setWarehouseName(warehouse.getWarehouseName());
        existing.setLocation(warehouse.getLocation());
        existing.setManager(warehouse.getManager());
        existing.setContact(warehouse.getContact());
        existing.setStatus(warehouse.getStatus());

        return repository.save(existing);
    }

    public String deleteWarehouse(Long id) {

        if (!repository.existsById(id)) {
            return "Warehouse not found";
        }

        repository.deleteById(id);

        return "Warehouse deleted successfully";
    }
}