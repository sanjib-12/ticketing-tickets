import { OrderCreatedEvent, OrderStatus } from "@sbmytickets/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { orderCreatedListener } from "../order-created-listener"
import mongoose, { set } from "mongoose";
import { Message } from 'node-nats-streaming';
import { json } from "express";

const setup = async () =>{
   // create an instance of the listener
   const listener = new orderCreatedListener(natsWrapper.client);

   const ticket = Ticket.build({
      title: 'concert', 
      price: 99,
      userId: 'asdf'
   })

   await ticket.save();

   // create the fake data event
   const data : OrderCreatedEvent['data'] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: 'asdfj',
      expiresAt: 'asdfsdf',
      ticket: {
         id: ticket.id,
         price: ticket.price,
      },
   }

   // @ts-ignore
   const msg: Message = {
      ack: jest.fn()
   };

   return { listener, ticket, data, msg};
}

it('sets the userID of the ticket', async () =>{
   const { listener, ticket, data, msg } = await setup();

   await listener.onMessage(data, msg);

   const updatedTicket = await Ticket.findById(ticket.id);

   expect(updatedTicket!.orderId).toEqual(data.id);
   console.log('Test 1 running');
});

it('acks the message', async () => {
   const { listener, ticket, data, msg } = await setup();

   await listener.onMessage(data, msg);

   expect( msg.ack).toHaveBeenCalled();
   console.log('Test 2 running');
});

it('publishes a ticket updated event', async () =>{
   const { listener, ticket, data, msg} = await setup();

   await listener.onMessage(data, msg);

   expect(natsWrapper.client.publish).toHaveBeenCalled();
   // @ts-ignore
   console.log(natsWrapper.client.publish.mock.calls);

   const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

   expect(data.id).toEqual(ticketUpdatedData.orderId);
   console.log('Test 3 running');

})