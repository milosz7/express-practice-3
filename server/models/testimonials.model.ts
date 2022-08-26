import { Schema, model, InferSchemaType } from 'mongoose';

const testimonialSchema = new Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
});

export type TestimonialModel = InferSchemaType<typeof testimonialSchema>;

const Testimonial = model<TestimonialModel>('Testimonial', testimonialSchema);

export default Testimonial;
