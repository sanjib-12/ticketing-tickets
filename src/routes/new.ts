import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@sbmytickets/common';
import { Ticket } from '../models/ticket';
import { getTsBuildInfoEmitOutputFilePath } from 'typescript';

const router = express.Router();

router.post('/api/tickets', 
   requireAuth, 
   [
      body('title')
         .not()
         .isEmpty()
         .withMessage('Title is required'),
      body('price')
         .isFloat({ gt: 0})
         .withMessage('price must be greater than zero')
   ], 
   validateRequest, 
   async (req: Request, res: Response) => {

      const { title, price} = req.body;

      const ticket = Ticket.build({title, price, userId: req.currentUser!.id})

      await ticket.save();

      res.status(201).send(ticket);
   }
);

export { router as createTicketRouter};