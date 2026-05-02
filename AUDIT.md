# Backend & Frontend API Audit

## 1. API Endpoints Called by Frontend
According to `frontend/src/services/api.js`, the frontend calls the following standalone scripts directly:
- `GET /get_portfolio.php`
- `GET /get_inventory.php`
- `GET /get_history.php` (with `params`)
- `GET /get_profile.php`
- `GET /get_assets.php` (with `params: { type }`)
- `POST /add_transaction.php` (with `data`)

## 2. Backend Routes vs. Frontend Targets
The backend router in `backend/public/index.php` maps completely different endpoints to the MVC controllers in `backend/controllers/`:
- `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` -> `AuthController`
- `/api/portfolio`, `/api/transactions` -> `PortfolioController`
- `/api/market/prices` -> `MarketDataController`

**Actual Files Hit:** The frontend **does not use** any of the routes in `public/index.php`. Instead, it hits the files inside `backend/api/` (`get_portfolio.php`, `get_inventory.php`, etc.).

## 3. Inconsistencies

### Dead Code
- **Controllers & Router**: Since the frontend hits `backend/api/*.php` directly, the entire `backend/controllers/` directory and `backend/public/index.php` router act as dead code.

### Hardcoded User IDs
- **No Actual Auth**: All endpoints in `backend/api/` contain a hardcoded `$userId = 1; // single-user mode`. They do not check or parse tokens.

### Missing Auth Wiring
- **Middleware Ignored**: `backend/middleware/JWT.php` is never imported or utilized in any of the standalone `backend/api/` scripts.
- **Frontend Lacks Auth**: The `frontend/src/services/api.js` explicitly defines `withCredentials: false` and sends no `Authorization` headers.

### CORS/Cookie Issues
- **Mismatched Configurations**: The `backend/api/config.php` defines `Access-Control-Allow-Credentials: true`, but the frontend doesn't send any (`withCredentials: false`). This means no cookies (like JWT) would be passed even if they were set.
- **Strict Origins**: The backend hardcodes `Access-Control-Allow-Origin: http://localhost:5173`, which breaks if the frontend runs on a different port.
