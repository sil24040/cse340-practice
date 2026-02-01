// src/middleware/demo/headers.js

const addDemoHeaders = (req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader(
      'X-Middleware-Demo',
      'Route-specific middleware active'
    );
    next();
  };
  
  export { addDemoHeaders };
  