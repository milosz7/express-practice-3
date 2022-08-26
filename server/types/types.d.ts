import { Server } from 'socket.io';
import { Response } from 'express';
import { ConcertModel } from '../models/concerts.model';

declare global {
  namespace Express {
    interface Request {
      io: Server;
    }
  }
}

export interface ConcertDataReq {
  performer: string | undefined;
  genre: string | undefined;
  price: number | undefined;
  day: number | undefined;
  image: string | undefined;
}

export interface ErrorData {
  message: string;
  status: number;
}

export type ConcertResponse = Response<ConcertModel | ConcertModel[], Record<string, ConcertModel>>;
