import express from 'express';
import db from '../db';
import shortid from 'shortid';

interface concertData {
  performer: string;
  genre: string;
  price: number;
  day: number;
  image: string;
};

const router = express.Router();
const concerts = db.concerts;

router.route('/concerts').get((req, res) => {
  res.send(concerts);
});

router.route('/concerts/:id').get((req, res, next) => {
  const requestedData = concerts.find(data => data.id === req.params.id);
  if (!requestedData) {
    next();
  }
  res.send(requestedData);
});

router.route('/concerts').post((req, res) => {
  const newConcertData: concertData = req.body;
  const newConcertId = shortid();
  concerts.push({id: newConcertId, ...newConcertData});
  res.send(`New concert added! Check it out at /api/concerts/${newConcertId}.`); 
});

router.route('/concerts/:id').put((req, res, next) => {
  const newConcertData: concertData = req.body;
  const concertToEditIdx = concerts.findIndex(data => data.id === req.params.id);
  if (concertToEditIdx === -1) {
    next();
  }
  concerts[concertToEditIdx] = {id: req.params.id, ...newConcertData};
  res.send(`Concert data updated! Check it out at /api/concerts/${req.params.id}.`); 
});

router.route('/concerts/:id').delete((req, res, next) => {
  const concertToDeleteIdx = concerts.findIndex(data => data.id === req.params.id);
  if (concertToDeleteIdx === -1) {
    next();
  }
  concerts.splice(concertToDeleteIdx, 1);
  res.send(`Concert data removed. Removed concert ID: ${req.params.id}`);
})



export default router;