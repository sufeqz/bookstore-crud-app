const app = require('./src/app');

const PORT = process.env.PORT || 8000; // Changed to 8000 to match frontend

app.listen(PORT, () => {
  console.log(`🚀 BookStore API Server running at http://localhost:${PORT}`);
});