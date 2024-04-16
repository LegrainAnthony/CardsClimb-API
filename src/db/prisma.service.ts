import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }


  async onModuleInit() {
    await this.$connect();
  }

  async clearDatabase() {
    if (process.env.NODE_ENV === 'test') {
      await this.card.deleteMany();

      await this.boxStep.deleteMany();

      await this.tag.deleteMany();

      await this.box.deleteMany();

      await this.cardType.deleteMany();

      await this.user.deleteMany();

      await this.color.deleteMany();

      console.log('Database cleared successfully');
    }
  }
}
