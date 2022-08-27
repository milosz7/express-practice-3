import { Schema, model, InferSchemaType } from 'mongoose';
import { validateEmail } from '../helpers';

const clientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, validate: validateEmail, trim: true },
});

export type ClientModel = InferSchemaType<typeof clientSchema>;

const Client = model<ClientModel>('Client', clientSchema);

export default Client;
