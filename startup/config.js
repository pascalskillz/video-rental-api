const config = require('config')

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined')
        //process.exit(1) //global object (anything but 0 means failure)
    }
}