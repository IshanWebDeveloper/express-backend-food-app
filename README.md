# Express Backend Food App

Node.js + Express backend for a food ordering application, using Sequelize ORM with MySQL and a modular architecture. OpenAPI docs are served at /api-docs.

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

Optional (development helpers):

-   DB_SYNC=true to enable sequelize.sync in non-dev environments
-   DB_SYNC_ALTER=true to allow non-destructive schema syncs
-   DB_SYNC_FORCE=true to drop/recreate tables (destructive; for local only)

## Overview

## Features

-   User authentication (JWT)
-   Dish catalog CRUD
-   Orders and order items
-   Category management
-   Reporting endpoints
-   OpenAPI (Swagger) docs
-   Jest-based testing

## Project Structure

-   `src/modules/` — Business logic, organized by domain (auth, user, category, dish, order, reporting)
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
    npm run migration
    # or
    npx sequelize-cli db:migrate
    ```

-   **DB Seed:**

    ```bash
    npm run seed:all
    # or
    npx sequelize-cli db:seed --seed src/database/seeders/seed.js
    ```

Other useful scripts:

-   Generate a migration: `npm run migration:generate -- <name>`
-   Generate a seeder: `npm run seed:generate -- <name>`
-   Create/Drop DB (local): `npm run createdb` / `npm run dropdb`

## API Endpoints

-   All routes are prefixed with `/api/v1`
-   Auth: `/api/v1/auth/*`
-   User: `/api/v1/user/*` (protected)
-   Categories: `/api/v1/categories/*` (protected)
-   Dishes: `/api/v1/dishes/*` (protected)
-   Orders: `/api/v1/orders/*` (protected)
-   Reports: `/api/v1/reports/*` (protected)

API documentation (Swagger UI) is available at: `/api-docs`.

Protected endpoints require an Authorization header:
`Authorization: Bearer <access_token>`

## Patterns & Conventions

-   Each module: controller, service, repo, validator
-   Centralized error handling (`src/utils/error-handler.ts`)
-   Logging to `logs/` by date
-   Input validation with Joi (see `*.validator.ts`)
-   Shared interfaces in `src/interfaces/`
-   All routes registered in `src/routes/routes.ts` (mounted at `/api/v1`)
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
