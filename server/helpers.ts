import dotenv from 'dotenv';

export const validateEmail = (email: string) => {
  const emailRegexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return emailRegexp.test(email);
};

export const declareUri = (): string => {
  dotenv.config();
  if(process.env.NODE_ENV === 'test') return 'mongodb://localhost:27017/NewWaveDBtests';
  if (process.env.NODE_ENV === 'development') return 'mongodb://localhost:27017/NewWaveDB';
  return process.env.DB_CONN_STRING;
};
