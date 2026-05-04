const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// 👉 Backend (Node, Nest, etc)
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:8081/api',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  })
);

// 👉 Frontend (Angular, React, etc)
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
  })
);

app.listen(3000, () => {
  console.log('Proxy corriendo en http://localhost:3000');
});