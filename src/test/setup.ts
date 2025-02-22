import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
   var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
   process.env.JWT_KEY = "asdf";

   mongo = await MongoMemoryServer.create(); //start an in-memory MongoDB server
   const mongoUri = mongo.getUri(); // Get the connection URI

   await mongoose.connect(mongoUri, {}); //Connect MOngoose to the in-memory MongoDB
});

beforeEach(async () => {
   if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections(); //Get all collections

      for (let collection of collections) {
         await collection.deleteMany({}); // clear each collection
      }
   }
   jest.clearAllMocks();
});

afterAll(async () => {
   if (mongo) {
      await mongo.stop(); //stop the in-memory MongoDB server
   }
   await mongoose.connection.close(); // close the Mongoose connection
});

global.signin = () => {
   // Build a JWT payload. { id, email }
   const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com'
   }
   // Create the JWT!
   const token = jwt.sign(payload, process.env.JWT_KEY!);

   // Build session Objects. { jwt: MY_JWT}
   const session = { jwt: token };

   // Turn that session into JSON
   const sessionJSON = JSON.stringify(session);

   // Take JSON and encode it as base64
   const base64 = Buffer.from(sessionJSON).toString('base64');

   // return a string thats the cookie with the encoded data 
   return [`session=${base64}`];
};
