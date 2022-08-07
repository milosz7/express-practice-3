import express from 'express';
import db from '../db';
import shortid from 'shortid';

interface testimonial {
  author: string;
  text: string;
};

const router = express.Router();
const testimonials = db.testimonials;

router.route('/testimonials').get((req, res) => {
  res.send(testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  const randomData = testimonials[Math.floor(Math.random() * testimonials.length)];
  res.send(randomData);
});

router.route('/testimonials/:id').get((req, res, next) => {
  const requestedData = testimonials.find(data => data.id === req.params.id);
  if (!requestedData) {
    next();
  };
  res.send(requestedData);
})

router.route('/testimonials').post((req, res) => {
  const postedData: testimonial = req.body;
  const newDataId = shortid();
  testimonials.push({...postedData, id: newDataId});
  res.send(`New testimonial added! Check it out at /testimonials/${newDataId}`);
});

router.route('/testimonials/:id').put((req, res, next) => {
  const newData: testimonial = req.body;
  const dataToEditIdx = testimonials.findIndex(data => data.id === req.params.id);
  if(dataToEditIdx === -1) {
    next();
  }
  testimonials[dataToEditIdx] = {id: req.params.id, ...newData};
  res.send(`Updated a testimonial with ID: ${req.params.id}`);
});

router.route('/testimonials/:id').delete((req, res, next) => {
  const dataToRemoveIdx = testimonials.findIndex(data => data.id === req.params.id);
  if (dataToRemoveIdx === -1) {
    next();
  }
  testimonials.splice(dataToRemoveIdx, 1);
  res.send(`Deleted a testimonial with ID: ${req.params.id}`);
});

export default router;
