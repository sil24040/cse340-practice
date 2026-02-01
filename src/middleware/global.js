// src/middleware/global.js

const addLocalVariables = (req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    res.locals.NODE_ENV =
      process.env.NODE_ENV?.toLowerCase() || 'development';
    res.locals.queryParams = req.query || {};
  
    const hour = new Date().getHours();
    let greeting = 'Good Evening!';
    if (hour < 12) greeting = 'Good Morning!';
    else if (hour < 18) greeting = 'Good Afternoon!';
  
    res.locals.greeting = `<p>${greeting}</p>`;
  
    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    res.locals.bodyClass =
      themes[Math.floor(Math.random() * themes.length)];
  
    next();
  };
  
  export { addLocalVariables };
  