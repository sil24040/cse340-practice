export function headersMiddleware(req, res, next) {
    res.locals.headers = req.headers;
    next();
  }
  