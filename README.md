# Warehouse Management System

## Overview
Warehouse Management System is a full-stack application developed using a microservices architecture to manage warehouse operations efficiently. It includes authentication, product management, inventory tracking, order processing, and API Gateway integration.

## Tech Stack
- **Frontend:** React, JavaScript, CSS, HTML
- **Backend:** Java, Spring Boot
- **Architecture:** Microservices
- **Service Discovery:** Netflix Eureka
- **API Gateway:** Spring Cloud Gateway

## Project Structure
- `AuthReview` – Authentication and user management
- `InventoryReview` – Inventory management
- `eurekaproject` – Service discovery using Eureka
- `frontend` – React-based user interface
- `gatewayReview` – API Gateway for routing client requests to microservices
- `orderReview` – Order management
- `productReview` – Product management

## Features
- User authentication and authorization
- Product management
- Inventory tracking
- Order management
- API Gateway for centralized request routing
- Eureka service discovery
- Microservices-based architecture
- Frontend integration with backend services

## API Gateway
The API Gateway acts as a single entry point for client requests and routes them to the appropriate backend microservices.

### Responsibilities
- Routes requests to Authentication, Product, Inventory, and Order services.
- Provides centralized request handling.
- Integrates with Eureka for service discovery.
- Simplifies frontend-to-backend communication.
- Avoids direct communication between frontend and individual microservices.

## Architecture
The application follows a microservices architecture where each service handles a specific business functionality. The API Gateway manages incoming requests, while Eureka Server enables service discovery and communication between services.

## Getting Started
1. Clone the repository.
2. Configure application properties for each microservice.
3. Start the Eureka Server.
4. Start the API Gateway.
5. Run the backend microservices.
6. Start the frontend application.
7. Access the application through the frontend.

## Repository
GitHub: https://github.com/2400031805/warehouse

## Author
2400031805
