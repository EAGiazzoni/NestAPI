import { PartialType } from '@nestjs/swagger';
import { CreateAnimalDto } from './create-animais.dto';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAnimaisDto extends PartialType(CreateAnimalDto) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  tipoID?: number;

  @IsOptional()
  @IsArray()
  donoID?: number[];
}
