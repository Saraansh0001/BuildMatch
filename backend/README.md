# FolioVault Backend

Flat PHP API for the FolioVault Investment Portfolio System.

## Prerequisites

- PHP 8.0+
- MySQL 8.0+ / MariaDB
- Apache or Nginx

## Setup

1. **Import Database Schema**
   - Import `db/schema.sql` into your MySQL server.
   - Example command: `mysql -u root -p < db/schema.sql`

2. **Configure Environment**
   - Copy `backend/config/.env.example` to `backend/.env`.
   - Update the variables:
     - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`: Your MySQL credentials.
     - `JWT_SECRET`: A secure random string for signing tokens.
     - `CORS_ORIGIN`: Set to `http://localhost:5173` for development.

3. **Web Server Configuration**
   - Point your web server's document root to the `backend/` directory.
   - Ensure the server has permission to read the files.
   - If using Apache, ensure `mod_rewrite` is enabled (though not strictly required for this flat structure).

## API Structure

- `api/*.php`: Direct endpoints (e.g., `get_portfolio.php`).
- `config/`: Database and environment configuration.
- `lib/`: Shared logic (JWT, validation).
- `middleware/`: Placeholder for future extensibility.

## Security

- All data endpoints require a valid JWT cookie set via `auth_login.php`.
- Passwords are hashed using `PASSWORD_BCRYPT`.
- Cookies are `HttpOnly` and `SameSite=Lax`.
