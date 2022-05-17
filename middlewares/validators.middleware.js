const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

//Models
const { User } = require('../models/user.model');

const createRepairValidations = [
  body('date').notEmpty().withMessage('Enter a valid date'),
  body('computerNumber')
    .notEmpty()
    .withMessage('Enter a valid computer number'),
  body('comments').notEmpty().withMessage('Provide valid comments'),
];

const createUserValidations = [
  body('name').notEmpty().withMessage('Enter a valid name'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must provide a valid email'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
  body('role').notEmpty().withMessage('Role cannot be empty'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // [msg, msg]
    const messages = errors.array().map(err => err.msg);
    // msg. msg
    const errorMsg = messages.join('. ');

    return next(new AppError(errorMsg, 400));
  }

  next();
};

const protectToken = catchAsync(async (req, res, next) => {
  let token;

  // Extract token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // ['Bearer', 'token']
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Session invalid', 403));
  }

  // Validate token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // decoded returns -> { id: 1, iat: 1651713776, exp: 1651717376 }
  const user = await User.findOne({
    where: { id: decoded.id, status: 'available' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is no longer available', 403)
    );
  }

  req.sessionUser = user;
  next();
});

module.exports = {
  createUserValidations,
  createRepairValidations,
  checkValidations,
  protectToken,
};
