const express = require('express');
// const userController = require('../controllers/userController');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();
//prettier-ignore
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

//prettier-ignore
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
