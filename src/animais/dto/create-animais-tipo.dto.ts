import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CreateAnimalTipoDTO {
  @ApiProperty({
    type: Number,
  })
  @IsArray()
  tiposID: number;
}
