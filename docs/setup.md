# Setup Guide

1. Clone repository
   ```bash
   git clone https://github.com/Irtiza751/sparkend.git my-app
   ```
2. Go into the folder, and copy `.env.example` in `.env` file.
   ```bash
   cd my-app/
   cp .env.example .env
   ```
3. Update enviroment file eg
   ```env
   DB_USER=<your-username>
   DB_PASSWORD=<your-password>
   DB_NAME=<database-name>
   ```
4. Install dependency
   ```bash
   cd my-app/
   cp .env.example .env
   ```
5. Run migrations
   ```bash
   yarn migration:up
   ```
6. Run seeder
   ```bash
   yarn seeder:run
   ```
7. Run locally
   ```bash
   yarn start:dev
   ```
