import express from 'express';
import TestimonialsMethods from '../methods/testimonials.methods';

const router = express.Router();

router.route('/testimonials').get(TestimonialsMethods.getAll);

router.route('/testimonials/random').get(TestimonialsMethods.getRandom);

router.route('/testimonials/:id').get(TestimonialsMethods.getById);

router.route('/testimonials').post(TestimonialsMethods.postNew);

router.route('/testimonials/:id').put(TestimonialsMethods.edit);

router.route('/testimonials/:id').delete(TestimonialsMethods.delete);

export default router;
