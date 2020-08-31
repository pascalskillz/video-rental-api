const winston = require('winston')
//require('winston-mongodb')
require('express-async-errors')

module.exports = function () {
    /* process.on('uncaughtException', (err) => {
  winston.error(err.message, err);
  process.exit(1);
}) */

    /* for uncaught exceptions */
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    )

    /* for a rejected promise */
    process.on('unhandledRejection', (err) => {
        throw err; //throw the error so we catch it with winston's handleException method
        // winston.error(err.message, err);
        // process.exit(1);
    })

    /* to be able to log errors to a file */
    winston.add(winston.transports.File, { filename: 'logfile.log' })

    /* log errors to mongodb */
    // winston.add(winston.transports.MongoDB, {
    //     db: 'mongodb://localhost/vidly',
    //     level: 'info'
    // })

    /* 
    mimic uncaughtException
    throw new Error('Something failed during startup!')
    */

    /* 
    mimic unhandledRejection
    const p = Promise.reject(new Error('Something failed miserably!'))
    p.then(() => console.log('Done')) */
}