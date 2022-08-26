import express, { NextFunction } from 'express';
import testimonialRoutes from './routes/testimonials.routes';
import concertsRoutes from './routes/concerts.routes';
import seatsRoutes from './routes/seats.routes';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import Seat from './models/seats.model';

interface apiError {
  status: number;
  message: string;
}

const app = express();

const uri = 'mongodb://127.0.0.1:27017/NewWaveDB';

mongoose.connect(uri);
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to database.');
});

db.on('error', (e: Error) => console.log(e));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Running on port 8000');
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use('/api', testimonialRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.use((err: apiError, req: express.Request, res: express.Response, next: NextFunction) => {
  return res.json(err.message);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

io.on('connection', async (socket) => {
  const seatsToEmit = await Seat.find({});
  socket.emit('updateData', seatsToEmit);
});
