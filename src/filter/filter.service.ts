import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FilterRepository, ModelNames } from './filter.repository';
import { CardsService } from 'src/cards/cards.service';
import { CardFilterDto } from './dto/cards-filter.dto';
import {
  IncludeInputTypes,
  SelectInputType,
  WhereInputTypes,
} from './types/filter-by.type';
import { IdsToGet, filterOptions, subFilterOption } from './interface';
import { isArray } from 'class-validator';

@Injectable()
export class FilterService {
  constructor(
    private readonly filterRepository: FilterRepository,
    @Inject(forwardRef(() => CardsService))
    private readonly cardsService: CardsService,
  ) {}

  private someIdIn(ids: number[]) {
    return {
      some: {
        id: { in: ids },
      },
    };
  }

  private subPropertyFilter(properties: subFilterOption[]) {
    return properties?.reduce((acc, propertyFilter) => {
      const { operation, value } = propertyFilter;
      acc[operation] = value;
      return acc;
    }, {});
  }

  private getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // prisma dont have default ramdom methode without raw query
  private returnRandomIds(cardsWanted: number, ids: IdsToGet[]) {
    const cardIdsToPick = [...ids];
    const idsToGet: number[] = [];
    const n = cardIdsToPick.length;

    for (let i = 0; i < cardsWanted && i < n; i++) {
      // get random number beetwen i and max length - 1
      const randomIndex = this.getRandomNumber(i, n - 1);
      // push the random id into idsToGet

      idsToGet.push(cardIdsToPick[randomIndex].id);
      // swapping the idPicked with the index for dont pick it again
      // [1, 2, 3]
      //  ^ i   ^ picked
      // [3, 2, 1]
      //     ^ i
      // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#:~:text=The%20Fisher%E2%80%93Yates%20shuffle%20is,list%20until%20no%20elements%20remain.
      [cardIdsToPick[randomIndex], cardIdsToPick[i]] = [
        cardIdsToPick[i],
        cardIdsToPick[randomIndex],
      ];
    }
    return idsToGet;
  }

  private iniatePrismaCardQuery(randomResult: boolean) {
    const PrismaCardQuery: {
      where: WhereInputTypes[ModelNames.Card];
      include?: IncludeInputTypes[ModelNames.Card];
      select?: SelectInputType;
    } = {
      where: {},
    };

    if (!randomResult) {
      PrismaCardQuery.include = {
        tags: true,
      };
    } else {
      PrismaCardQuery.select = { id: true };
    }

    return PrismaCardQuery;
  }

  private PrismaCardQuerySeeding(
    cleanedOptions: filterOptions[],
    PrismaCardQuery: {
      where: WhereInputTypes[ModelNames.Card];
      include?: IncludeInputTypes[ModelNames.Card];
      select?: SelectInputType;
    },
  ) {
    const SOME_ID_CARD_PROPERTIES = ['tags', 'box_id'];
    const CARD_PROPERTIES = [
      'reference',
      'created_at',
      'future_revision',
      'last_revision',
      'box_id',
      'tags',
      'user_id',
    ];

    cleanedOptions.forEach((option) => {
      if (
        CARD_PROPERTIES.includes(option.property) &&
        option.filterOptions?.[0].operation !== 'in'
      ) {
        PrismaCardQuery.where![option.property] = this.subPropertyFilter(
          option.filterOptions,
        );
      } else if (
        SOME_ID_CARD_PROPERTIES.includes(option.property) &&
        isArray(option.filterOptions[0].value)
      ) {
        PrismaCardQuery.where![option.property] = this.someIdIn(
          option.filterOptions[0].value,
        );
      }
    });

    return PrismaCardQuery;
  }

  async cardFilter(
    data: CardFilterDto,
    userId: number,
    randomResult: boolean,
    numberOfCard: number,
  ) {
    const { filterOptions } = data;

    const basePrismaCardQuery = this.iniatePrismaCardQuery(randomResult);
    const cleanedOptions = this.cleanFilterDatas(filterOptions, userId);
    const prismaCardQuery = this.PrismaCardQuerySeeding(
      cleanedOptions,
      basePrismaCardQuery,
    );
    const result = await this.filterRepository.filterBy(
      'Card',
      prismaCardQuery,
    );

    if (!randomResult) {
      return result;
    }

    const listOfIds = this.returnRandomIds(numberOfCard, result);
    return this.cardsService.findManyCardByIds(listOfIds, userId);
  }

  cleanFilterDatas(filterOptions: filterOptions[], userId: number) {
    const cleanedFilterOptions = filterOptions.filter(
      (option) => option.property !== 'user_id',
    );

    const filterOptionsFromConnectedUser = [
      ...cleanedFilterOptions,
      {
        property: 'user_id',
        filterOptions: [{ operation: 'equals', value: userId }],
      },
    ];

    return filterOptionsFromConnectedUser;
  }
}
