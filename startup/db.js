const winston = require('winston')
const mongoose = require('mongoose');
const config = require('config')

module.exports = function () {
    const db = config.get('db');
    mongoose.connect(db)
        .then(() => winston.info(`Connected to ${db}...`))
    //.catch(err => console.error('Could not connect to MongoDB...'));
    // removed catch to allow the global error handler to handle connection error
    //so we can log it using winston
}