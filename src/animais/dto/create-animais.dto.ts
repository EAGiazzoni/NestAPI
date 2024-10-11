import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAnimalDto {
  @ApiProperty({ example: 'Nome do animal' })
  @IsString({ message: 'DEVE SER STRING' })
  @MaxLength(150)
  @IsNotEmpty({ message: 'O ANIMAL TEM NOME!' })
  name: string;

  @IsArray()
  @IsOptional()
  tipoID?: number;

  @IsArray()
  @IsOptional()
  donoID?: number[];
}
