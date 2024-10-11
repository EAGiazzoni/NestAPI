import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CreateAnimalDonoDTO {
  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  donosID: number[];
}
