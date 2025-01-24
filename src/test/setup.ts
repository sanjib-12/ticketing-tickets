import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
   var signin: () => Promise<string[]>;
}

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
});

afterAll(async () => {
   if (mongo) {
      await mongo.stop(); //stop the in-memory MongoDB server
   }
   await mongoose.connection.close(); // close the Mongoose connection
});

global.signin = async () => {
   const email = "test@test.com";
   const password = "password";

   const response = await request(app)
      .post("/api/users/signup")
      .send({
         email,
         password,
      })
      .expect(201);

   const cookie = response.get("Set-Cookie");

   if (!cookie) {
      throw new Error("Failed to get cookie from response");
   }
   return cookie;
};
