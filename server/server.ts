import express from 'express';
import testimonialRoutes from './routes/testimonials.routes';

interface testimonial {
  author: string;
  text: string;
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', testimonialRoutes)

app.use((req, res) => {
  res.status(404);
  const noData = {message: 'Not found'};
  res.send(noData);
})

app.listen(8000, () => {
  console.log('Running on port 8000');
})