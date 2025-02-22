import { Publisher, Subjects, TicketUpdatedEvent } from '@sbmytickets/common';

export class TicketUpdatedPublisher extends Publisher < TicketUpdatedEvent> {
   readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
