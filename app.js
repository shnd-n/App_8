const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('🚀 Hello from GitHub Codespaces!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
