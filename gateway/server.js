const express = require('express')
const basicAuth = require('basic-auth-connect');
const app = express()
const { Client } = require('pg');
var Docker = require('dockerode');

const client = new Client({
	user: 'cw-db',
	host: 'postgres',
	database: 'cw-gateway',
	password: 'childwatch',
	port: 5432
});

const docker = new Docker();

const clientAdmin = new Client({
	user: 'postgres',
	host: 'postgres',
	database: 'postgres',
	password: 'p0stgr3s!',
	port: 5432
});


app.use( basicAuth( 'admin', 'childwatch!@' ) );


var cwClients = [];
var timer;

function getClients() {
	client.query( 'SELECT * from client ORDER BY id', (err,resp) => cwClient = err ? [] : resp.rows );	
}


function validateClient( clientId ){
	var found = cwClients.find( client => client.id === clientId );
	return found? found.url : undefined;
}


function createDatabase( clientId ) {
	var sql = `CREATE DATABASE "childwatch-${clientId}" WITH OWNER = "cw-db" ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' TABLESPACE = pg_default CONNECTION LIMIT = -1;`;		
    clientAdmin.query( sql, (err,resp) => console.log( err ? err.stack : resp ) );
}

function startDockerContainer( clientId ){
	
}

function redirect( req, res, clientId, ageException ) {
  var clientUrl = validateClient(clientId);
  
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

app.get( '/api/client', function(req,res){ 
	client.query( 'SELECT * from client', (err,resp) => { 
		res.send( err ? err.stack : resp.rows );
		cwClients = resp.rows;
	});
} );

app.get('/client/:client/ageexcept/:ageexcept', function (req, res) {
	redirect( req, res, req.params.client, req.params.ageexcept );
})

app.get('/client/:client', function (req, res) {
	redirect( req, res, req.params.client, undefined );
})

app.use(express.static('public'))

client.connect();
clientAdmin.connect();

/* poll the client list every 3 minutes */
timer = setInterval( getClients, 1000 * 60 * 3 );	

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})