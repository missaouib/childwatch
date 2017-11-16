// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
var proxy = require('http-proxy-middleware');

const app = express();

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes

var cwServer = process.env.CW_SERVER || 'localhost';
var cwServerPort = process.env.CW_SERVER_PORT || '8080';

app.use('/api', proxy({target: `http://${cwServer}:${cwServerPort}`, changeOrigin: true}));
app.use('/rules', proxy({target: `http://${cwServer}:${cwServerPort}`, changeOrigin: true}));
app.use('/generatemenu', proxy({target: `http://${cwServer}:${cwServerPort}`, changeOrigin: true}));


// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`CW2 client running on localhost:${port}`));