import express from 'express';
import SeatsMethods from '../methods/seats.methods';
const router = express.Router();

router.route('/seats').get(SeatsMethods.getAll);

router.route('/seats/:id').get(SeatsMethods.getById);

router.route('/seats').post(SeatsMethods.postNew);

router.route('/seats/:id').put(SeatsMethods.edit);

router.route('/seats/:id').delete(SeatsMethods.delete);

export default router;
