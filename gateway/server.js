const express = require('express')
const basicAuth = require('basic-auth-connect');
const app = express()

app.use( basicAuth( 'admin', 'childwatch!@' ) );

const routeTable = {
	client1: 'http://localhost:8080',
	client2: 'http://162.244.67.121:8081',
	client3: 'http://162.244.67.121:53754'
};

app.get('/client/:client', function (req, res) {

  var clientUrl = routeTable[ 'client' + req.params.client ];
  
  if( clientUrl ){
	  res.cookie( "CW_ID", req.query.clientid );
	  res.status(302).redirect( clientUrl );
  }
  else{
	  res.status(403).send( 'Client not authorized');
  }
})

app.use(express.static('public'))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})