import { PartialType } from "@nestjs/mapped-types";
import { CreateCardDto } from "./create-card.dto";

export class updateCardDto extends PartialType (CreateCardDto) {

}

// export class updateCardByUserDto () {
    
// }