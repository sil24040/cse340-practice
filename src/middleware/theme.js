export function themeMiddleware(req, res, next) {
    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];
    next();
  }
  