// import { BadRequestException } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { Card, CardType, User } from '@prisma/client';
// import * as moment from 'moment-timezone';
// import { AppModule } from 'src/app.module';
// import { CardsRepository } from 'src/cards/cards.repository';
// import { CardsService } from 'src/cards/cards.service';
// import { CreateCardDto } from 'src/cards/dto/create-card.dto';
// import { PrismaService } from 'src/db/prisma.service';
// import { FilterService } from 'src/filter/filter.service';

// describe('CardService', () => {
//   let prisma: PrismaService;
//   let cardsService: CardsService;
//   let filterService: FilterService
//   let user: User | null = null;

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     prisma = moduleRef.get<PrismaService>(PrismaService);
//     cardsService = moduleRef.get<CardsService>(CardsService);

//     user = await prisma.user.findFirst({
//       where: { id: 1 },
//     });
//   });

//     const datas = {
//         filterOptions : [
//             {
//                 property: "box_id",
//                 filterOptions: [
//                     {
//                         operation: 'equals',
//                         value: 1
//                     }
//                 ]
//             }
//         ]
//     }

//   describe('create', () => {
//     it('/cards (Post)', async () => {
//         return filterService.cardFilter(datas, user!.id, false, 2);
//     })
//   });
// });
