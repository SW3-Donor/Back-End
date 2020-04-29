const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User');

router.use(bodyParser.urlencoded({extended:true}));

router.