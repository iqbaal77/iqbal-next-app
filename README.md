# Iqbal's Shop

This is a lightweight Next.js 16 app scaffold with product CRUD and basic auth (JWT stored in cookie).

Install:

```bash
cd new-next-app
yarn install
yarn dev
```

Server runs on port 3002 (configured in package.json). Visit /shop, /login, /register, /dashboard.

Notes:
- This scaffold uses `sqlite` and creates `data.sqlite` in the project root on first run.
- For production, set a secure `JWT_SECRET` env var.
