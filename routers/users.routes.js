const express = require('express');

// Middlewares
const {
  userExists,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');
const {
  createUserValidations,
  checkValidations,
  protectToken,
} = require('../middlewares/validators.middleware');

// Controllers
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
} = require('../controllers/users.controller');

const router = express.Router();

router.post('/login', login);

router.post('/', createUserValidations, checkValidations, createUser);

router.get('/', getAllUsers);

// Apply protectToken middleware
router.use(protectToken);

router.get('/:id', userExists, getUserById);

router.patch('/:id', userExists, protectAccountOwner, updateUser);

router.delete('/:id', userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
