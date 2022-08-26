import express from 'express';
import ConcertMethods from '../methods/concerts.methods';

const router = express.Router();

router.route('/concerts').get(ConcertMethods.getAll);

router.route('/concerts/:id').get(ConcertMethods.getById);

router.route('/concerts').post(ConcertMethods.postNew);

router.route('/concerts/:id').put(ConcertMethods.edit);

router.route('/concerts/:id').delete(ConcertMethods.delete);

export default router;
