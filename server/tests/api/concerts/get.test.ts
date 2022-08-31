import { server } from '../../../server';
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe } from 'mocha';
import Concert from '../../../models/concerts.model';
import mongoose from 'mongoose';
import { getConcertsSampleData } from './sampleData';

chai.use(chaiHttp);

describe('Concerts GET requests', () => {
  before(async () => {
    await Concert.insertMany(getConcertsSampleData);
  });
  it('Should return all data when no query params', async () => {
    const { body, status }: { body: typeof Concert[]; status: number } = await chai
      .request(server)
      .get('/api/concerts/');
    const desiredLength = 6;
    expect(status).to.eq(200);
    expect(body).to.have.lengthOf(desiredLength);
  });
  it("Should return all performer's concerts when passed valid performer query params", async () => {
    const { body, status }: { body: typeof Concert[]; status: number } = await chai
      .request(server)
      .get('/api/concerts/?performer=mick-jagger');
    const desiredLength = 2;
    expect(status).to.eq(200);
    expect(body).to.have.lengthOf(desiredLength);
  });
  it('Should return all day related concerts when passed valid day query params', async () => {
    const { body, status }: { body: typeof Concert[]; status: number } = await chai
      .request(server)
      .get('/api/concerts/?day=3');
    const desiredLength = 3;
    expect(status).to.eq(200);
    expect(body).to.have.lengthOf(desiredLength);
  });
  it('Should return all genre related concerts when passed valid genre params', async () => {
    const { body, status }: { body: typeof Concert[]; status: number } = await chai
      .request(server)
      .get('/api/concerts/?genre=r%26b');
    const desiredLength = 2;
    expect(status).to.eq(200);
    expect(body).to.have.lengthOf(desiredLength);
  });
  it('Should return concert data within price range specified by price params', async () => {
    const testCases = [
      {
        url: '/api/concerts/?min=40&max=60',
        expectedResult: 3,
      },
      {
        url: '/api/concerts/?min=50',
        expectedResult: 1,
      },
      {
        url: '/api/concerts/?max=30',
        expectedResult: 3,
      },
    ];
    for (const { url, expectedResult } of testCases) {
      const { body, status }: { body: typeof Concert[]; status: number } = await chai
        .request(server)
        .get(url);
      expect(status).to.eq(200);
      expect(body).to.have.lengthOf(expectedResult);
    }
  });
  it('Should return correct data when passed multiple query params', async () => {
    const testCases = [
      {
        url: '/api/concerts/?max=30&genre=pop',
        expectedResult: 1,
      },
      {
        url: '/api/concerts/?genre=r%26b&min=25',
        expectedResult: 2,
      },
      {
        url: '/api/concerts/?min=30&max=50&day=3&performer=mick-jagger',
        expectedResult: 1,
      },
    ];
    for (const { url, expectedResult } of testCases) {
      const { body, status }: { body: typeof Concert[]; status: number } = await chai
        .request(server)
        .get(url);
      expect(status).to.eq(200);
      expect(body).to.have.lengthOf(expectedResult);
    }
  });
  it('Should return no data when passed invalid query params', async () => {
    const testCases = [
      '/api/concerts/?gen=r%26b&min25',
      '/api/concerts/?genre=r%2b&mi5',
      '/api/concerts/?test=test',
    ];
    for (const url of testCases) {
      const { body, status }: { body: typeof Concert[]; status: number } = await chai
        .request(server)
        .get(url);
      expect(status).to.eq(404);
      expect(body).to.eq('Not found.');
    }
  });
  after(async () => {
    await Concert.deleteMany({});
    for (const key in mongoose.models) {
      delete mongoose.models[key];
    }
  });
});
