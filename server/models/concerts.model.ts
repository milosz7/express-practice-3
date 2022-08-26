import { Schema, InferSchemaType, model } from 'mongoose';

const concertSchema = new Schema({
  performer: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  day: { type: Number, required: true },
  image: { type: String, required: true },
});

export type ConcertModel = InferSchemaType<typeof concertSchema>;

const Concert = model<ConcertModel>('Concert', concertSchema);

export default Concert;
