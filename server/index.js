// server/index.js
const express = require('express');
const app = express();
const PORT = 6000;

// Middleware | i'll start with the backend soon.
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Backend of sentinelx is running ');
});

// server starts
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
