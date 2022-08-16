import express, { NextFunction } from 'express';
import testimonialRoutes from './routes/testimonials.routes';
import concertsRoutes from './routes/concerts.routes';
import seatsRoutes from './routes/seats.routes';
import cors from 'cors';
import { notFoundErr } from './errors'
import path from 'path'
import { Server } from 'socket.io';
import db from './db';

interface apiError {
  status: number;
  message: string
}

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Running on port 8000');
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  next();
})
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
  });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

io.on('connection', (socket) => {
  socket.emit('updateData', db.seats)
});