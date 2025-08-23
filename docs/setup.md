# ⚡ Setup Guide

Follow these steps to get the project running locally:

---

### 1. Clone the repository

```bash
git clone https://github.com/Irtiza751/sparkend.git my-app
cd my-app/
```

---

### 2. Configure environment variables

Copy the example environment file and update values as needed:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_USER=<your-username>
DB_PASSWORD=<your-password>
DB_NAME=<database-name>
```

---

### 3. Install dependencies

```bash
yarn install
```

---

### 4. Run database migrations

Apply migrations to set up your database schema:

```bash
yarn migration:up
```

🔹 For faster iteration during development, you can also use:

```bash
yarn schema:update
```

> ⚠️ `schema:update` is great for development, but **never use it in production**. Always rely on migrations for production deployments.

---

### 5. Seed the database (optional)

Populate your database with initial data:

```bash
yarn seeder:run
```

---

### 6. Start the application

Run the project in development mode:

```bash
yarn start:dev
```

---

✅ That’s it! The app should now be running locally.
