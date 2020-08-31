const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi) //passing a reference to joi module
const mongoose = require('mongoose');
const joiObjectid = require('joi-objectid');
const monment = require('moment')

/* We are not reusing the customer schema since we only want 
to persist some of the properties of the customer in the rental
document. Same applies to movies
*/

const rentalSchema = new mongoose.Schema({
	customer: {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true,
				minlength: 5,
				maxlength: 50
			},
			isGold: {
				type: Boolean,
				default: false
			},
			phone: {
				type: String,
				required: true,
				minlength: 5,
				maxlength: 50
			}
		}),
		required: true
	},
	movie: {
		type: new mongoose.Schema({
			title: {
				type: String,
				required: true,
				trim: true,
				minlength: 5,
				maxlength: 255
			},
			dailyRentalRate: {
				type: Number,
				required: true,
				min: 0,
				max: 255
			}
		}),
		required: true
	},
	dateOut: {
		type: Date,
		required: true,
		default: Date.now
	},
	dateReturned: {
		type: Date
	},
	rentalFee: {
		type: Number,
		min: 0
	}
});

rentalSchema.methods.return = function () {
	this.dateReturned = new Date();

	const rentalDays = monment().diff(this.dateOut, 'days')

	this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

/* adding a static method */
rentalSchema.statics.lookup = function (customerId, movieId) {
	return this.findOne({
		'customer._id': customerId,
		'movie._id': movieId
	});
}
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required()
	};

	return Joi.validate(rental, schema);
}
/* 
to refactor the this validateRental to use the central validate middleware
- set the name to validateRental
- import central validate middle in rentals.js
- call the validate middleware and pass a reference to the validateRental
 */
exports.Rental = Rental;
exports.validate = validateRental;