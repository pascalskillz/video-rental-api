const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
	const token = req.header('x-auth-token')
	if (!token) return res.status(401).send('Access denied. No token provided')

	//second arguement is the private key for decoding the token
	try {
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
		req.user = decoded;

		//adding decoded token to the user object so in the route
		//handle we can do req.user._id or req.user.decoded

		next(); //passing control to the next middleware funtion(in this case the route handler)
	} catch (error) {
		res.status(400).send('Invalid token');
	}
}