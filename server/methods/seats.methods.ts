import { Request, Response } from 'express';
import { ErrorData, SeatResponse, ExtendedSeatResponse, SeatsDataReq } from '../types/types';
import Seat from '../models/seats.model';
import Client from '../models/clients.model';
import { notFoundErr } from '../errors';
import { Types, Error as MongoError } from 'mongoose';

class SeatsMethods {
  constructor() {}

  static async getAll(req: Request, res: SeatResponse, next: (err: ErrorData) => void) {
    try {
      const seatsData = await Seat.find({});
      if (seatsData.length === 0) return next(notFoundErr);
      return res.json(seatsData);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async getById(req: Request, res: SeatResponse, next: (err: ErrorData) => void) {
    try {
      const requestedSeat = await Seat.findById(req.params.id);
      if (!requestedSeat) return next(notFoundErr);
      return res.json(requestedSeat);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async postNew(req: Request, res: Response<string>, next: (err: ErrorData) => void) {
    try {
      const { day, seat, name, email }: SeatsDataReq = req.body;
      const isTaken = await Seat.findOne({ $and: [{ day: { $eq: day }, seat: { $eq: seat } }] });
      if (isTaken) return next({ status: 400, message: 'Seat is already taken!' });

      const newClient = new Client({ name, email, _id: new Types.ObjectId() });
      const newSeat = new Seat({ day, seat, clientId: newClient._id });
      const clientErr = newClient.validateSync();
      const seatErr = newSeat.validateSync();

      if (!clientErr && !seatErr) {
        await newClient.save();
        await newSeat.save();
        req.io.emit('updateData', await Seat.find({}));
        return res.status(200).send('Success');
      }
      throw new MongoError(
        `${seatErr ? seatErr.message : ''} ${clientErr ? clientErr.message : ''}`
      );
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async edit(req: Request, res: SeatResponse, next: (err: ErrorData) => void) {
    try {
      const { day, seat, name, email }: SeatsDataReq = req.body;
      const seatData = { day, seat };
      const isTaken = await Seat.find({ $and: [{ day: { $eq: day } }, { seat: { $eq: seat } }] });
      if (isTaken)
        next({
          status: 400,
          message: 'Cannot edit as the entered seat/day combination is already taken',
        });
      const clientData = { name, email };
      const requestedSeat = await Seat.findById(req.params.id);
      if (!requestedSeat) return next(notFoundErr);
      (Object.keys(seatData) as (keyof typeof seatData)[]).forEach((key) => {
        if (typeof seatData[key] === requestedSeat[key]) {
          requestedSeat[key] = seatData[key] as number;
        }
      });
      await requestedSeat.save();
      console.log(requestedSeat);
      const requestedClient = await Client.findById(requestedSeat.clientId);
      if (requestedClient) {
        (Object.keys(clientData) as (keyof typeof clientData)[]).forEach((key) => {
          if (typeof clientData[key] === requestedClient[key]) {
            requestedClient[key] = clientData[key] as string;
          }
        });
        await requestedClient.save();
      }
      req.io.emit('updateData', await Seat.find({}));
      return res.json(await requestedSeat.populate('clientId'));
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async delete(
    req: Request,
    res: ExtendedSeatResponse | SeatResponse,
    next: (err: ErrorData) => void
  ) {
    try {
      const seatToDelete = await Seat.findById(req.params.id);
      if (!seatToDelete) return next(notFoundErr);
      const clientRelatedSeats = await Seat.find({ clientId: { $eq: seatToDelete.clientId } });
      await seatToDelete.delete();
      req.io.emit('updateData', await Seat.find({}))
      if (clientRelatedSeats.length === 1) {
        const relatedClient = await Client.findById(seatToDelete.clientId);
        if (relatedClient) {
          await relatedClient.delete();
          return res.json({ deletedSeat: seatToDelete, deletedClient: relatedClient });
        }
      }
      return res.json(await seatToDelete.populate('clientId'));
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }
}

export default SeatsMethods;
