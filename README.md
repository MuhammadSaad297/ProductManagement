# Product Management Full-Stack Starter

A production-style starter application that demonstrates:

- **.NET 8 Web API** backend
- **ADO.NET with SQL Server stored procedures** for data access
- **Angular 19 standalone** frontend
- Clean architecture style layering
- Centralized exception handling
- Typed API contracts and validation
- A scalable folder structure for future modules

## Solution Structure

```text
fullstack-adonet-angular/
|-- backend/
|   |-- ProductManagement.sln
|   |-- database/
|   |   `-- ProductManagementDb.sql
|   `-- src/
|       |-- ProductManagement.Domain/
|       |-- ProductManagement.Application/
|       |-- ProductManagement.Infrastructure/
|       `-- ProductManagement.Api/
|-- frontend/
|   |-- angular.json
|   |-- package.json
|   `-- src/
`-- README.md
```

## Backend Architecture

### Domain
Contains core entities with no infrastructure dependencies.

### Application
Contains DTOs, service interfaces, business rules, and custom exceptions.

### Infrastructure
Contains all ADO.NET and SQL Server specific code.

### API
Contains controllers, middleware, configuration, Swagger, and CORS.

## Why this design is maintainable

- Controllers remain thin and delegate work to services.
- Business validation lives in the application layer.
- SQL access is isolated in repository classes.
- Stored procedures centralize database write and fetch logic.
- Middleware standardizes API error responses.
- Angular consumes typed endpoints through one service layer.

## Stored Procedures Included

- `dbo.usp_Products_GetAll`
- `dbo.usp_Products_GetById`
- `dbo.usp_Products_Create`
- `dbo.usp_Products_Update`

## API Endpoints

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`

## Backend Setup

1. Create the database and stored procedures by running:
   - `backend/database/ProductManagementDb.sql`
2. Update the connection string in:
   - `backend/src/ProductManagement.Api/appsettings.json`
3. Restore and run:

```bash
cd backend/src/ProductManagement.Api
dotnet restore
dotnet run
```

Swagger will open in development mode.

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Confirm the API base URL in:
   - `src/environments/environment.ts`

3. Start Angular:

```bash
npm start
```

The app expects the API at `https://localhost:7044/api`.

## Error Handling Strategy

### Backend
- Global middleware catches validation, not found, SQL, and unexpected exceptions.
- Responses return a consistent payload with:
  - `statusCode`
  - `message`
  - `errors`
  - `traceId`

### Frontend
- Shared interceptor normalizes API failures.
- Components show user-friendly error messages instead of raw server exceptions.

## Scalability Notes

This starter is ready to evolve into a larger system:

- Add more modules by repeating the same vertical pattern.
- Swap repositories for Dapper or EF Core later without changing controllers.
- Add authentication using JWT or OpenID Connect.
- Add caching for expensive reads.
- Introduce pagination, filtering, and sorting on the list endpoint.
- Add FluentValidation or pipeline behaviors if the application grows.
- Containerize the API and frontend for CI/CD.

## Recommended Next Improvements

- Add unit tests for `ProductService`
- Add integration tests for stored procedure execution
- Add health checks and structured logging
- Move CORS origins and API base URLs to environment-specific configuration
- Add optimistic concurrency or row-versioning for update safety
- Add database transaction support for multi-table workflows

## Notes

This is intentionally a **robust starter** rather than a fully production-hardened enterprise system. It provides the right separation of concerns and extension points so you can scale it into a real application cleanly.
