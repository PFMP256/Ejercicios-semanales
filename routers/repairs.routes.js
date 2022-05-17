const express = require('express');

// Middlewares
const {
  pendingRepairExists,
  protectEmployee,
} = require('../middlewares/repairs.middlewares');
const {
  createRepairValidations,
  checkValidations,
  protectToken,
} = require('../middlewares/validators.middleware');

// Controllers
const {
  getAllCompletedRepairs,
  getAllPendingRepairs,
  createRepair,
  getRepairById,
  repairCancelled,
  repairCompleted,
} = require('../controllers/repairs.controller');

const router = express.Router();

// Apply protectToken middleware
router.use(protectToken);

router.get('/completed', protectEmployee, getAllCompletedRepairs);

router.get('/pending', protectEmployee, getAllPendingRepairs);

router.post(
  '/',
  protectEmployee,
  createRepairValidations,
  checkValidations,
  createRepair
);

router.get('/:id', protectEmployee, pendingRepairExists, getRepairById);

router.patch('/:id', protectEmployee, pendingRepairExists, repairCompleted);

router.delete('/:id', protectEmployee, pendingRepairExists, repairCancelled);

module.exports = { repairsRouter: router };
