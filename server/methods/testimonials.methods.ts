import { Request, Response } from 'express';
import { ErrorData, TestimonialResponse, TestimonialDataReq } from '../types/types';
import Testimonial from '../models/testimonials.model';
import { notFoundErr } from '../errors';
import { TestimonialModel } from '../models/testimonials.model';

class TestimonialsMethods {
  constructor() {}

  static async getAll(req: Request, res: TestimonialResponse, next: (err: ErrorData) => void) {
    try {
      const testimonialsData = await Testimonial.find({});
      if (testimonialsData.length === 0) return next(notFoundErr);
      return res.json(testimonialsData);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async getRandom(req: Request, res: TestimonialResponse, next: (err: ErrorData) => void) {
    try {
      const randomTestimonial = await Testimonial.aggregate<TestimonialModel>().sample(1);
      if (randomTestimonial.length === 0) return next(notFoundErr);
      return res.json(randomTestimonial);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async getById(req: Request, res: TestimonialResponse, next: (err: ErrorData) => void) {
    try {
      const requestedTestimonial = await Testimonial.findById(req.params.id);
      if (!requestedTestimonial) return next(notFoundErr);
      return res.json(requestedTestimonial);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async postNew(req: Request, res: Response<string>, next: (err: ErrorData) => void) {
    try {
      const newTestimonialData: TestimonialDataReq = req.body;
      const newTesimonial = new Testimonial({ ...newTestimonialData });
      await newTesimonial.save();
      return res.status(200).send('Success');
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async edit(req: Request, res: TestimonialResponse, next: (err: ErrorData) => void) {
    try {
      const newTestimonialData: TestimonialDataReq = req.body;
      const testimonialToEdit = await Testimonial.findById(req.params.id);
      if (!testimonialToEdit) return next(notFoundErr);
      (Object.keys(newTestimonialData) as (keyof typeof newTestimonialData)[]).forEach((key) => {
        if (typeof newTestimonialData[key] === typeof testimonialToEdit[key]) {
          testimonialToEdit[key] = newTestimonialData[key] as string;
        }
      });
      await testimonialToEdit.save();
      return res.json(testimonialToEdit);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }

  static async delete(req: Request, res: TestimonialResponse, next: (err: ErrorData) => void) {
    try {
      const testimonialToDelete = await Testimonial.findById(req.params.id);
      if (!testimonialToDelete) return next(notFoundErr);
      await testimonialToDelete.delete();
      return res.json(testimonialToDelete);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  }
}

export default TestimonialsMethods;
