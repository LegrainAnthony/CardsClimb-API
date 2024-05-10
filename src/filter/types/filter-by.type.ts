import { Prisma } from '@prisma/client';

type WhereInputTypes = {
  User: Prisma.UserWhereInput;
  Card: Prisma.CardWhereInput;
  Box: Prisma.BoxWhereInput;
  BoxStep: Prisma.BoxStepWhereInput;
  Tag: Prisma.TagWhereInput;
  CardType: Prisma.CardTypeWhereInput;
  Color: Prisma.ColorWhereInput;
};

type IncludeInputTypes = {
  User: Prisma.UserInclude;
  Card: Prisma.CardInclude;
  Box: Prisma.BoxInclude;
  BoxStep: Prisma.BoxStepInclude;
  Tag: Prisma.TagInclude;
  CardType: Prisma.CardTypeInclude;
  Color: Prisma.ColorInclude;
};

type SelectInputType = {
  id: boolean;
};

export { WhereInputTypes, IncludeInputTypes, SelectInputType };
