# SupplyStock AI — Spring Boot Core Backend

## Overview
Enterprise Java Spring Boot 3 microservice powering inventory transactions, automated purchase replenishment, supplier intelligence, and REST endpoints for SupplyStock AI.

## Architecture
- **Layered Structure**: Controller -> Service -> Repository -> JPA Entity -> DTO.
- **Security**: Spring Security 6, BCrypt password hashing, stateless JWT filter with RBAC role enforcement.
- **Transactions**: Atomic `@Transactional` operations ensuring inventory updates and sales order fulfillment are ACID compliant.
- **AI Microservice Client**: Synchronous HTTP client to the Python FastAPI ML and Google Gemini service with high-availability local fallback.

## Running the Backend

### Prerequisites
- Java 17 or higher
- Maven 3.8+ (or Maven Wrapper)
- MySQL 8.0+ running on port 3306 with database `supplystock_db` (or standalone in-memory H2 profile)

### Run with Standard MySQL Profile
```bash
cd backend
mvn spring-boot:run
```

### Run with Zero-Dependency H2 In-Memory Profile
For instant standalone evaluation without a running MySQL instance:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

Default application port: `http://localhost:8080`
API Base Path: `http://localhost:8080/api/v1`
H2 Console (when active): `http://localhost:8080/h2-console`
