export function greetingMiddleware(req, res, next) {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
  
    res.locals.greeting = `<p>${greeting}!</p>`;
    next();
  }
  