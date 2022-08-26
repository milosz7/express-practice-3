import { Schema, InferSchemaType, model } from 'mongoose';

const seatSchema = new Schema({
  day: { type: Number, required: true, min: 1, max: 3 },
  seat: { type: Number, required: true, min: 1, max: 50 },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
});

export type SeatModel = InferSchemaType<typeof seatSchema>;

const Seat = model<SeatModel>('Seat', seatSchema);

export default Seat;
