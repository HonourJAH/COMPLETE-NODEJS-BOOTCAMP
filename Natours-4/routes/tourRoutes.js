const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();
//prettier-ignore
router
  .route('/')
  .get(getAllTours)
  .post(createTour);

//prettier-ignore
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
