import express from 'express';
import 'express-async-errors' 
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from '@sbmytickets/common';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
   cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test' // If it is a test than it will be false and this will enable the http request.
   })
)


app.all('*',async() =>{
   throw new NotFoundError()
});

app.use(errorHandler);

export { app };