package com.example.productReview;


import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Product addProduct(Product product) {
        return repository.save(product);
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public Product getProduct(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Product updateProduct(Long id, Product product) {

        Product existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setCategory(product.getCategory());
        existing.setPrice(product.getPrice());

        return repository.save(existing);
    }

    public String deleteProduct(Long id) {

        if (!repository.existsById(id)) {
            return "Product not found";
        }

        repository.deleteById(id);
        return "Product deleted successfully";
    }
}