// server.js
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Allow all CORS requests
app.use(cors());

// Endpoint that returns a fixed response
app.get('/api', (req, res) => {
  res.json({ a: 15, b: "dsadas" });
});

// Endpoint that gets a parameter "a" (from query string) and puts it in the result
// Example: http://localhost:3000/api/echo?a=123
app.get('/echo1', (req, res) => {
  const a = req.query.a;
  res.json({ a, b: "dsadas" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
