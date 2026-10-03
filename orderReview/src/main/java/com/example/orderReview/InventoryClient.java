package com.example.orderReview;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "InventoryReview")
public interface InventoryClient {

    @PutMapping("/inventory/{id}/reduce/{quantity}")
    String reduceStock(
            @PathVariable Long id,
            @PathVariable int quantity
    );
}