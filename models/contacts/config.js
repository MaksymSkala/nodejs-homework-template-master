import dotenv from 'dotenv';
dotenv.config();

export default {  
  MONGODB_URI: process.env.MONGODB_URI,
  SECRET_KEY: process.env.SECRET_KEY,  
};