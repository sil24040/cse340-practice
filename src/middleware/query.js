export function queryMiddleware(req, res, next) {
    res.locals.query = req.query;
    next();
  }
  