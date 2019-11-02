let express = require('express');
let router = express.Router();

var jwt = require('jsonwebtoken');

let fs = require('fs')

let jwtOptions = require('../config/jwt.js');

let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;

router.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.params.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		let cert = fs.readFileSync(__dirname + '/../keys/public.pem');

		jwt.verify(token, cert, { algorithm: 'RS256' }, function(err, decoded) {

			if (err) {
				console.log(err);
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.account = decoded;
				next();
			}

		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}

});

module.exports = router;
