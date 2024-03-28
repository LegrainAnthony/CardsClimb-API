import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class TagRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.tag.findMany();
  }

  create(tag: Prisma.TagCreateInput) {
    return this.prismaService.tag.create({
      data: tag
    });
  }
}