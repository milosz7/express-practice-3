import express from 'express';
import db from '../db';
import shortid from 'shortid';

interface seatData {
  day: number;
  seat: number;
  client: string;
  email: string;
}

const app = express();
const router = express.Router();
const seats = db.seats;
const badRequestErr = {
  status: 400,
  message: 'Please provide all necessary data!'
}

router.route('/seats').get((req, res, next) => {
  if (seats.length === 0) {
    next();
  }
  res.send(seats);
});

router.route('/seats/:id').get((req, res, next) => {
  const requestedData = seats.find((data) => data.id === req.params.id);
  if (!requestedData) {
    next();
  }
  res.send(requestedData);
});

router.route('/seats').post((req, res, next) => {
  const postedData: seatData = req.body;
  const { day, seat, client, email } = postedData;
  if (day && client && seat && email) {
    const newDataId = shortid();
    seats.push({ id: newDataId, ...postedData });
    res.send(`Seat data added! Check it out at: /api/seats/${newDataId}`);
  } else
  next(badRequestErr);
});

router.route('/seats/:id').put((req, res, next) => {
  const datatoEditIdx = seats.findIndex((data) => data.id === req.params.id);
  if (datatoEditIdx === -1) {
    next();
  }
  const newData: seatData = req.body;
  const { day, seat, client, email } = newData;
  if (day && client && seat && email) {
    seats[datatoEditIdx] = { id: req.params.id, ...newData };
    res.send(`Updated seat data with ID: ${req.params.id}`);
  } else
  next(badRequestErr)
});

router.route('/seats/:id').delete((req, res, next) => {
  const dataToRemoveIdx = seats.findIndex((data) => data.id === req.params.id);
  if (dataToRemoveIdx === -1) {
    next();
  }
  seats.splice(dataToRemoveIdx, 1);
  res.send(`Deleted a seat data with ID: ${req.params.id}`);
});

export default router;
