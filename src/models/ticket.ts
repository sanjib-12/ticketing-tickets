import mongoose from 'mongoose';

// This defines a TypeScript interface that specifies the shape of attributes required to create a new ticket. It enforces type safety when creating ticket objects.

interface TicketAttrs {
   title: string;
   price: number;
   userId: string;
}



interface TicketDoc extends mongoose.Document{
   title: string;
   price: number;
   userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
   build(attrs: TicketAttrs): TicketDoc;
}

const ticketsSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   userId:{
      type: String,
      required: true
   }
},
{
   toJSON:{
      transform(doc,ret){
         ret.id = ret._id;
         delete ret._id;
      }
   }
}
);

ticketsSchema.statics.build = (attrs: TicketAttrs) => {
   return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketsSchema);

export { Ticket };