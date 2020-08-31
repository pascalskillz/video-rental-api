const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const mongoose = require('mongoose');
const validate = require('../middleware/validate')
const Joi = require('joi')
const auth = require('../middleware/auth')
const express = require('express');
const router = express.Router();


router.post('/', [auth, validate(validateReturn)], async (req, res) => {

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('No rental found with this customerId and movieId')

  if (rental.dateReturned) return res.status(400).send('Rental already processed')

  /* calculate the rental fee */
  rental.return();

  await rental.save();

  await Movie.update({ _id: req.body.movieId }, {
    $inc: { numberInStock: 1 }
  });

  return res.status(200).send(rental);
})

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router
