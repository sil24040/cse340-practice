import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import router from './src/controllers/routes.js';
import { setupDatabase, testConnection } from './src/models/setup.js';
import db, { caCert, NODE_ENV } from './src/models/db.js';
import startSessionCleanup from './src/utils/session-cleanup.js';
import { addLocalVariables } from './src/middleware/global.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Session store
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      conObject: {
        connectionString: process.env.DB_URL,
        ssl: {
          ca: caCert,
          rejectUnauthorized: true,
          checkServerIdentity: () => undefined
        }
      },
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV.includes('dev') !== true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Views + static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Parse POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Global middleware
app.use(addLocalVariables);

// Routes
app.use('/', router);

// Catch-all 404
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent || res.finished) return next(err);

  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
    stack: NODE_ENV === 'production' ? null : err.stack,
    NODE_ENV
  };

  try {
    res.status(status).render(`errors/${template}`, context);
  } catch {
    if (!res.headersSent) {
      res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
    }
  }
});

// Start server + DB + session cleanup
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await setupDatabase();
  await testConnection();
  startSessionCleanup();
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
