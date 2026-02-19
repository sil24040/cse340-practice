import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';
import { setupDatabase, testConnection } from './src/models/setup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();

const app = express();

// Make NODE_ENV available in all EJS templates
app.locals.NODE_ENV = NODE_ENV;

// Static files (CSS/JS/images)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Body parsers MUST be before routes (for POST forms + JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Global middleware (locals + asset helpers)
app.use(addLocalVariables);

// Routes
app.use('/', routes);

// 404 handler
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  res.status(status).render(`errors/${template}`, {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
    stack: NODE_ENV === 'production' ? null : err.stack,
    NODE_ENV
  });
});

// Startup
app.listen(PORT, async () => {
  try {
    await setupDatabase();
    await testConnection();
    console.log(`Server running on http://127.0.0.1:${PORT}`);
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
});
