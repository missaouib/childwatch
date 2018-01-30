// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
var proxy = require('http-proxy-middleware');
var fs = require('fs');

const proxyConfig = require('./proxy.conf');

const app = express();

var httpPort = process.env.HTTP_PORT || 80;
var httpsPort = process.env.HTTPS_PORT || 443;

var cwServer = process.env.CW_SERVER || 'localhost';
var cwServerPort = process.env.CW_SERVER_PORT || '8080';

// if the server is localhost - dont start the https server - just use http
if( cwServer !== 'localhost' ){
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
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });
}

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));


// proxy our api calls to the childwatch server
proxyConfig[0].context.forEach( ctx => app.use( ctx, proxy({target: `http://${cwServer}:${cwServerPort}`, changeOrigin: true})) )



// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


/**
 * Create HTTP/HTTPS servers.
 */
const https_server = (cwServer !== 'localhost')? https.createServer(options,app) : undefined;
const http_server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
if( cwServer !== 'localhost' ) { 
    https_server.listen(httpsPort, () => console.log(`CW2 client https started`));
    http_server.listen(httpPort, () => console.log(`CW2 client http started => redirecting to https site`));
}
else{
    http_server.listen(httpPort, () => console.log(`CW2 client http started`));
}
