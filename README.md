## Environment Variables

Create a `.env.development` file in the project root with the following structure:

```env
PORT=5000
NODE_ENV=development

DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=foodapp
DB_HOST=127.0.0.1
DB_DIALECT=mysql

JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
```

Adjust values as needed for your local setup. Use strong secrets in production.

# Express Backend Food App

## Overview

Node.js Express backend for a food ordering application, using Sequelize ORM and a modular architecture.

## Features

-   User authentication (JWT)
-   Food catalog CRUD
-   Orders and order items
-   Favorites (user favorite foods)
-   Category management
-   OpenAPI (Swagger) docs
-   Jest-based testing

## Project Structure

-   `src/modules/` — Business logic, organized by domain (auth, user, food, order, cart, category)
-   `src/database/` — Sequelize models, migrations, seeders
-   `src/middlewares/` — Auth/JWT and error handling
-   `src/utils/` — Logging, error handling, Swagger setup
-   `src/docs/` — OpenAPI YAMLs and schemas
-   `tests/` — Jest tests, mirrors module structure

## Developer Workflows

-   **Start Dev Server:**
    ```bash
    npm run dev
    ```
-   **Run Tests:**
    ```bash
    npm test
    ```
-   **Lint:**
    ```bash
    npm run lint
    ```
-   **DB Migrate:**
    ```bash
    npx sequelize-cli db:migrate
    ```
-   **DB Seed:**
    ```bash
    npx sequelize-cli db:seed:all
    ```

## API Endpoints

-   All routes are prefixed with `/api/`
-   Auth: `/api/auth/`
-   User: `/api/user/`
-   Food: `/api/food/`
-   Order: `/api/order/`
-   Category: `/api/category/`

## Patterns & Conventions

-   Each module: controller, service, repo, validator
-   Centralized error handling (`src/utils/error-handler.ts`)
-   Logging to `src/logs/` by date
-   Input validation with Joi (see `*.validator.ts`)
-   Shared interfaces in `src/interfaces/`
-   All routes registered in `src/routes/routes.ts`
-   Swagger docs in `src/docs/`

## Example: Add a New Resource

1. Create a folder in `src/modules/` (e.g., `review/`) with controller, service, repo, validator
2. Add model/migration in `src/database/models/` and `src/database/migrations/`
3. Register routes in `src/routes/routes.ts`
4. Add OpenAPI YAML in `src/docs/`
5. Add tests in `tests/modules/`

## Special Notes

-   Do not edit files in `logs/` directly
-   All business logic must go through services, not controllers
-   Keep validators and error handling consistent with existing modules

---

For questions or unclear patterns, check similar modules or ask for clarification.
