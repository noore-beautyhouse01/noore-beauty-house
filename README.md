# NOORÉ Beauty House — Full Stack

This package adds a real appointment backend and private admin dashboard to the existing NOORÉ static website.

## Structure

- `frontend/` — your GitHub Pages website, with the booking modal connected to the API.
- `backend/` — Express + MongoDB API, admin authentication, validation, rate limiting.
- `admin/` — private admin dashboard.

## Backend features

- Public `POST /api/bookings`
- Admin `POST /api/auth/login`
- Protected booking list, status updates and delete
- MongoDB persistence
- JWT admin sessions
- bcrypt password hashing
- Helmet + CORS + rate limiting
- Duplicate active-slot protection

## Local setup

Requirements: Node.js 20+ and a MongoDB database (MongoDB Atlas is easiest).

1. Open `backend/`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Fill in:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `FRONTEND_URL`
5. Run `npm start`.
6. Test `http://localhost:5000/api/health`.

For local frontend testing, serve `frontend/` with a simple static server. Do not open the HTML directly with `file://` if your browser blocks requests.

## Connect the live GitHub Pages site

After deploying the backend, edit:

`frontend/config.js`

and change:

`API_BASE_URL`

to your live API URL, ending in `/api`.

Example:

`https://your-noore-backend.onrender.com/api`

Then upload the updated `frontend/config.js`, `frontend/index.html`, `frontend/script.js`, and `frontend/style.css` to the GitHub Pages repository.

## Admin dashboard

Edit `admin/admin-config.js` so `API_BASE_URL` points to the same backend.

Publish the `admin/` folder on a separate static site, or keep it locally while testing.

## Production notes

- Never commit `.env`.
- Change the initial admin password before real use.
- Use HTTPS for the backend.
- Restrict `FRONTEND_URL` to your actual GitHub Pages/admin origins.
- For real salon use, add a business notification channel (email/WhatsApp/SMS) after the core system is tested.
