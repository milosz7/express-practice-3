import { Server } from 'socket.io';
import { Response } from 'express';
import { ConcertModel } from '../models/concerts.model';
import { TestimonialModel } from '../models/testimonials.model';
import { SeatModel } from '../models/seats.model';
import { ClientModel } from '../models/clients.model';

declare global {
  namespace Express {
    interface Request {
      io: Server;
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      DB_CONN_STRING: string;
    }
  }
}

export interface ErrorData {
  message: string;
  status: number;
}

export interface ConcertDataReq {
  performer: string | undefined;
  genre: string | undefined;
  price: number | undefined;
  day: number | undefined;
  image: string | undefined;
}

export type ConcertResponse = Response<ConcertModel | ConcertModel[], Record<string, ConcertModel>>;

export interface TestimonialDataReq {
  author: string | undefined;
  text: string | undefined;
}

export type TestimonialResponse = Response<
  TestimonialModel | TestimonialModel[],
  Record<string, TestimonialModel>
>;

export interface SeatsDataReq {
  day: number | undefined;
  seat: number | undefined;
  name: string | undefined;
  email: string | undefined;
}

export type SeatResponse = Response<SeatModel | SeatModel[], Record<string, SeatModel>>;

export type ExtendedSeatResponse = Response<
  { deletedSeat: SeatModel; deletedClient: ClientModel },
  Record<string, { deletedSeat: SeatModel; deletedClient: ClientModel }>
>;

export interface PriceRangeObj {
  $lte?: number;
  $gte?: number;
}
export interface PossibleQueries {
  [key: string]: number | string;
  price? : PriceRangeObj;
}
