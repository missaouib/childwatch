const express = require('express')
const basicAuth = require('basic-auth-connect');
const app = express()

app.use( basicAuth( 'admin', 'childwatch!@' ) );

const routeTable = {
	client1: 'http://localhost:8080',
	client2: 'http://162.244.67.121:8081',
	client3: 'http://162.244.67.121:53754'
};

function redirect( req, res, clientId, ageException ) {
  var clientUrl = routeTable[ 'client' +  clientId ];
  
  if( clientUrl ){
	  res.cookie( "CW_ID", clientId );
	  if( ageException ) res.cookie( "CW_AGEEXCEPTION", ageException.toUpperCase() );
	  else res.cookie( "CW_AGEEXCEPTION", undefined ); 
	  res.status(302).redirect( clientUrl );
  }
  else{
	  res.status(403).send( 'Client not authorized');
  }	
}


app.get('/client/:client/ageexcept/:ageexcept', function (req, res) {
	redirect( req, res, req.params.client, req.params.ageexcept );
})

app.get('/client/:client', function (req, res) {
	redirect( req, res, req.params.client, undefined );
})

app.use(express.static('public'))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})