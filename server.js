import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const NODE_ENV =
  (process.env.NODE_ENV || 'development').toLowerCase();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(addLocalVariables);
app.use('/', routes);

// 404
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  res.status(status).render(`errors/${template}`, {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error:
      NODE_ENV === 'production'
        ? 'An error occurred'
        : err.message,
    stack:
      NODE_ENV === 'production' ? null : err.stack,
    NODE_ENV
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
