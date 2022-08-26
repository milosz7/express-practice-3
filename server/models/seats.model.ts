import { Schema, InferSchemaType, model } from 'mongoose';

const seatSchema = new Schema({
  day: { type: Number, required: true },
  seat: { type: Number, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
});

export type SeatModel = InferSchemaType<typeof seatSchema>;

const Seat = model<SeatModel>('Seat', seatSchema);

export default Seat;
