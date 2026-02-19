// src/middleware/global.js

/**
 * Adds head asset management functionality:
 * - res.addStyle(css, priority)
 * - res.addScript(js, priority)
 * - res.locals.renderStyles()
 * - res.locals.renderScripts()
 */
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
      .join("\n");
  };

  res.locals.renderScripts = () => {
    return res.locals.scripts
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.content)
      .join("\n");
  };
};

const addLocalVariables = (req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.NODE_ENV = (process.env.NODE_ENV || "development").toLowerCase();
  res.locals.queryParams = req.query || {};

  const hour = new Date().getHours();
  let greeting = "Good Evening!";
  if (hour < 12) greeting = "Good Morning!";
  else if (hour < 18) greeting = "Good Afternoon!";

  res.locals.greeting = `<p>${greeting}</p>`;

  const themes = ["blue-theme", "green-theme", "red-theme"];
  res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];

  // ✅ IMPORTANT: must be set before rendering any views
  setHeadAssetsFunctionality(res);

  next();
};

export { addLocalVariables };
