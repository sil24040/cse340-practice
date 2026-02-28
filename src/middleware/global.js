import { NODE_ENV } from '../models/db.js';

const setHeadAssetsFunctionality = (res) => {
  res.locals.styles = [];
  res.locals.scripts = [];

  res.addStyle = (css, priority = 0) => {
    res.locals.styles.push({ content: css, priority });
  };

  res.addScript = (js, priority = 0) => {
    res.locals.scripts.push({ content: js, priority });
  };

  res.locals.renderStyles = () => {
    return res.locals.styles
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.content)
      .join('\n');
  };

  res.locals.renderScripts = () => {
    return res.locals.scripts
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.content)
      .join('\n');
  };
};

export const addLocalVariables = (req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

  // Current year
  res.locals.currentYear = new Date().getFullYear();

  // Greeting
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  res.locals.greeting = `<p>${greeting}!</p>`;

  // Random theme
  const themes = ['blue-theme', 'green-theme', 'red-theme'];
  res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];

  // Logged-in user
  res.locals.user = req.session?.user || null;

  // Dynamic CSS/JS
  setHeadAssetsFunctionality(res);

  next();
};
