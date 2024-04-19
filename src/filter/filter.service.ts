import { Injectable } from '@nestjs/common';
import { FilterRepository } from './filter.repository';

@Injectable()
export class FilterService {
  constructor(private readonly filterRepository: FilterRepository) {}

  async test() {
    // console.log(this.filterRepository);

    console.log(
      await this.filterRepository.filterBy('Card', {
        where: { box_id: 1 },
        include: {
          tags: true,
        },
      }),
    );
  }
}
