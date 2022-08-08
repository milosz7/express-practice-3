import express from 'express';
import testimonialRoutes from './routes/testimonials.routes';
import concertsRoutes from './routes/concerts.routes';
import seatsRoutes from './routes/seats.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api', testimonialRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.use((req, res) => {
  res.status(404);
  const noData = {message: 'Not found'};
  res.send(noData);
})

app.listen(8000, () => {
  console.log('Running on port 8000');
})