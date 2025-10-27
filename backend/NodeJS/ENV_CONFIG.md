# Jobs Service Environment Configuration

Create a `.env` file in the `backend/NodeJS` directory with the following configuration:

```env
# Server Configuration
PORT=4001
NODE_ENV=development

# Database Configuration (SQLite for Development)
# The service will use SQLite if DB_HOST is not set
# DATABASE_URL=sqlite:./database_jobs.sqlite

# For PostgreSQL (Production):
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=database_jobs
# DB_USER=postgres
# DB_PASSWORD=postgres

# JWT Secret (Must match Auth Service)
JWT_SECRET=your-super-secure-jwt-secret-key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3002,http://localhost:8081,http://localhost:3000,http://localhost:3001

# Jobs Configuration
MAX_JOBS_PER_EMPLOYER=50
JOB_EXPIRY_DAYS=30
DEFAULT_CURRENCY=ETB
DEFAULT_LOCATIONS=Addis Ababa,Dire Dawa,Mekelle,Gondar,Awassa,Bahir Dar

# Pagination
DEFAULT_PAGE_LIMIT=10
MAX_PAGE_LIMIT=100
```

## Important Notes:

1. **JWT_SECRET** must match the one used in the Auth Service (`backend/nodejs_Hibr/.env`)
2. The default SQLite database will be created automatically at `./database_jobs.sqlite`
3. Port 4001 is reserved for the Jobs Service
4. CORS origins include all frontend applications

