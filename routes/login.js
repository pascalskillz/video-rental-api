const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const lodash = require('lodash')
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/:id', async (req, res) => {
	const user = await User.findById(req.params.id)
	if (!user) return res.status(404).send('The User with the given ID was not found.');
	res.send(user);
})

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send('Invalid email address or password')

	const validPassword = await bcrypt.compare(req.body.password, user.password)
	if (!validPassword) return res.status(400).send('Invalid email address or password')

	const token = user.generateAuthToken();
	res.send(token)
})

function validate(req) {
	const schema = {
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required()
	};
	return Joi.validate(req, schema);
}

module.exports = router