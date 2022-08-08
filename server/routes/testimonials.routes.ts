import express from 'express';
import db from '../db';
import shortid from 'shortid';

interface testimonial {
  author: string;
  text: string;
}

const router = express.Router();
const testimonials = db.testimonials;
const badRequestErr = {
  status: 400,
  message: 'Please provide all necessary data!'
}

router.route('/testimonials').get((req, res, next) => {
  if (testimonials.length === 0) {
    next();
  }
  res.send(testimonials);
});

router.route('/testimonials/random').get((req, res, next) => {
  if (testimonials.length === 0) {
    next();
  }
  const randomData = testimonials[Math.floor(Math.random() * testimonials.length)];
  res.send(randomData);
});

router.route('/testimonials/:id').get((req, res, next) => {
  const requestedData = testimonials.find((data) => data.id === req.params.id);
  if (!requestedData) {
    next();
  }
  res.send(requestedData);
});

router.route('/testimonials').post((req, res, next) => {
  const postedData: testimonial = req.body;
  const newDataId = shortid();
  const { author, text } = postedData;
  if (author && text) {
    testimonials.push({ ...postedData, id: newDataId });
    res.send(`New testimonial added! Check it out at /api/testimonials/${newDataId}`);
  } else
  next(badRequestErr);
});

router.route('/testimonials/:id').put((req, res, next) => {
  const newData: testimonial = req.body;
  const { author, text } = newData;
  const dataToEditIdx = testimonials.findIndex((data) => data.id === req.params.id);
  if (dataToEditIdx === -1) {
    next();
  }
  if (author && text) {
    testimonials[dataToEditIdx] = { id: req.params.id, ...newData };
    res.send(`Updated a testimonial with ID: ${req.params.id}`);
  } else
  next(badRequestErr)
});

router.route('/testimonials/:id').delete((req, res, next) => {
  const dataToRemoveIdx = testimonials.findIndex((data) => data.id === req.params.id);
  if (dataToRemoveIdx === -1) {
    next();
  }
  testimonials.splice(dataToRemoveIdx, 1);
  res.send(`Deleted a testimonial with ID: ${req.params.id}`);
});

export default router;
