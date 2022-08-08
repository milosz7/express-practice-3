import express, { NextFunction } from 'express';
import testimonialRoutes from './routes/testimonials.routes';
import concertsRoutes from './routes/concerts.routes';
import seatsRoutes from './routes/seats.routes';

interface apiError {
  status: number;
  message: string
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api', testimonialRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.use((err: apiError, req: express.Request, res: express.Response, next: NextFunction) => {
  if (err.status === 400) {
    res.status(400);
    res.send(err);
  } else {
    res.status(404);
    const noData = {status: 404, message: 'Not found'};
    res.send(noData);
  }
  
})

app.listen(8000, () => {
  console.log('Running on port 8000');
})