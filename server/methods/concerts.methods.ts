import { Request, Response } from 'express';
import {
  ErrorData,
  ConcertResponse,
  ConcertDataReq,
  PossibleQueries,
  PriceRangeObj,
} from '../types/types';
import Concert from '../models/concerts.model';
import { notFoundErr } from '../errors';

class ConcertMethods {
  constructor() {}

  static async getAll(req: Request, res: ConcertResponse, next: (err: ErrorData) => void) {
    try {
      const query = req.query;
      const dbQuery: PossibleQueries = {};
      if (Object.keys(query).length) {
        if (query.max || query.min) {
          const priceQuery: PriceRangeObj = {};
          if (query.max && typeof query.max === 'string') {
            priceQuery.$lte = parseInt(query.max);
            delete query.max;
          }
          if (query.min && typeof query.min === 'string') {
            priceQuery.$gte = parseInt(query.min);
            delete query.min;
          }
          dbQuery.price = priceQuery;
        }
        Object.entries(req.query).forEach(([key, value]) => {
          if (typeof value === 'string') {
            if (value.includes('-')) {
              dbQuery[key] = value.replace('-', ' ');
            } else {
              dbQuery[key] = parseInt(value) ? parseInt(value) : value;
            }
          }
        });
      }
      const concertsData = await Concert.find(dbQuery).setOptions({strictQuery: false}).collation({
        locale: 'en_US',
        strength: 1,
      });
      if (concertsData.length === 0) return next(notFoundErr);
      return res.json(concertsData);
    } catch (e) {
      if (e instanceof Error) next({ status: 500, message: e.message });
    }
  }

  static async getById(req: Request, res: ConcertResponse, next: (err: ErrorData) => void) {
    try {
      const concertData = await Concert.findById(req.params.id);
      if (!concertData) return next(notFoundErr);
      return res.json(concertData);
    } catch (e) {
      if (e instanceof Error) next({ status: 500, message: e.message });
    }
  }

  static async getByPerformer(req: Request, res: ConcertResponse, next: (err: ErrorData) => void) {
    try {
      const requestedPerformer = req.params.performer;
      const performerConcerts = await Concert.find({ performer: requestedPerformer });
      if (!performerConcerts) return next(notFoundErr);
      return res.json(performerConcerts);
    } catch (e) {
      if (e instanceof Error) next({ status: 500, message: e.message });
    }
  }

  static async getByGenre(req: Request, res: ConcertResponse, next: (err: ErrorData) => void) {
    try {
      const requestedGenre = req.params.genre;
      const genreConcerts = await Concert.find({ genre: requestedGenre });
      if (!genreConcerts) return next(notFoundErr);
      return res.json(genreConcerts);
    } catch (e) {
      if (e instanceof Error) next({ status: 500, message: e.message });
    }
  }

  static async postNew(req: Request, res: Response<string>, next: (err: ErrorData) => void) {
    const newConcertData: ConcertDataReq = req.body;
    try {
      const newConcert = new Concert({ ...newConcertData });
      await newConcert.save();
      return res.status(200).send('Success');
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async edit(req: Request, res: ConcertResponse, next: (err: ErrorData) => void) {
    const newConcertData: ConcertDataReq = req.body;
    try {
      const concertToEdit = await Concert.findById(req.params.id);
      if (!concertToEdit) return next(notFoundErr);
      (Object.keys(newConcertData) as (keyof typeof newConcertData)[]).forEach((key) => {
        if (typeof newConcertData[key] === typeof concertToEdit[key]) {
          (concertToEdit[key] as string | number) = newConcertData[key] as string | number;
        }
      });
      await concertToEdit.save();
      return res.json(concertToEdit);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async delete(req: Request, res: ConcertResponse, next: (err: ErrorData) => void) {
    try {
      const concertToDelete = await Concert.findById(req.params.id);
      if (!concertToDelete) return next(notFoundErr);
      await concertToDelete.delete();
      return res.json(concertToDelete);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }
}

export default ConcertMethods;
