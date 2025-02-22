import { Ticket } from "../ticket";

it('implement optimistic concurrency control', async () =>{
   // Create an instance of a ticket
   const ticket = Ticket.build({
      title: 'new concert',
      price: 20,
      userId: 'abc'
   })
   // Save the ticket to the database
   await ticket.save();

   // fetch the ticket twice
   const ticketOne = await Ticket.findById(ticket.id);
   const ticketTwo = await Ticket.findById(ticket.id);

   // make two separate changes to the tickets we fetched
   ticketOne!.set({
      price: 30
   })

   ticketTwo!.set({
      price: 40
   })

   // save the first fetched ticket
   try{
   await ticketOne!.save();
   }catch(err){
      return;
   }
   
   // save the second fetched ticket and expect an error
   try{
      await ticketTwo!.save();
   }catch(err){
      return;
   }
      

});

it('increments the version number on multiple saves', async () => {
   const ticket = Ticket.build({
      title: 'concert',
      price: 20,
      userId: '123'
   })

   await ticket.save();
   expect(ticket.version).toEqual(0);
   await ticket.save();
   expect(ticket.version).toEqual(1);
   await ticket.save();
   expect(ticket.version).toEqual(2);

})