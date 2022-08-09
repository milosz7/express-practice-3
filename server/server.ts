import express, { NextFunction } from 'express';
import testimonialRoutes from './routes/testimonials.routes';
import concertsRoutes from './routes/concerts.routes';
import seatsRoutes from './routes/seats.routes';
import cors from 'cors';
import { notFoundErr } from './errors'

interface apiError {
  status: number;
  message: string
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use('/api', testimonialRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.use((err: apiError, req: express.Request, res: express.Response, next: NextFunction) => {
  if (err.status) {
    res.status(err.status);
    return res.send(err.message);
  }
    res.status(404);
    res.send(notFoundErr);
  })

app.listen(8000, () => {
  console.log('Running on port 8000');
})