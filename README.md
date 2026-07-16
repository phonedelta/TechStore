# TechStore — Full-Stack E-Commerce

Modern electronics e-commerce app with a **React (Vite) + Tailwind** storefront and a **Laravel Sanctum REST API**.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Axios, Context API |
| Backend | Laravel 13, Sanctum (token auth) |
| Database | SQLite (default) or MySQL |

## Quick Start

### 1. Backend

```bash
cd backend
# PHP 8.2+ and Composer required
composer install
cp .env.example .env   # if needed
php artisan key:generate

# Default uses SQLite (database/database.sqlite already created)
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

API: `http://127.0.0.1:8000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Store: `http://localhost:5173`

### Admin Login

- **URL:** http://localhost:5173/admin/login  
- **Email:** `admin@techstore.com`  
- **Password:** `password`

## MySQL (optional)

In `backend/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=techstore
DB_USERNAME=root
DB_PASSWORD=
```

Then:

```bash
php artisan migrate:fresh --seed
```

## Features

### Public store
- Home (hero, featured products, categories, promo, testimonials, newsletter)
- About, Shop (search / filter / sort / pagination), Product detail
- Cart & checkout (Cash on Delivery)
- Contact form (saved to DB)
- Order success page with unique order ID

### Admin dashboard
- Stats + sales chart
- Product CRUD (images, stock, prices, enable/disable)
- Category CRUD
- Order management (status workflow)
- Contact message inbox

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/login` | Public |
| POST | `/api/logout` | Admin |
| GET | `/api/products` | Public |
| GET | `/api/products/{id}` | Public |
| GET | `/api/categories` | Public |
| POST | `/api/orders` | Public |
| POST | `/api/contact` | Public |
| GET | `/api/admin/*` | Admin token |

## Project Structure

```
├── backend/          Laravel API
│   ├── app/Http/Controllers/Api/
│   ├── app/Models/
│   ├── database/migrations/
│   └── database/seeders/
└── frontend/         React storefront + admin
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── api/
```

## Notes

- 40+ seeded electronic products across 13 categories
- Free shipping over $100; otherwise $9.99
- Cart state persists in `localStorage`
- Stripe payment is stubbed as “Coming Soon” (COD is fully functional)
