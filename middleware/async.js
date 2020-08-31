module.exports = function (handler) {
	return async (req, res, next) => {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
			//passing control to the error middleware funtion
			//the error argument is the first arguement for in the error middleware function
		}
	}
}

/* with the express-async-errors dependency, this function becomes redundant*/