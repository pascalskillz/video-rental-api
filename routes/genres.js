const { Genre, validate } = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const mongoose = require('mongoose');
const express = require('express');
const validateObjectId = require('../middleware/validateObjectId')
const router = express.Router();




/* router.get('/', async (req, res, next) => {
  try {
    const genres = await Genre.find().sort('name');
    res.send(genres);
  } catch (ex) {
    next(ex)
  }
}); */

router.get('/', async (req, res, next) => {
	//throw new Error('Could not get the genres');
	const genres = await Genre.find().sort('name');
	res.send(genres);
});

router.post('/', auth, async (req, res) => {

	// const token = req.header('x-auth-tokne')
	// if (!token) return res.status(401).send('Access denied. No token provided')

	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let genre = new Genre({ name: req.body.name });
	genre = await genre.save();

	res.send(genre);
});

router.put('/:id', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
		new: true
	});

	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	res.send(genre);
});

/* Middleware functions:
  auth - check valid jsonwebtoken
  admin - check that user is an admin
*/

router.delete('/:id', [auth, admin], async (req, res) => {
	const genre = await Genre.findByIdAndRemove(req.params.id);

	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {

	const genre = await Genre.findById(req.params.id);
	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	res.send(genre);
});

module.exports = router;