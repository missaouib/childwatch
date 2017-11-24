// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
var proxy = require('http-proxy-middleware');
var fs = require('fs');

const proxyConfig = require('./proxy.conf');

const app = express();

var key = fs.readFileSync('./encrypt/online.childwatch.com.server.key');
var cert = fs.readFileSync( './encrypt/online.childwatch.com.crt' );

var options = {
        key: key,
        cert: cert,
        passphrase: process.env.PASSPHRASE
    };

// redirect non-secure to the secure site 
app.use(function(req, res, next) {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
});

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

var cwServer = process.env.CW_SERVER || 'localhost';
var cwServerPort = process.env.CW_SERVER_PORT || '8080';

// proxy our api calls to the childwatch server
proxyConfig[0].context.forEach( ctx => app.use( ctx, proxy({target: `http://${cwServer}:${cwServerPort}`, changeOrigin: true})) )



// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


/**
 * Create HTTP/HTTPS servers.
 */
const https_server = https.createServer(options,app);
const http_server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
https_server.listen(443, () => console.log(`CW2 client https started`));
http_server.listen(80, () => console.log(`CW2 client http started => redirecting to https site`));