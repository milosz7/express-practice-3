import { Schema, model, InferSchemaType } from 'mongoose';

const clientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export type ClientModel = InferSchemaType<typeof clientSchema>;

const Client = model<ClientModel>('Client', clientSchema);

export default Client;
