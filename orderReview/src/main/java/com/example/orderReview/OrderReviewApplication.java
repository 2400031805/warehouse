package com.example.orderReview;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class OrderReviewApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderReviewApplication.class, args);
    }
}