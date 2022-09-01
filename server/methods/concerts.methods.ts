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
import sanitize from 'mongo-sanitize';

class ConcertMethods {
  constructor() {}

  static async getAll(req: Request, res: ConcertResponse, next: (err: ErrorData) => void) {
    try {
      const query = req.query;
      const dbQuery: PossibleQueries = {};
      const acceptedDataQueries = ['performer', 'genre', 'day'];
      const acceptedPriceQueries = ['min', 'max'];
      const filteredQueryKeys = Object.keys(query).filter((key) =>
        acceptedDataQueries.concat(acceptedPriceQueries).includes(key)
      );
      if (filteredQueryKeys.includes('min') || filteredQueryKeys.includes('max')) {
        const priceQuery: PriceRangeObj = {};
        if (typeof query.max === 'string' && parseInt(query.max)) {
          priceQuery.$lte = parseInt(query.max);
        }
        if (typeof query.min === 'string' && parseInt(query.min)) {
          priceQuery.$gte = parseInt(query.min);
        }
        dbQuery.price = priceQuery;
      }
      const filteredDataQueryKeys = Object.entries(query).filter(([key, value]) =>
        acceptedDataQueries.includes(key)
      );
      filteredDataQueryKeys.forEach(([key, value]) => {
        if (typeof value === 'string') {
          if (value.includes('-')) {
            return dbQuery[key] = value.replace('-', ' ');
          }
          dbQuery[key] = parseInt(value) ? parseInt(value) : value;
        }
      });
      const concertsData = await Concert.find(dbQuery)
        .collation({
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
