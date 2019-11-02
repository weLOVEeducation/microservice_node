/* Express */
let express = require('express')
let app = express()

let cors = require('cors')

/* Packages */
//let newrelic = require('newrelic');
let compression = require('compression')
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');

/* Routes */
let accountsPublic = require('./routes/accountsPublic.js');
let accountsPrivate = require('./routes/accountsPrivate.js');

/* CLI Arguments */
let parseArgs = require('minimist')

/* Port */
let port = process.env.PORT || 8080;

/*
var args = parseArgs(process.argv.slice(2), {
  port: 'port'
});

if (process.env.NODE_ENV == 'test') {
  port = 8080;
} else if (args.port == undefined) {
  throw new Error("To start microservice, must define PORT argument. --port <num>");
} else {
  port = args.port;
}

*/

/* Configs */
let config = require('config');

/* Database options */
let options = { useMongoClient: true };

/* Database */
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;

/* Mongoose fix depreciation promise */
mongoose.Promise = Promise;

/* Database # Error Handling */
db.on('error', console.error.bind(console, 'connection error:'));

/* Testing environment */
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

/* app.use # packages */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));
app.use(compression());

app.use(cors());

/* app.user custom modification */

/* Accounts routes */
app.use('/accounts/', accountsPublic);
app.use('/accounts/', accountsPrivate);

/* Start API */
app.listen(port, function () {
  console.log('# Running on port ' + port + ' #');
})

module.exports = app;
