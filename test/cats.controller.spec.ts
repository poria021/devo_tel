// import { TicketController } from 'src/ticket/ticket.controller';
// import { TicketService } from 'src/ticket/ticket.service';
// import { ConfigService } from '@nestjs/config';
// import { HttpService } from '@nestjs/axios';
// import { Content } from 'src/ticket/temp.service';

// describe('CatsController', () => {
//   let catsController;
//   let ticketServices;

//   beforeEach(() => {
//     ticketServices = new TicketService(
//       new ConfigService(),
//       new HttpService(),
//       new Content(),
//     );
//     catsController = new TicketController(ticketServices());
//   });

//   describe('findAll', () => {
//     it('should return an array of cats', async () => {
//       const result = ['test'];
//       jest.spyOn(ticketServices, 'findAll').mockImplementation(() => result);

//       expect(await catsController.findAll()).toBe(result);
//     });
//   });
// });
