const express = require('express');
const crypto = require('crypto');
const validations = require('../middlewares/validations');

const ERROR_MESSAGE = 'Server error';

const loginRoute = express.Router();

loginRoute.post('', validations.Email, validations.Password, (_request, response) => {
    try {
      const token = crypto.randomBytes(8).toString('hex');
      return response.status(200).json({ token });
    } catch (error) {
        console.log(error); 
        return response.status(500).json({ message: ERROR_MESSAGE });
    }
});

module.exports = loginRoute;