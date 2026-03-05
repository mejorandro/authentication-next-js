# Next.js Authentication (Lucia + SQLite)

A small **Next.js App Router** demo project that implements **email/password authentication** with **Lucia** and a **SQLite** database (via `better-sqlite3`).

It covers the typical auth flow you practiced in the course: **signup**, **login**, **session cookie**, **route protection**, **logout**, and **switching auth modes with query params**.

---

## Tech Stack

- **Next.js 14 (App Router)**  
- **React 18**
- **Lucia** + `@lucia-auth/adapter-sqlite`
- **SQLite** (`better-sqlite3`)
- **Node crypto** (password hashing with `scrypt` + salt)

---

## Features

- ✅ Signup (server action) with basic validation
- ✅ Login (server action) with password verification
- ✅ Sessions stored in SQLite (`sessions` table)
- ✅ Session cookie managed via `next/headers` (`cookies()`)
- ✅ Protected route: `/training` redirects to `/` if not authenticated
- ✅ Logout invalidates session and clears cookie
- ✅ Toggle auth mode via query params:
  - `/` → login
  - `/?mode=signup` → signup
  - `/?mode=login` → login

---

## Project Structure

```
app/
  page.js                    # Renders the auth form (mode via searchParams)
  layout.js                  # Root layout
  (auth)/
    layout.js                # Layout for authenticated area (includes logout button)
    training/page.js         # Protected page (requires valid session)
actions/
  auth-actions.js            # Server Actions: signup/login/logout
components/
  auth-form.js               # Client component with useFormState()
lib/
  auth.js                    # Lucia instance + cookie/session helpers
  db.js                      # SQLite init + schema + seed data
  hash.js                    # scrypt password hashing + verification
  users.js                   # user queries
  training.js                # read trainings from db
public/
  trainings/                 # training images referenced by training data
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the dev server

```bash
npm run dev
```

Open:

- `http://localhost:3000` (login by default)
- `http://localhost:3000/?mode=signup` (signup mode)

---

## How Auth Works (Quick Tour)

### Signup
- Validates input in `actions/auth-actions.js`
- Hashes password with **salted scrypt** (`lib/hash.js`)
- Inserts user into SQLite (`lib/users.js`)
- Creates a Lucia session + sets the session cookie (`lib/auth.js`)
- Redirects to `/training`

### Login
- Finds user by email (`lib/users.js`)
- Verifies password (`lib/hash.js`)
- Creates session + sets cookie (`lib/auth.js`)
- Redirects to `/training`

### Route Protection
`app/(auth)/training/page.js` calls `verifyAuth()`:
- If no valid session → `redirect('/')`
- If valid session → shows training sessions from DB

### Logout
- Invalidates session in Lucia
- Clears cookie using `createBlankSessionCookie()`

---

## Database

The SQLite file is created locally as:

- `training.db`

Tables created on startup in `lib/db.js`:

- `users` (id, email, password)
- `sessions` (id, expires_at, user_id)
- `trainings` (seeded demo data)

---

## Notes / Improvements (Optional Ideas)

If you want to evolve this into a more production-ready setup:

- Add stricter validation (zod) and better error messages
- Add CSRF protection considerations for forms
- Add rate-limiting for login attempts
- Move DB schema to migrations (e.g., Prisma/Drizzle) instead of `db.exec()`
- Use secure cookie flags + domain settings behind HTTPS

---

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production server
npm run lint     # lint
```

---

## License

Educational/demo project for practicing authentication flows.
