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
      const modelKeys = Reflect.ownKeys(this).filter(
        (key) =>
          typeof this[key] === 'object' &&
          this[key] !== null &&
          'deleteMany' in this[key],
      );

      return Promise.all(
        modelKeys.map((modelKey) => {
          const model = this[modelKey];
          if (typeof model.deleteMany === 'function') {
            return model.deleteMany();
          }
        }),
      );
    }
  }
}
